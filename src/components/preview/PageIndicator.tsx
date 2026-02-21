'use client';

import { useI18n } from '@/i18n';

interface PageIndicatorProps {
  current: number;
  total: number;
}

export function PageIndicator({ current, total }: PageIndicatorProps) {
  const { t } = useI18n();
  return (
    <div className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 no-print">
      {t.view.page} {current} {t.view.of} {total}
    </div>
  );
}
