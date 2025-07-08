import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50">
      <div className="relative w-32 h-32">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-emerald-500/10"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
          />
          <circle
            className="text-emerald-400 drop-shadow-glow"
            strokeWidth="2"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="46"
            cx="50"
            cy="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.3s linear' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-light text-cyan-400 font-mono">{progress}<span className="text-xl">%</span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
