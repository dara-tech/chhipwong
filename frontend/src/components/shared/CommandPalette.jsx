import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, RefreshCw, Clock, Zap, Settings, Database, AlertCircle } from 'lucide-react';
import { API_COMMANDS } from '../../utils/api';

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: API_COMMANDS.CLEAR_CACHE,
      title: 'Clear Cache',
      description: 'Clear all cached data',
      icon: Database,
      action: () => API_COMMANDS.execute(API_COMMANDS.CLEAR_CACHE)
    },
    {
      id: API_COMMANDS.FORCE_REFRESH,
      title: 'Force Refresh',
      description: 'Clear cache and force refresh all data',
      icon: RefreshCw,
      action: () => API_COMMANDS.execute(API_COMMANDS.FORCE_REFRESH)
    },
    {
      id: API_COMMANDS.TOGGLE_BACKGROUND_REFRESH,
      title: 'Toggle Background Refresh',
      description: 'Enable/disable background data refresh',
      icon: Zap,
      action: () => API_COMMANDS.execute(API_COMMANDS.TOGGLE_BACKGROUND_REFRESH)
    },
    {
      id: API_COMMANDS.SET_CACHE_DURATION,
      title: 'Set Cache Duration',
      description: 'Change cache duration for different data types',
      icon: Clock,
      action: () => {
        const type = prompt('Enter cache type (MARKET_DATA, HISTORICAL_DATA, COIN_DETAILS):');
        const duration = prompt('Enter duration in minutes:');
        if (type && duration) {
          return API_COMMANDS.execute(API_COMMANDS.SET_CACHE_DURATION, type, parseInt(duration));
        }
      }
    },
    {
      id: API_COMMANDS.SET_RATE_LIMIT,
      title: 'Set Rate Limit',
      description: 'Configure API rate limiting',
      icon: Settings,
      action: () => {
        const maxRequests = prompt('Enter max requests:');
        const timeWindow = prompt('Enter time window in seconds:');
        if (maxRequests && timeWindow) {
          return API_COMMANDS.execute(API_COMMANDS.SET_RATE_LIMIT, parseInt(maxRequests), parseInt(timeWindow));
        }
      }
    },
    {
      id: API_COMMANDS.RESET_RATE_LIMIT,
      title: 'Reset Rate Limit',
      description: 'Reset current rate limit state',
      icon: AlertCircle,
      action: () => API_COMMANDS.execute(API_COMMANDS.RESET_RATE_LIMIT)
    },
    {
      id: API_COMMANDS.SHOW_STATUS,
      title: 'Show Status',
      description: 'Display current API status',
      icon: Search,
      action: () => {
        const status = API_COMMANDS.execute(API_COMMANDS.SHOW_STATUS);
        console.log('API Status:', status);
        return 'Status logged to console';
      }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          const result = filteredCommands[selectedIndex].action();
          console.log('Command result:', result);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-900"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    const result = cmd.action();
                    console.log('Command result:', result);
                    onClose();
                  }}
                  className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{cmd.title}</div>
                    <div className="text-sm text-gray-500">{cmd.description}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-gray-100 rounded">↑↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-gray-100 rounded">enter</span>
                <span>to select</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="px-2 py-1 bg-gray-100 rounded">esc</span>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette; 