// visitTracker.js
import { sendTelegramAlert } from '../utils/telegramAlert.js';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import Viewer from '../models/Viewer.js';

export const trackVisit = async (req, res, next) => {
    const referrer = req.headers['referer'] || '';
    const isFrontendVisit =
        referrer.includes('localhost:5173') ||
        referrer.includes('khhara.com') ||
        referrer.includes('www.khhara.com') ||
        referrer.includes('crypto-nmz7.onrender.com');

    // referrer.includes('daracheol.com')
    const isAssetRequest = req.path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|ttf|map)$/i);

    if (!isFrontendVisit || req.path === '/favicon.ico' || isAssetRequest) {
        return next();
    }

    if (req.cookies?._visited) {
        return next();
    }

    res.cookie('_visited', 'true', {
        maxAge: 10 * 60 * 1000, // 10 minutes
        httpOnly: true,
        sameSite: 'Strict',
    });

    try {
        const rawIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const ip = (rawIP === '::1' || rawIP === '127.0.0.1') ? '8.8.8.8' : rawIP;

        const ua = new UAParser(req.headers['user-agent']);
        const browser = ua.getBrowser();
        const os = ua.getOS();
        const device = ua.getDevice();
        const geo = geoip.lookup(ip);

        const queryParams =
            Object.keys(req.query).length > 0
                ? `\nQuery Params: ${JSON.stringify(req.query)}`
                : '';

        // Save to DB (only one per IP, update if exists)
        await Viewer.findOneAndUpdate(
            { ip },
            {
                location: geo,
                userAgent: req.headers['user-agent'],
                path: req.path,
                referrer,
                visitedAt: new Date()
            },
            { upsert: true, new: true }
        );

        const message = `🚨 *New Website Visit*\n` +
            `*Path:* ${escapeMarkdown(req.path)}${escapeMarkdown(queryParams)}\n` +
            `*Referrer:* ${escapeMarkdown(referrer)}\n\n` +
            `*Location:*\n` +
            `• Country: ${geo ? `${escapeMarkdown(geo.country)} ${getCountryFlag(geo.country)}` : 'Unknown'}\n` +
            `• City: ${geo ? escapeMarkdown(geo.city || 'Unknown') : 'Unknown'}\n` +
            `• Timezone: ${geo ? escapeMarkdown(geo.timezone || 'Unknown') : 'Unknown'}\n\n` +
            `*Device Info:*\n` +
            `• Browser: ${escapeMarkdown(browser.name || 'Unknown')} ${escapeMarkdown(browser.version || '')}\n` +
            `• OS: ${escapeMarkdown(os.name || 'Unknown')} ${escapeMarkdown(os.version || '')}\n` +
            `• Device: ${escapeMarkdown(getDeviceInfo(device))}\n\n` +
            `*Technical Details:*\n` +
            `• IP: ${escapeMarkdown(maskIP(ip))}\n` +
            `• Method: ${escapeMarkdown(req.method)}\n` +
            `• Time: ${escapeMarkdown(new Date().toLocaleString())}\n` +
            `• Protocol: ${escapeMarkdown(req.protocol.toUpperCase())}`;

        // Fire-and-forget the Telegram alert without awaiting to avoid blocking the request.
        sendTelegramAlert(message, process.env.TELEGRAM_CHAT_ID).catch(err => {
            // Log errors but do not block the request.
            console.error('Telegram alert failed to send:', err.message);
        });
    } catch (error) {
        console.error('Failed to track visit:', error.message);
    }

    next();
};

// Utility functions
function maskIP(ip) {
    if (!ip || ip === '::1' || ip === '127.0.0.1') return 'localhost';
    return ip;
}

function getCountryFlag(countryCode) {
    if (!countryCode) return '';
    const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function getDeviceInfo(device) {
    if (device.type) {
        return `${device.type} ${device.vendor || ''} ${device.model || ''}`.trim();
    }
    return 'Desktop/Laptop';
}

function escapeMarkdown(text) {
    return text.toString().replace(/[\\`*_{}\[\]()#+\-.!]/g, '\\$&');
}
