'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Translations } from '@/types/i18n';
import { es } from './es';
import { en } from './en';

type Lang = 'es' | 'en';

interface I18nContextValue {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const dictionaries: Record<Lang, Translations> = { es, en };

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const value: I18nContextValue = {
    t: dictionaries[lang],
    lang,
    setLang,
    toggleLang,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
