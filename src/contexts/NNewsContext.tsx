import React, { createContext, useContext, useMemo, useRef, useEffect } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { ArticleAPI } from '../services/article-api';
import { CategoryAPI } from '../services/category-api';
import { TagAPI } from '../services/tag-api';

export interface NNewsConfig {
  apiUrl: string;
  apiClient?: AxiosInstance;
  headers?: Record<string, string>;
}

export interface NNewsContextValue {
  config: NNewsConfig;
  apiClient: AxiosInstance;
  articleApi: ArticleAPI;
  categoryApi: CategoryAPI;
  tagApi: TagAPI;
}

const NNewsContext = createContext<NNewsContextValue | undefined>(undefined);

export interface NNewsProviderProps {
  config: NNewsConfig;
  children: React.ReactNode;
}

export function NNewsProvider({ config, children }: NNewsProviderProps) {
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

    // Interceptor to inject dynamic headers (e.g. Authorization token) on every request
    apiClient.interceptors.request.use((requestConfig) => {
      const currentHeaders = configRef.current.headers;
      if (currentHeaders) {
        Object.entries(currentHeaders).forEach(([key, value]) => {
          if (value) {
            requestConfig.headers.set(key, value);
          }
        });
      }

      console.log('[NNews] Request interceptor:', {
        method: requestConfig.method?.toUpperCase(),
        url: `${requestConfig.baseURL || ''}${requestConfig.url || ''}`,
        headers: {
          Authorization: requestConfig.headers?.Authorization || '(not set)',
          'Content-Type': requestConfig.headers?.['Content-Type'] || '(not set)',
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
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiUrl, config.apiClient]);

  return (
    <NNewsContext.Provider value={contextValue}>
      {children}
    </NNewsContext.Provider>
  );
}

export function useNNews(): NNewsContextValue {
  const context = useContext(NNewsContext);
  
  if (!context) {
    throw new Error('useNNews must be used within a NNewsProvider');
  }
  
  return context;
}
