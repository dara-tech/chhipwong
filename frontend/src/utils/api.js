import { useState, useEffect, useCallback } from 'react';

// Cache configuration
const CACHE_DURATION = {
  MARKET_DATA: 10 * 60 * 1000, // 10 minutes for market data
  HISTORICAL_DATA: 30 * 60 * 1000, // 30 minutes for historical data
  COIN_DETAILS: 20 * 60 * 1000 // 20 minutes for coin details
};

const cache = new Map();
const fallbackData = new Map();
const requestQueue = [];

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 1200, // Binance allows 1200 requests per minute
  timeWindow: 60 * 1000, // 1 minute
  requests: [],
  lastReset: Date.now(),
  backoffTime: 0,
  progressiveDelay: 0,
  minDelayBetweenRequests: 50 // 50ms between requests is safe for Binance
};

// Request queue processor
const processQueue = async () => {
  if (requestQueue.length === 0) return;
  
  const now = Date.now();
  const timeSinceLastRequest = now - (RATE_LIMIT.requests[RATE_LIMIT.requests.length - 1] || 0);
  
  if (timeSinceLastRequest < RATE_LIMIT.minDelayBetweenRequests) {
    setTimeout(processQueue, RATE_LIMIT.minDelayBetweenRequests - timeSinceLastRequest);
    return;
  }
  
  const { url, options, resolve, reject } = requestQueue.shift();
  
  try {
    const result = await fetchWithCache(url, options);
    resolve(result);
  } catch (error) {
    reject(error);
  }
  
  if (requestQueue.length > 0) {
    setTimeout(processQueue, RATE_LIMIT.minDelayBetweenRequests);
  }
};

// Queue a request
const queueRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ url, options, resolve, reject });
    if (requestQueue.length === 1) {
      processQueue();
    }
  });
};

// Error handling utility
export class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

// Progressive delay utility
const getProgressiveDelay = () => {
  const now = Date.now();
  if (now - RATE_LIMIT.lastReset >= RATE_LIMIT.timeWindow) {
    RATE_LIMIT.progressiveDelay = 0;
    return 0;
  }
  
  const requestCount = RATE_LIMIT.requests.length;
  if (requestCount > RATE_LIMIT.maxRequests * 0.5) {
    RATE_LIMIT.progressiveDelay = Math.min(2000, RATE_LIMIT.progressiveDelay + 500);
  } else {
    RATE_LIMIT.progressiveDelay = Math.max(0, RATE_LIMIT.progressiveDelay - 200);
  }
  
  return RATE_LIMIT.progressiveDelay;
};

// Rate limiting utility
const checkRateLimit = () => {
  const now = Date.now();
  
  // Reset rate limit if time window has passed
  if (now - RATE_LIMIT.lastReset >= RATE_LIMIT.timeWindow) {
    RATE_LIMIT.requests = [];
    RATE_LIMIT.lastReset = now;
    RATE_LIMIT.backoffTime = 0;
    RATE_LIMIT.progressiveDelay = 0;
  }
  
  // Remove old requests
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => now - time < RATE_LIMIT.timeWindow);
  
  // Check if we're in a backoff period
  if (RATE_LIMIT.backoffTime > 0) {
    const timeToWait = RATE_LIMIT.backoffTime - (now - RATE_LIMIT.lastReset);
    if (timeToWait > 0) {
      throw new APIError(`Rate limit backoff. Please wait ${Math.ceil(timeToWait / 1000)} seconds.`, 429);
    }
    RATE_LIMIT.backoffTime = 0;
  }
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    const oldestRequest = RATE_LIMIT.requests[0];
    const timeToWait = RATE_LIMIT.timeWindow - (now - oldestRequest);
    RATE_LIMIT.backoffTime = timeToWait;
    throw new APIError(`Rate limit exceeded. Please wait ${Math.ceil(timeToWait / 1000)} seconds.`, 429);
  }
  
  RATE_LIMIT.requests.push(now);
};

