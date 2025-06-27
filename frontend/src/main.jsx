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
      { progress: 20, text: 'Booting System' },
      { progress: 40, text: 'Loading Modules' },
      { progress: 60, text: 'Verifying Integrity' },
      { progress: 80, text: 'Finalizing Setup' },
      { progress: 100, text: 'Launching' }
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

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pan"></div>
      <div className="absolute inset-0 bg-gradient-to-radial from-transparent via-zinc-900/50 to-zinc-900"></div>
      
      <div className="w-full max-w-md px-4 text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-4 border border-emerald-500/20 rounded-full animate-spin-reverse-slow"></div>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-emerald-500/20"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            <circle
              className="text-emerald-400 drop-shadow-glow"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-light text-cyan-400 font-mono">{progress}<span className="text-2xl">%</span></span>
          </div>
        </div>

        <div>
          <p className="text-lg text-emerald-400 font-mono tracking-widest uppercase mb-3 animate-pulse">
            {loadingText}
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 mx-auto"></div>
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
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pan {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }

  .bg-grid-pattern {
    background-image: linear-gradient(to right, rgba(0, 255, 255, 0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 2rem 2rem;
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .animate-spin-reverse-slow {
    animation: spin-slow 15s linear infinite reverse;
  }
  
  .animate-pan {
    animation: pan 30s linear infinite;
  }

  .drop-shadow-glow {
    filter: drop-shadow(0 0 5px currentColor);
  }

  .bg-gradient-to-radial {
    background-image: radial-gradient(circle, var(--tw-gradient-stops));
  }
  
  .clip-hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
`;
document.head.appendChild(style);

startApp().catch(console.error);
