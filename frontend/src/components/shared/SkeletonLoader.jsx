import React from 'react';

export const TableSkeleton = () => (
  <div>
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="h-12 bg-base-200 rounded-lg"></div>
      
      {/* Table rows skeleton */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg border border-base-200">
          <div className="w-8 h-8 bg-base-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-200 rounded w-1/4"></div>
            <div className="h-3 bg-base-200 rounded w-1/3"></div>
          </div>
          <div className="w-24 h-4 bg-base-200 rounded"></div>
          <div className="w-20 h-4 bg-base-200 rounded"></div>
          <div className="w-32 h-4 bg-base-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div>
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="h-16 bg-base-200 rounded-lg"></div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-base-200/50 backdrop-blur-sm p-4 rounded-xl border border-base-300/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-base-300 rounded-lg"></div>
                <div className="h-4 bg-base-300 rounded w-20"></div>
              </div>
              <div className="h-4 bg-base-300 rounded w-12"></div>
            </div>
            <div className="h-6 bg-base-300 rounded w-24"></div>
          </div>
        ))}
      </div>
      
      {/* Chart area skeleton */}
      <div className="h-96 bg-base-200/50 backdrop-blur-sm rounded-lg border border-base-300/20"></div>
      
      {/* Controls skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-10 bg-base-200 rounded-lg w-48"></div>
        <div className="h-10 bg-base-200 rounded-lg w-64"></div>
      </div>
    </div>
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-base-200 backdrop-blur-sm rounded-lg border-none">
    <div className="text-error mb-4">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-error mb-2">Error Loading Data</h3>
    <p className="text-error/80 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-error text-error-content rounded-lg hover:bg-error/90 transition-colors"
    >
      Try Again
    </button>
  </div>
); 