// Cache management
const getCachedData = (key, type) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const cacheDuration = CACHE_DURATION[type] || CACHE_DURATION.MARKET_DATA;
  
  if (Date.now() - cached.timestamp > cacheDuration) {
    // Store as fallback data before deleting
    fallbackData.set(key, {
      data: cached.data,
      timestamp: cached.timestamp
    });
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

const getFallbackData = (key) => {
  const fallback = fallbackData.get(key);
  if (!fallback) return null;
  
  // Keep fallback data for up to 2 hours
  if (Date.now() - fallback.timestamp > 2 * 60 * 60 * 1000) {
    fallbackData.delete(key);
    return null;
  }
  
  return fallback.data;
};

const setCachedData = (key, data, type) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    type
  });
};

// Command system
const COMMANDS = {
  CLEAR_CACHE: 'clear-cache',
  FORCE_REFRESH: 'force-refresh',
  TOGGLE_BACKGROUND_REFRESH: 'toggle-background-refresh',
  SET_CACHE_DURATION: 'set-cache-duration',
  SET_RATE_LIMIT: 'set-rate-limit',
  RESET_RATE_LIMIT: 'reset-rate-limit',
  SHOW_STATUS: 'show-status'
};

let commandHandlers = new Map();
let isBackgroundRefreshEnabled = true;

// Command handler registration
const registerCommand = (command, handler) => {
  commandHandlers.set(command, handler);
};

// Command execution
const executeCommand = (command, ...args) => {
  const handler = commandHandlers.get(command);
  if (handler) {
    return handler(...args);
  }
  throw new Error(`Unknown command: ${command}`);
};

// Register default commands
registerCommand(COMMANDS.CLEAR_CACHE, () => {
  cache.clear();
  fallbackData.clear();
  return 'Cache cleared';
});

registerCommand(COMMANDS.FORCE_REFRESH, () => {
  cache.clear();
  fallbackData.clear();
  RATE_LIMIT.requests = [];
  RATE_LIMIT.lastReset = Date.now();
  RATE_LIMIT.backoffTime = 0;
  RATE_LIMIT.progressiveDelay = 0;
  return 'Forced refresh initiated';
});

registerCommand(COMMANDS.TOGGLE_BACKGROUND_REFRESH, () => {
  isBackgroundRefreshEnabled = !isBackgroundRefreshEnabled;
  return `Background refresh ${isBackgroundRefreshEnabled ? 'enabled' : 'disabled'}`;
});

registerCommand(COMMANDS.SET_CACHE_DURATION, (type, duration) => {
  if (CACHE_DURATION[type]) {
    CACHE_DURATION[type] = duration * 60 * 1000; // Convert minutes to milliseconds
    return `Cache duration for ${type} set to ${duration} minutes`;
  }
  throw new Error(`Invalid cache type: ${type}`);
});

registerCommand(COMMANDS.SET_RATE_LIMIT, (maxRequests, timeWindow) => {
  RATE_LIMIT.maxRequests = maxRequests;
  RATE_LIMIT.timeWindow = timeWindow * 1000; // Convert seconds to milliseconds
  return `Rate limit set to ${maxRequests} requests per ${timeWindow} seconds`;
});

registerCommand(COMMANDS.RESET_RATE_LIMIT, () => {
  RATE_LIMIT.requests = [];
  RATE_LIMIT.lastReset = Date.now();
  RATE_LIMIT.backoffTime = 0;
  RATE_LIMIT.progressiveDelay = 0;
  return 'Rate limit reset';
});

registerCommand(COMMANDS.SHOW_STATUS, () => {
  return {
    cacheSize: cache.size,
    fallbackSize: fallbackData.size,
    queueSize: requestQueue.length,
    rateLimit: {
      current: RATE_LIMIT.requests.length,
      max: RATE_LIMIT.maxRequests,
      window: RATE_LIMIT.timeWindow / 1000,
      backoff: RATE_LIMIT.backoffTime / 1000,
      progressiveDelay: RATE_LIMIT.progressiveDelay
    },
    backgroundRefresh: isBackgroundRefreshEnabled
  };
});

