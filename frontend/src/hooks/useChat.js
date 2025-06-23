import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid'; // For unique message IDs

// Load messages from localStorage
const loadMessages = () => {
  try {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
};

const useChat = () => {
  const [messages, setMessages] = useState(loadMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize the Google Generative AI client once
  const genAI = useMemo(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing VITE_GEMINI_API_KEY in environment variables');
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  }, []);

  const createMessage = (text, sender, status = 'sent') => ({
    id: uuidv4(),
    text,
    sender,
    status,
    timestamp: new Date().toISOString(),
    isEdited: false
  });

  const updateMessage = (id, updates) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates, ...(updates.text ? { isEdited: true } : {}) } : msg
      )
    );
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const suggestReplies = useCallback((message) => {
    // This is a simplified version. In a real app, you might want to generate these based on context
    const suggestions = [
      'Tell me more about this',
      'Can you explain that differently?',
      'Thanks!',
      'How does this work?'
    ];
    return suggestions;
  }, []);

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setMessages(prev => prev.filter(msg => msg.status !== 'sending'));
    }
  }, []);

  const sendMessage = useCallback(async (input, messageId = null) => {
    if ((!input || input.trim() === '') || (isLoading && !messageId)) return;

    const userMessage = messageId 
      ? null 
      : createMessage(input, 'user', 'sending');
    
    const botMessage = createMessage('', 'bot', 'sending');

    setMessages(prev => {
      const newMessages = [...prev];
      if (userMessage) newMessages.push(userMessage);
      newMessages.push(botMessage);
      return newMessages;
    });

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      // Get conversation history
      const history = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      // Add typing indicator
      setIsTyping(true);
      
      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Send message with streaming
      const result = await chat.sendMessageStream(input);
      let fullResponse = '';
      
      for await (const chunk of result.stream) {
        if (abortControllerRef.current?.signal.aborted) break;
        const chunkText = chunk.text();
        fullResponse += chunkText;
        updateMessage(botMessage.id, { text: fullResponse });
      }

      // Update final message status
      updateMessage(botMessage.id, { 
        status: 'sent',
        suggestions: suggestReplies(fullResponse)
      });

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      console.error('Error sending message to Gemini:', err);
      setError('Failed to get response. Please try again.');
      updateMessage(botMessage.id, { status: 'error', text: 'Failed to get response' });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, messages, genAI]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    // Clear messages from localStorage as well
    try {
      localStorage.removeItem('chatMessages');
    } catch (error) {
      console.error('Failed to clear messages from localStorage:', error);
    }
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    isTyping,
    sendMessage, 
    updateMessage, 
    deleteMessage,
    clearMessages,
    abortRequest,
    suggestReplies,
    chatEndRef
  };
};

export default useChat;
