import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('❌ TELEGRAM_BOT_TOKEN is not defined in environment variables.');
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

const messageQueue = [];
let isProcessing = false;
let lastMessageTime = 0;
const MIN_DELAY = 3000; // 3 seconds
const MAX_RETRIES = 5; // Maximum retry attempts
const PRIORITY_LEVELS = { high: 0, normal: 1, low: 2 };
const ADAPTIVE_DELAY_FACTOR = 1.5; // Increase delay by 50% after each rate limit

// Adaptive delay tracking
let currentDelayMs = MIN_DELAY;
let consecutiveRateLimits = 0;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Smart queue processor with adaptive rate limiting and priority handling
 */
async function processQueue() {
    if (isProcessing || messageQueue.length === 0) return;

    isProcessing = true;
    
    // Sort queue by priority level
    messageQueue.sort((a, b) => (a.priority || PRIORITY_LEVELS.normal) - (b.priority || PRIORITY_LEVELS.normal));

    while (messageQueue.length > 0) {
        const { message, chatId, resolve, reject, retryCount = 0, priority } = messageQueue[0];

        const now = Date.now();
        const timeSinceLastMessage = now - lastMessageTime;
        if (timeSinceLastMessage < currentDelayMs) {
            await delay(currentDelayMs - timeSinceLastMessage);
        }

        try {
            const result = await bot.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });
            messageQueue.shift();
            lastMessageTime = Date.now();
            
            // Gradually reduce delay if successful and we previously increased it
            if (consecutiveRateLimits > 0 && currentDelayMs > MIN_DELAY) {
                currentDelayMs = Math.max(MIN_DELAY, currentDelayMs / ADAPTIVE_DELAY_FACTOR);
                consecutiveRateLimits = Math.max(0, consecutiveRateLimits - 1);
            }
            
            resolve(result);
        } catch (error) {
            console.error(`❌ Telegram send error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);

            // Rate limit (Too Many Requests)
            if (error.response?.statusCode === 429) {
                const retryAfter = (error.response.body?.parameters?.retry_after || 30) * 1000;
                consecutiveRateLimits++;
                currentDelayMs = Math.min(60000, currentDelayMs * ADAPTIVE_DELAY_FACTOR); // Cap at 1 minute
                
                console.warn(`⏳ Rate limited. Retrying in ${retryAfter / 1000} seconds... (Adaptive delay: ${currentDelayMs}ms)`);
                await delay(retryAfter);
                
                // Update retry count in the queue
                messageQueue[0].retryCount = retryCount + 1;
                
                if (retryCount < MAX_RETRIES) {
                    continue; // Retry same message
                }
            }

            // Either non-retryable error or max retries reached
            messageQueue.shift();
            reject(error);
        }
    }

    isProcessing = false;
}

/**
 * Send a basic alert message to Telegram (with queue + adaptive rate limit)
 * @param {string} message - Telegram message (MarkdownV2 formatted)
 * @param {string} chatId - Telegram Chat ID
 * @param {Object} [options] - Additional options
 * @param {string} [options.priority='normal'] - Priority: 'high', 'normal', or 'low'
 */
export const sendTelegramAlert = (message, chatId, options = {}) => {
    if (!chatId) {
        throw new Error('❌ Chat ID is required to send a Telegram message.');
    }

    const { priority = 'normal' } = options;
    
    return new Promise((resolve, reject) => {
        messageQueue.push({ 
            message, 
            chatId, 
            resolve, 
            reject, 
            priority: PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.normal,
            retryCount: 0
        });
        processQueue();
    });
};

/**
 * Send a formatted alert (with emoji and markdown)
 * @param {Object} options
 * @param {string} options.title - Title of the alert
 * @param {string} options.message - Body of the alert
 * @param {string} [options.type=info] - Type: info | warning | error
 * @param {string} options.chatId - Telegram Chat ID
 * @param {string} [options.priority='normal'] - Priority: high | normal | low
 */
export const sendFormattedAlert = async ({ title, message, type = 'info', chatId, priority = 'normal' }) => {
    const emoji = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '🚨',
        success: '✅'
    };

    const formattedMessage = `${emoji[type] || emoji.info} *${escapeMarkdown(title)}*\n\n${escapeMarkdown(message)}`;
    return sendTelegramAlert(formattedMessage, chatId, { priority });
};

/**
 * Escape special characters for MarkdownV2 formatting in Telegram
 */
function escapeMarkdown(text) {
    return text.toString().replace(/([\\`*_\[\]()~>#+\-=|{}.!])/g, '\\$1');
}
