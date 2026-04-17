import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

const STORAGE_KEY = 'app-language';

function getNestedValue(object, path) {
  return path.split('.').reduce((current, part) => current?.[part], object);
}

function createValue(language = 'fi', setLanguage = () => {}) {
  const activeTranslations = translations[language] ?? translations.fi;

  return {
    language,
    setLanguage,
    t(key) {
      return (
        getNestedValue(activeTranslations, key) ??
        getNestedValue(translations.fi, key) ??
        key
      );
    }
  };
}

const LanguageContext = createContext(createValue());

function getStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'fi';
  }

  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== 'function') {
    return 'fi';
  }

  return storage.getItem(STORAGE_KEY) || 'fi';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => getStoredLanguage());

  useEffect(() => {
    const storage = window.localStorage;

    if (storage && typeof storage.setItem === 'function') {
      storage.setItem(STORAGE_KEY, language);
    }

    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => createValue(language, setLanguage),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}
