import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initI18n = () => {
  return i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: ['en', 'km'],
      fallbackLng: 'en',
      debug: import.meta.env.MODE === 'development',
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: true,
      },
      // --- ADD THIS LINE ---
      returnObjects: true // Allows i18next to return objects for nested keys
      // ---------------------
    });
};

i18n.on('languageChanged', (lng) => {
  if (import.meta.env.MODE === 'development') {
  }

  const body = document.body;
  body.classList.remove('font-en', 'font-km');
  body.classList.add(lng === 'km' ? 'font-km' : 'font-en');
});

export default i18n;