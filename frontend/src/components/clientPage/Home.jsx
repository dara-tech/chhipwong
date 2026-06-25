import React from 'react';
import HeroSection from '../shares/HeroSection';
import TradingChart from '../shared/TradingChart';
import CryptoTable from '../shared/CryptoTable';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <HeroSection />
      
      <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-12">
        {/* Main Chart */}
        <div className="mb-0 sm:mb-12 sm:bg-base-100/95 sm:backdrop-blur-sm sm:rounded-2xl sm:shadow-xl sm:border sm:border-primary/20 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <TradingChart />
        </div>
        
        {/* Cryptocurrency Table */}
        <div className="mb-2 sm:mb-12 sm:bg-base-100/95 sm:backdrop-blur-sm sm:rounded-2xl sm:shadow-xl sm:border sm:border-primary/20 sm:p-6 hover:shadow-2xl transition-all duration-300">
          <CryptoTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
