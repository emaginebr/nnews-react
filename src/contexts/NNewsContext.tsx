import React, { createContext, useContext, useMemo, useRef, useEffect, useState } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { I18nextProvider } from 'react-i18next';
import { createI18nInstance } from '../i18n';
import { ArticleAPI } from '../services/article-api';
import { CategoryAPI } from '../services/category-api';
import { TagAPI } from '../services/tag-api';
import type { NNewsTheme, NNewsThemeMode } from '../types/news';

export interface NNewsConfig {
  apiUrl: string;
  tenantId?: string;
  apiClient?: AxiosInstance;
  headers?: Record<string, string>;
  language?: string;
  translations?: Record<string, Record<string, unknown>>;
  theme?: NNewsTheme;
}

export interface NNewsContextValue {
  config: NNewsConfig;
  apiClient: AxiosInstance;
  articleApi: ArticleAPI;
  categoryApi: CategoryAPI;
  tagApi: TagAPI;
  theme: NNewsTheme;
  resolvedMode: 'light' | 'dark';
}

const NNewsContext = createContext<NNewsContextValue | undefined>(undefined);

export interface NNewsProviderProps {
  config: NNewsConfig;
  children: React.ReactNode;
}

function useSystemTheme(): 'light' | 'dark' {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return systemTheme;
}

function resolveThemeMode(mode: NNewsThemeMode | undefined, systemTheme: 'light' | 'dark'): 'light' | 'dark' {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  return systemTheme;
}

export function NNewsProvider({ config, children }: NNewsProviderProps) {
  const theme = config.theme || {};
  const systemTheme = useSystemTheme();
  const resolvedMode = resolveThemeMode(theme.mode, systemTheme);

  // Create i18n instance (memoized)
  const i18nInstance = useMemo(
    () => createI18nInstance(config.language, config.translations),
    [config.language, config.translations]
  );

  // Handle language changes without recreating instance
  const currentLang = useRef(config.language);
  useEffect(() => {
    if (config.language && config.language !== currentLang.current) {
      i18nInstance.changeLanguage(config.language);
      currentLang.current = config.language;
    }
  }, [config.language, i18nInstance]);

  // Keep a mutable ref so the interceptor always reads the latest config
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
    console.log('[NNews] Config updated:', {
      apiUrl: config.apiUrl,
      hasAuthHeader: !!config.headers?.Authorization,
    });
  }, [config]);

  const contextValue = useMemo(() => {
    const apiClient =
      config.apiClient ||
      axios.create({
        baseURL: config.apiUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      });

    // Interceptor to inject dynamic headers (e.g. Authorization token, Tenant ID) on every request
    apiClient.interceptors.request.use((requestConfig) => {
      const currentConfig = configRef.current;

      if (currentConfig.headers) {
        Object.entries(currentConfig.headers).forEach(([key, value]) => {
          if (value) {
            requestConfig.headers.set(key, value);
          }
        });
      }

      if (currentConfig.tenantId) {
        requestConfig.headers.set('X-Tenant-Id', currentConfig.tenantId);
      }

      console.log('[NNews] Request interceptor:', {
        method: requestConfig.method?.toUpperCase(),
        url: `${requestConfig.baseURL || ''}${requestConfig.url || ''}`,
        headers: {
          Authorization: requestConfig.headers?.Authorization || '(not set)',
          'Content-Type': requestConfig.headers?.['Content-Type'] || '(not set)',
          'X-Tenant-Id': requestConfig.headers?.['X-Tenant-Id'] || '(not set)',
        },
      });

      return requestConfig;
    });

    const articleApi = new ArticleAPI(apiClient);
    const categoryApi = new CategoryAPI(apiClient);
    const tagApi = new TagAPI(apiClient);

    return {
      config,
      apiClient,
      articleApi,
      categoryApi,
      tagApi,
      theme,
      resolvedMode,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiUrl, config.apiClient, config.tenantId, theme, resolvedMode]);

  const rootClassName = [
    'nnews-root',
    resolvedMode === 'dark' ? 'dark' : '',
    theme.classNames?.root || '',
  ].filter(Boolean).join(' ');

  return (
    <I18nextProvider i18n={i18nInstance}>
      <NNewsContext.Provider value={contextValue}>
        <div className={rootClassName}>
          {children}
        </div>
      </NNewsContext.Provider>
    </I18nextProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNNews(): NNewsContextValue {
  const context = useContext(NNewsContext);

  if (!context) {
    throw new Error('useNNews must be used within a NNewsProvider');
  }

  return context;
}
