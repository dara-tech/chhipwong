import React from 'react';
import HeroSection from '../shares/HeroSection';
import TradingChart from '../shared/TradingChart';
import CryptoTable from '../shared/CryptoTable';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <HeroSection />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px]">
        {/* Glassmorphism Dashboard Container */}
        <div className="bg-base-200/40 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-base-content/5 space-y-4">
          
          {/* Main Chart */}
          <div className="bg-base-100 rounded-xl border border-base-content/10 p-4 sm:p-5 hover:border-primary/20 transition-all duration-300">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Market Analysis</h2>
                <p className="text-xs sm:text-sm text-base-content/60 mt-1">Real-time trading view</p>
              </div>
              <div className="badge badge-primary badge-outline badge-sm gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Live Data
              </div>
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-base-content/5">
              <TradingChart />
            </div>
          </div>
          
          {/* Cryptocurrency Table */}
          <div className="bg-base-100 rounded-xl border border-base-content/10 p-4 sm:p-5 hover:border-primary/20 transition-all duration-300 overflow-hidden">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Cryptocurrency Prices</h2>
                <p className="text-xs sm:text-sm text-base-content/60 mt-1">Top assets by market cap</p>
              </div>
            </div>
            <div className="-mx-4 sm:mx-0 overflow-x-auto">
              <div className="min-w-full px-4 sm:px-0">
                <CryptoTable />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
