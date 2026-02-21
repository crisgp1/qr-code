'use client';

import { useCallback, useState } from 'react';
import type { AppConfig } from '@/types/config';
import { saveConfig, loadConfig } from '@/lib/storage';
import type { ConfigAction } from './useConfig';

export function useStorage(dispatch: (action: ConfigAction) => void) {
  const [message, setMessage] = useState<string | null>(null);

  const save = useCallback(
    (config: AppConfig) => {
      saveConfig(config);
      setMessage('saved');
      setTimeout(() => setMessage(null), 2000);
    },
    [],
  );

  const load = useCallback(() => {
    const data = loadConfig();
    if (data) {
      dispatch({ type: 'LOAD', config: data });
      setMessage('loaded');
    } else {
      setMessage('noData');
    }
    setTimeout(() => setMessage(null), 2000);
  }, [dispatch]);

  return { save, load, message };
}