// Export commands
export const API_COMMANDS = {
  ...COMMANDS,
  execute: executeCommand
};

// Binance API configuration
const BINANCE_API = {
  BASE_URL: 'https://api.binance.com/api/v3',
  WS_URL: 'wss://stream.binance.com:9443/ws',
  
  // Market data endpoints
  getMarketData: (params = {}) => {
    // Binance requires specific parameters for ticker/24hr
    const queryParams = new URLSearchParams();
    if (params.symbol) {
      queryParams.append('symbol', params.symbol.toUpperCase());
    }
    return `${BINANCE_API.BASE_URL}/ticker/24hr?${queryParams}`;
  },
  
  // Historical data endpoints
  getHistoricalData: (symbol, interval = '1d', limit = 365) => {
    const queryParams = new URLSearchParams({
      symbol: symbol.toUpperCase(),
      interval,
      limit: limit.toString()
    });
    
    return `${BINANCE_API.BASE_URL}/klines?${queryParams}`;
  },
  
  // Coin details endpoint
  getCoinDetails: (symbol) => {
    const queryParams = new URLSearchParams({
      symbol: symbol.toUpperCase()
    });
    
    return `${BINANCE_API.BASE_URL}/ticker/24hr?${queryParams}`;
  },

  // Get all trading pairs
  getAllSymbols: () => {
    return `${BINANCE_API.BASE_URL}/exchangeInfo`;
  }
};

// Main fetch utility
export const fetchWithCache = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cacheType = url.includes('klines') ? 'HISTORICAL_DATA' : 
                   url.includes('ticker') ? 'MARKET_DATA' : 
                   'COIN_DETAILS';
  
  // Try to get from cache first
  const cachedData = getCachedData(cacheKey, cacheType);
  if (cachedData) {
    return cachedData;
  }

  // Try to get fallback data
  const fallback = getFallbackData(cacheKey);
  if (fallback && isBackgroundRefreshEnabled) {
    // Queue a background refresh
    queueRequest(url, options).then(data => {
      setCachedData(cacheKey, data, cacheType);
    }).catch(() => {
      // Ignore errors in background refresh
    });
    return fallback;
  }

  try {
    checkRateLimit();
    
    // Add progressive delay
    const delay = getProgressiveDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
      RATE_LIMIT.backoffTime = retryAfter * 1000;
      
      // Try to get fallback data
      const fallback = getFallbackData(cacheKey);
      if (fallback) {
        return fallback;
      }
      
      throw new APIError(
        `Rate limit exceeded. Please wait ${retryAfter} seconds.`,
        429
      );
    }
    
    if (response.status === 401) {
      throw new APIError('Unauthorized access. Please check your API configuration.', 401);
    }
    
    if (!response.ok) {
      // Try to get fallback data on any error
      const fallback = getFallbackData(cacheKey);
      if (fallback) {
        return fallback;
      }
      
      throw new APIError(`HTTP error! status: ${response.status}`, response.status);
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data, cacheType);
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Try to get fallback data on network errors
    const fallback = getFallbackData(cacheKey);
    if (fallback) {
      return fallback;
    }
    
    throw new APIError(error.message || 'Failed to fetch data', 500);
  }
};

// Custom hook for data fetching
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const result = await fetchWithCache(url, options);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      // If rate limited, wait for the specified time before retrying
      if (err.status === 429) {
        const retryAfter = parseInt(err.message.match(/\d+/)[0], 10);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryAfter * 1000);
      }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [url, JSON.stringify(options)]);

  const retry = useCallback(() => {
    setIsRefetching(true);
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, retryCount]);

  return { 
    data, 
    isLoading, 
    error, 
    retry, 
    refetch: () => fetchData(true),
    isRefetching 
  };
};

// Export Binance API
export const API = BINANCE_API; 