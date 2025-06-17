import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // Doğru import
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// TypeScript için tip tanımı
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // Doğru kullanım
  .init({
    fallbackLng: 'tr',
    debug: true,
    interpolation: {
      escapeValue: false, // React zaten XSS koruması yapıyor
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    returnNull: false
  });

export default i18n;