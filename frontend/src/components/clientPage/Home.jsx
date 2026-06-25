import React from 'react';
import HeroSection from '../shares/HeroSection';
import TradingChart from '../shared/TradingChart';
import CryptoTable from '../shared/CryptoTable';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <HeroSection />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Chart */}
        <div className="mb-12 bg-base-100/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-6 hover:shadow-2xl transition-all duration-300">
          <TradingChart />
        </div>
        
        {/* Cryptocurrency Table */}
        <div className="mb-12 bg-base-100/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/20 p-6 hover:shadow-2xl transition-all duration-300">
          <CryptoTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
