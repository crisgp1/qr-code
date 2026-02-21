'use client';

import { QrCode, Barcode } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { CodeMode } from '@/types/config';

interface CodeTypeSectionProps {
  codeMode: CodeMode;
  onChange: (mode: CodeMode) => void;
}

export function CodeTypeSection({ codeMode, onChange }: CodeTypeSectionProps) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <button
        onClick={() => onChange('qr')}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
          codeMode === 'qr'
            ? 'bg-[var(--accent)] text-white shadow-sm'
            : 'text-[var(--text-secondary)] hover:bg-white/60 dark:hover:bg-gray-700'
        }`}
      >
        <QrCode size={18} weight="bold" />
        {t.codeType.qr}
      </button>
      <button
        onClick={() => onChange('barcode')}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
          codeMode === 'barcode'
            ? 'bg-[var(--accent)] text-white shadow-sm'
            : 'text-[var(--text-secondary)] hover:bg-white/60 dark:hover:bg-gray-700'
        }`}
      >
        <Barcode size={18} weight="bold" />
        {t.codeType.barcode}
      </button>
    </div>
  );
}
