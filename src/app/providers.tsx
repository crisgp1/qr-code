'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/i18n';
import { ConfigProvider } from '@/hooks/useConfig';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ConfigProvider>{children}</ConfigProvider>
    </I18nProvider>
  );
}
