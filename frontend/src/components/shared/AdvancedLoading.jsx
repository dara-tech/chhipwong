import React from 'react';
import { motion } from 'framer-motion';

const AdvancedLoading = ({ type = 'default' }) => {
  const renderHeroSkeleton = () => (
    <div className="relative h-[600px] w-full overflow-hidden bg-base-200">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-base-300 mb-6"></div>
        <div className="h-12 w-96 max-w-full bg-base-300 rounded-lg mb-4"></div>
        <div className="h-6 w-[500px] max-w-full bg-base-300 rounded mb-2"></div>
        <div className="h-6 w-[400px] max-w-full bg-base-300 rounded"></div>
      </div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="container mx-auto px-4 -mt-20 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="w-12 h-12 rounded-full bg-base-300 mb-2"></div>
              <div className="h-8 w-24 bg-base-300 rounded mb-2"></div>
              <div className="h-4 w-32 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardsSkeleton = () => (
    <div className="container mx-auto px-4 py-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-12"
      >
        <div className="h-12 w-64 bg-base-300 rounded mx-auto"></div>
      </motion.h2>
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Mission Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <figure className="relative h-72">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/30">Mission</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
            </figure>
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                <div className="h-8 w-40 bg-base-300 rounded"></div>
              </h3>
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-5/6"></div>
                <div className="h-4 bg-base-300 rounded w-4/6"></div>
              </div>
              <div className="card-actions justify-end mt-4">
                <div className="btn btn-primary btn-sm group-hover:btn-secondary transition-all duration-300">
                  <div className="h-6 w-24 bg-base-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <figure className="relative h-72">
              <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-secondary/30">Vision</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
            </figure>
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                <div className="h-8 w-40 bg-base-300 rounded"></div>
              </h3>
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-5/6"></div>
                <div className="h-4 bg-base-300 rounded w-4/6"></div>
              </div>
              <div className="card-actions justify-end mt-4">
                <div className="btn btn-secondary btn-sm group-hover:btn-primary transition-all duration-300">
                  <div className="h-6 w-24 bg-base-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {[1, 2, 3, 4, 5].map((i) => (
              <th key={i} className="h-12 bg-base-300"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row}>
              {[1, 2, 3, 4, 5].map((col) => (
                <td key={col} className="h-16 bg-base-300"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className="w-full h-[400px] bg-base-300 rounded-lg"></div>
  );

  switch (type) {
    case 'hero':
      return renderHeroSkeleton();
    case 'stats':
      return renderStatsSkeleton();
    case 'cards':
      return renderCardsSkeleton();
    case 'table':
      return renderTableSkeleton();
    case 'chart':
      return renderChartSkeleton();
    default:
      return (
        <div className="flex flex-col gap-6 animate-pulse p-6 bg-gradient-to-b from-base-200/50 to-base-100">
          {renderHeroSkeleton()}
          {renderStatsSkeleton()}
          {renderCardsSkeleton()}
        </div>
      );
  }
};

export default AdvancedLoading; 