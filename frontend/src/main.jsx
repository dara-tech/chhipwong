import React, { StrictMode, useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initI18n } from './i18n';
import './index.css';
import App from './App.jsx';
import LoadingScreen from './components/shares/LoadingScreen.jsx';
import { AuthProvider } from './context/AuthProvider';



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
