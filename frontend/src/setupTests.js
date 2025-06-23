import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mocking for Vite's `import.meta.env` will be handled by Babel.

// Initialize i18n for tests
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to KH HARA',
          login: 'Login',
          home: 'Home'
        }
      },
      km: {
        translation: {
          welcome: 'សូមស្វាគមន៍មកកាន់ KH HARA',
          login: 'ចូលប្រើប្រាស់',
          home: 'ទំព័រដើម'
        }
      }
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });
