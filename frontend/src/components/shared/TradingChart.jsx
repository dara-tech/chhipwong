import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Bar, BarChart } from 'recharts';
import { RefreshCw, ZoomIn, ZoomOut, TrendingUp, TrendingDown, Activity, DollarSign, Calendar, BarChart3, Maximize2, Minimize2, ChevronDown, AlertCircle } from 'lucide-react';
import { useFetch, API } from '../../utils/api';
import { ChartSkeleton, ErrorMessage } from './SkeletonLoader';

const POPULAR_COINS = [
  { id: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'BNBUSDT', name: 'Binance Coin', symbol: 'BNB', color: '#F3BA2F', logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { id: 'SOLUSDT', name: 'Solana', symbol: 'SOL', color: '#9945FF', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'ADAUSDT', name: 'Cardano', symbol: 'ADA', color: '#0033AD', logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
  { id: 'XRPUSDT', name: 'XRP', symbol: 'XRP', color: '#23292F', logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
  { id: 'DOTUSDT', name: 'Polkadot', symbol: 'DOT', color: '#E6007A', logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
  { id: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633', logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' }
];

const TIME_RANGES = [
  { value: '1h', label: '1H', description: 'Last hour', interval: '1m', limit: 60 },
  { value: '1d', label: '24H', description: 'Last 24 hours', interval: '1h', limit: 24 },
  { value: '7d', label: '7D', description: 'Last 7 days', interval: '4h', limit: 42 },
  { value: '30d', label: '30D', description: 'Last 30 days', interval: '1d', limit: 30 },
  { value: '90d', label: '90D', description: 'Last 90 days', interval: '1d', limit: 90 },
  { value: '1y', label: '1Y', description: 'Last year', interval: '1d', limit: 365 }
];

const CHART_TYPES = [
  { value: 'line', label: 'Line', icon: Activity },
  { value: 'area', label: 'Area', icon: BarChart3 },
  { value: 'candle', label: 'Volume', icon: Maximize2 }
];

const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="card-body p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-base-content/70">{label}</span>
        </div>
        {change !== null && change !== undefined && (
          <div className={`badge ${isPositive ? 'badge-success' : 'badge-error'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs font-semibold">{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
      <p className="text-lg font-bold text-base-content">{value}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const date = new Date(label);
  
  return (
    <div className="card bg-base-100 shadow-lg border border-base-200 backdrop-blur-sm">
      <div className="card-body p-4">
        <p className="text-sm text-base-content/70 mb-2">
          {date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-base-content">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-base-content">
                {entry.name.toLowerCase().includes('volume') 
                  ? `$${(entry.value / 1000000).toFixed(2)}M`
                  : `$${parseFloat(entry.value).toLocaleString()}`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <span className="ml-2 text-base-content/70">Loading market data...</span>
  </div>
);

const CryptoLogo = ({ coin, size = 'md' }) => {
  const [imgSrc, setImgSrc] = useState(coin.logo);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hasError) return;
    setHasError(true);
    setImgSrc(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coin.symbol.toLowerCase()}.png`);
  };

  if (hasError || !imgSrc) {
    return (
      <div
        className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold text-sm text-base-100 shadow-sm ring-2 ring-base-100`}
        style={{ backgroundColor: coin.color || 'hsl(var(--n))' }}
      >
        {coin.symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        className={`h-8 w-8 md:h-10 md:w-10 rounded-full shadow-sm ring-2 ring-base-100 bg-base-100 p-0.5 object-contain`}
        src={imgSrc}
        alt={coin.name}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

const AdvancedTradingChart = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('line');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedTimeRange = TIME_RANGES.find(r => r.value === timeRange);

  // Fetch historical data
  const { data: chartData, isLoading: isChartLoading, error: chartError, retry: retryChart } = useFetch(
    API.getHistoricalData(selectedCoin, selectedTimeRange.interval, selectedTimeRange.limit),
    { enabled: isOnline }
  );

  // Fetch coin details
  const { data: coinData, isLoading: isCoinLoading, error: coinError, retry: retryCoin } = useFetch(
    API.getCoinDetails(selectedCoin),
    { enabled: isOnline }
  );

  const isLoading = isChartLoading || isCoinLoading;
  const error = chartError || coinError;

  const handleRefresh = () => {
    if (!isOnline) return;
    setZoomLevel(1); // Reset zoom level
    retryChart();
    retryCoin();
  };

  // Reset zoom level when data changes
  useEffect(() => {
    setZoomLevel(1);
  }, [chartData, selectedCoin, timeRange]);

  // Process chart data
  const processedChartData = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    
    return chartData.map(candle => ({
      date: new Date(candle[0]),
      timestamp: candle[0],
      price: parseFloat(candle[4]), // Close price
      volume: parseFloat(candle[5]), // Volume
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3])
    }));
  }, [chartData]);

  // Calculate price statistics
  const priceStats = useMemo(() => {
    if (!processedChartData.length || !coinData) return { 
      priceChange: 0, 
      currentPrice: 0, 
      volume24h: 0, 
      marketCap: 0 
    };
    
    const currentPrice = parseFloat(coinData.lastPrice);
    const priceChange = parseFloat(coinData.priceChangePercent);
    const volume24h = parseFloat(coinData.volume);
    const marketCap = currentPrice * parseFloat(coinData.quoteVolume);
    
    return {
      priceChange,
      currentPrice,
      volume24h,
      marketCap
    };
  }, [processedChartData, coinData]);

  const selectedCoinData = POPULAR_COINS.find(coin => coin.id === selectedCoin);

  const handleZoom = useCallback((direction) => {
    setZoomLevel(prev => {
      if (direction === 'in' && prev < 2) return prev + 0.25;
      if (direction === 'out' && prev > 0.5) return prev - 0.25;
      return prev;
    });
  }, []);

  const renderChart = () => {
    if (isLoading) return <ChartSkeleton />;
    if (error) return <ErrorMessage message={error.message} onRetry={handleRefresh} />;
    if (!processedChartData.length) return <div className="text-center p-8 text-gray-500">No data available</div>;

    const chartProps = {
      data: processedChartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const xAxisProps = {
      dataKey: "date",
      tick: { fontSize: 12, fill: '#6B7280' },
      tickFormatter: (value) => {
        const date = new Date(value);
        return timeRange === '1h' 
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' }
    };

    const yAxisProps = {
      domain: ['auto', 'auto'],
      tickFormatter: (value) => `$${value.toLocaleString()}`,
      width: 80,
      tick: { fontSize: 12, fill: '#6B7280' },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ stroke: selectedCoinData?.color, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selectedCoinData?.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={selectedCoinData?.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              name="Price (USD)"
              stroke={selectedCoinData?.color}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        );
      
      case 'candle':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              width={80}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar
              dataKey="volume"
              name="Volume (USD)"
              fill={selectedCoinData?.color}
              opacity={0.7}
            />
          </BarChart>
        );
      
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ stroke: selectedCoinData?.color, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="Price (USD)"
              stroke={selectedCoinData?.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: selectedCoinData?.color, 
                stroke: '#fff', 
                strokeWidth: 2,
                className: 'drop-shadow-lg'
              }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={`card bg-base-100  ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="card-body bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-base-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <CryptoLogo coin={selectedCoinData} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-base-content">
                  {selectedCoinData?.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-base-content/70">{selectedCoinData?.symbol}</span>
                  <span className={`badge ${priceStats.priceChange >= 0 ? 'badge-success' : 'badge-error'}`}>
                    {priceStats.priceChange >= 0 ? '+' : ''}{priceStats.priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-ghost btn-sm"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleZoom('out')}
              disabled={zoomLevel <= 0.5}
              className="btn btn-ghost btn-sm"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoomLevel >= 2}
              className="btn btn-ghost btn-sm"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn btn-ghost btn-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* Mobile Card View for Stats */}
      <div className="block sm:hidden card-body border-b border-base-200">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card bg-base-200">
                <div className="card-body p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-base-300 rounded-lg"></div>
                    <div className="h-4 bg-base-300 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-base-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <StatCard
              icon={DollarSign}
              label="Current Price"
              value={`${priceStats.currentPrice.toLocaleString()}`}
              change={priceStats.priceChange}
              isPositive={priceStats.priceChange >= 0}
            />
            <StatCard
              icon={Activity}
              label="24h Volume"
              value={`${(priceStats.volume24h / 1000000).toFixed(2)}M`}
            />
            <StatCard
              icon={TrendingUp}
              label="Market Cap"
              value={`${(priceStats.marketCap / 1000000000).toFixed(2)}B`}
            />
            <StatCard
              icon={Calendar}
              label="Period"
              value={TIME_RANGES.find(r => r.value === timeRange)?.description}
            />
          </div>
        )}
      </div>
      {/* Desktop Stats Grid (hidden on mobile) */}
      <div className="hidden sm:block card-body border-b border-base-200">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-base-300 rounded-lg"></div>
                        <div className="h-4 bg-base-300 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-base-300 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-base-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={DollarSign}
              label="Current Price"
              value={`${priceStats.currentPrice.toLocaleString()}`}
              change={priceStats.priceChange}
              isPositive={priceStats.priceChange >= 0}
            />
            <StatCard
              icon={Activity}
              label="24h Volume"
              value={`${(priceStats.volume24h / 1000000).toFixed(2)}M`}
            />
            <StatCard
              icon={TrendingUp}
              label="Market Cap"
              value={`${(priceStats.marketCap / 1000000000).toFixed(2)}B`}
            />
            <StatCard
              icon={Calendar}
              label="Period"
              value={TIME_RANGES.find(r => r.value === timeRange)?.description}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="card-body border-b border-base-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline normal-case font-normal">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-bold text-lg" style={{color: selectedCoinData?.color}}>{selectedCoinData?.symbol}</span>
                  <span className="truncate">{selectedCoinData?.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-base-content/50 flex-shrink-0" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-56 mt-2">
                {POPULAR_COINS.map(coin => (
                  <li key={coin.id}>
                    <button 
                      onClick={() => {
                        setSelectedCoin(coin.id);
                        if (document.activeElement) {
                          document.activeElement.blur();
                        }
                      }} 
                      className="flex items-center gap-2 w-full"
                    >
                      <CryptoLogo coin={coin} size="sm" />
                      <span>{coin.name} ({coin.symbol})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="join">
              {TIME_RANGES.map(range => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`join-item btn btn-sm ${
                    timeRange === range.value
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="join">
            {CHART_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setChartType(type.value)}
                  className={`join-item btn btn-sm ${
                    chartType === type.value
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card-body">
        <div 
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center',
            height: isFullscreen ? '60vh' : '400px'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="card-body bg-base-200/50 border-t border-base-200">
        <div className="flex justify-between items-center text-sm text-base-content/70">
          <p className="flex items-center space-x-2">
            <span>Powered by Binance API</span>
            <span className={`w-2 h-2 rounded-full ${error ? 'bg-error' : 'bg-success'}`}></span>
          </p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTradingChart;