import React from 'react';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import CommandPalette from '../shared/CommandPalette';

const MainLayout = ({ children }) => {
  const commandPalette = useCommandPalette();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Add a floating button to open command palette */}
      <button
        onClick={commandPalette.open}
        className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-primary/20 hover:scale-110 transition-all duration-300"
        title="Open Command Palette (⌘K)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 