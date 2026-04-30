import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { translations } from './translations.js';

const STORAGE_KEY = 'app-language';

function getNestedValue(object, path) {
  return path.split('.').reduce((current, part) => current?.[part], object);
}

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

const useLanguageStore = create((set) => ({
  language: getStoredLanguage(),
  setLanguage: (language) => {
    set({ language });
  }
}));

export function useInitializeLanguage() {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    const storage = window.localStorage;

    if (storage && typeof storage.setItem === 'function') {
      storage.setItem(STORAGE_KEY, language);
    }

    document.documentElement.lang = language;
  }, [language]);
}

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return useMemo(() => {
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
  }, [language, setLanguage]);
}
