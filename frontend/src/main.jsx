import React, { StrictMode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initI18n } from './i18n';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Booting system...' },
      { progress: 40, text: 'Loading modules...' },
      { progress: 60, text: 'Verifying integrity...' },
      { progress: 80, text: 'Finalizing setup...' },
      { progress: 100, text: 'Launching...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const { progress, text } = loadingSteps[currentStep];
        setProgress(progress);
        setLoadingText(text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50">
      <div className="w-full max-w-md px-4">
        {/* Hexagonal Logo */}
        <div className="text-center mb-8">
          <div className="w-34 h-34 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-zinc-800 clip-hexagon"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-20 clip-hexagon"></div>
            <div className="absolute inset-2 bg-zinc-900 clip-hexagon flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400">
                KH HARA
              </span>
            </div>
          </div>
        </div>

        {/* Hexagonal Progress Bar */}
        <div className="relative w-full h-4 mb-4">
          <div className="absolute inset-0 bg-zinc-800 clip-hexagon"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-20 clip-hexagon"></div>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 clip-hexagon transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-emerald-400 font-mono mb-2">{loadingText}</p>
          <p className="text-sm text-cyan-400/70 font-mono">{progress}%</p>
        </div>

        {/* Hexagonal Dots */}
        <div className="flex justify-center mt-6 space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-emerald-500/50 clip-hexagon"
              style={{
                animation: `pulse 1.5s infinite ${i * 0.2}s`,
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('fonts-loading');
    
    if (document.fonts) {
      Promise.all([
        document.fonts.load('1em Inter'),
        document.fonts.load('1em Hanuman')
      ]).then(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
        setFontsLoaded(true);
      });
    } else {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
      setFontsLoaded(true);
    }
  }, []);

  return null;
};

const startApp = async () => {
  const root = createRoot(document.getElementById('root'));

  try {
    root.render(
      <StrictMode>
        <LoadingScreen />
      </StrictMode>
    );

    await initI18n();
    
    root.render(
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <FontLoader />
            <Toaster position="top-center" reverseOrder={false} />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    root.render(
      <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 clip-hexagon flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-emerald-400">System Error</h1>
          <p className="text-cyan-400/70 mb-6">Critical system failure detected. Attempting recovery...</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none hover:opacity-90"
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }
};

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .clip-hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
`;
document.head.appendChild(style);

startApp().catch(console.error);
