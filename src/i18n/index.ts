import i18next, { type Resource } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './locales/en';
import pt from './locales/pt';

export const NAMESPACE = 'nnews';

export const defaultTranslations = { en, pt };

export function createI18nInstance(
  language: string = 'en',
  customTranslations?: Record<string, Record<string, unknown>>
) {
  const instance = i18next.createInstance();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resources: Record<string, Record<string, any>> = {
    en: { [NAMESPACE]: { ...en } },
    pt: { [NAMESPACE]: { ...pt } },
  };

  if (customTranslations) {
    for (const [lang, translations] of Object.entries(customTranslations)) {
      if (resources[lang]) {
        resources[lang][NAMESPACE] = {
          ...resources[lang][NAMESPACE],
          ...translations,
        };
      } else {
        resources[lang] = { [NAMESPACE]: { ...translations } };
      }
    }
  }

  instance.use(initReactI18next).init({
    resources: resources as Resource,
    lng: language,
    fallbackLng: 'en',
    defaultNS: NAMESPACE,
    ns: [NAMESPACE],
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

  return instance;
}

export function useNNewsTranslation() {
  return useTranslation(NAMESPACE);
}
