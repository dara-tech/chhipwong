import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useCompanies from '../../hooks/useCompanies';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useFetch, API } from '../../utils/api';

const CRYPTO_IMAGES = {
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
};

const CryptoLogo = ({ symbol, size = 8 }) => {
  const imageUrl = CRYPTO_IMAGES[symbol];
  
  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-base-200 flex items-center justify-center`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={symbol} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${symbol}&background=random`;
          }}
        />
      ) : (
        <span className="text-primary font-bold">{symbol[0]}</span>
      )}
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');
  
  // Fetch real-time crypto data
  const { data: marketData, isLoading } = useFetch(API.getMarketData());

  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getCompanies();
      setInitialFetchComplete(true);
    };
    fetchData();
  }, []);

  const overallLoading = !initialFetchComplete || companiesLoading;
  const company = companies?.[0];

  const btcData = marketData?.find(coin => coin.symbol === 'BTCUSDT');
  const ethData = marketData?.find(coin => coin.symbol === 'ETHUSDT');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change) => {
    return `${parseFloat(change) >= 0 ? '+' : ''}${parseFloat(change).toFixed(2)}%`;
  };

  return (
    <section className="relative bg-base-200 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side: Hero Content */}
          <div className="relative z-10 space-y-6 sm:space-y-8 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="badge badge-primary gap-2 text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  {company?.tagline || t('hero.tagline')}
                </span>
                <span className="badge badge-outline gap-2 text-xs sm:text-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  Secure Trading
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-base-content leading-tight">
                {company?.name || t('hero.title')}
                <span className="text-primary block mt-1 sm:mt-2"> Your Trusted escrow service</span>
              </h1>

              <p className="text-base sm:text-lg text-base-content/70 max-w-lg">
                {company?.description || t('hero.subtitle')}
                <Link to="/about" className="link link-primary font-medium ml-1">
                  {t('hero.learnMore')}
                </Link>
              </p>

              {/* Live Market Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                {!isLoading && btcData && (
                  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all">
                    <div className="card-body p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CryptoLogo symbol="BTC" size={8} />
                          <span className="font-medium text-sm sm:text-base">BTC</span>
                        </div>
                        <div className={`badge badge-sm sm:badge-md ${parseFloat(btcData.priceChangePercent) >= 0 ? 'badge-success' : 'badge-error'}`}>
                          {parseFloat(btcData.priceChangePercent) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatChange(btcData.priceChangePercent)}
                        </div>
                      </div>
                      <p className="text-lg sm:text-xl font-bold mt-2">{formatPrice(parseFloat(btcData.lastPrice))}</p>
                    </div>
                  </div>
                )}

                {!isLoading && ethData && (
                  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all">
                    <div className="card-body p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CryptoLogo symbol="ETH" size={8} />
                          <span className="font-medium text-sm sm:text-base">ETH</span>
                        </div>
                        <div className={`badge badge-sm sm:badge-md ${parseFloat(ethData.priceChangePercent) >= 0 ? 'badge-success' : 'badge-error'}`}>
                          {parseFloat(ethData.priceChangePercent) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatChange(ethData.priceChangePercent)}
                        </div>
                      </div>
                      <p className="text-lg sm:text-xl font-bold mt-2">{formatPrice(parseFloat(ethData.lastPrice))}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg gap-2 w-full sm:w-auto"
                >
                  Start Trading
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="btn btn-outline btn-lg w-full sm:w-auto"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right side: Hero Image with Chart Overlay */}
          <div className="relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10"
            >
              {overallLoading ? (
                <div className="w-full h-48 sm:h-64 bg-base-300 rounded-lg"></div>
              ) : (
                <div className="relative">
                  <motion.img
                    src={company?.heroImage || '/images/hero-placeholder.jpg'}
                    alt={company?.name || 'Company Hero'}
                    className="w-full h-auto max-w-lg mx-auto rounded-full bg-primary/70 shadow-xl"
                  />
                  
                  {/* Chart Preview Overlay */}
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-48 sm:w-64">
                    <div className="card bg-base-100/95 backdrop-blur shadow-xl">
                      <div className="card-body p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CryptoLogo symbol="BTC" size={8} />
                            <div>
                              <h3 className="font-bold text-xs sm:text-sm">Bitcoin</h3>
                              <p className="text-[10px] sm:text-xs text-base-content/70">BTC/USDT</p>
                            </div>
                          </div>
                          <span className="badge badge-primary badge-sm gap-1 text-[10px] sm:text-xs">
                            <Zap className="w-2 h-2 sm:w-3 sm:h-3" />
                            Live
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-base sm:text-lg font-bold text-primary">
                            {!isLoading && btcData ? formatPrice(parseFloat(btcData.lastPrice)) : 'Loading...'}
                          </div>
                          <div className={`badge badge-sm ${!isLoading && btcData && parseFloat(btcData.priceChangePercent) >= 0 ? 'badge-success' : 'badge-error'}`}>
                            {!isLoading && btcData ? formatChange(btcData.priceChangePercent) : '0.00%'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-40 sm:h-40 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
              style={{ backgroundColor: 'hsl(var(--a))' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="absolute top-1/2 -right-6 sm:-right-12 w-20 h-20 sm:w-32 sm:h-32 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
              style={{ backgroundColor: 'hsl(var(--s))' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
            ></motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
