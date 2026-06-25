import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          fontFamily: {
            en: ['"Inter"', 'sans-serif'],
            km: ['"Hanuman"', '"Noto Serif Khmer"', 'serif'],
          },
        },
      },
    }),
  ],
  server: {
    proxy: {
      '/kraken': {
        target: 'https://api.kraken.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kraken/, '/0/public'),
      },
    },
  },
})
