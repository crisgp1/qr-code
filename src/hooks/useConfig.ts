'use client';

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import React from 'react';
import {
  type AppConfig,
  type ContentConfig,
  defaultConfig,
} from '@/types/config';

// Actions
type ConfigAction =
  | { type: 'SET_FIELD'; field: keyof AppConfig; value: AppConfig[keyof AppConfig] }
  | { type: 'SET_CONTENT_FIELD'; field: keyof ContentConfig; value: ContentConfig[keyof ContentConfig] }
  | { type: 'SET_CONTENT_NESTED'; parent: 'wifi' | 'vcard' | 'email' | 'sms'; field: string; value: unknown }
  | { type: 'APPLY_TEMPLATE'; config: Partial<AppConfig> }
  | { type: 'LOAD'; config: AppConfig }
  | { type: 'RESET' };

function configReducer(state: AppConfig, action: ConfigAction): AppConfig {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'SET_CONTENT_FIELD':
      return {
        ...state,
        content: { ...state.content, [action.field]: action.value },
      };

    case 'SET_CONTENT_NESTED': {
      const parent = state.content[action.parent];
      if (typeof parent === 'object' && parent !== null) {
        return {
          ...state,
          content: {
            ...state.content,
            [action.parent]: { ...parent, [action.field]: action.value },
          },
        };
      }
      return state;
    }

    case 'APPLY_TEMPLATE':
      return { ...state, ...action.config };

    case 'LOAD':
      return { ...action.config };

    case 'RESET':
      return { ...defaultConfig };

    default:
      return state;
  }
}

// Context
interface ConfigContextValue {
  config: AppConfig;
  dispatch: Dispatch<ConfigAction>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(configReducer, defaultConfig);

  return React.createElement(
    ConfigContext.Provider,
    { value: { config, dispatch } },
    children,
  );
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}

export type { ConfigAction };
