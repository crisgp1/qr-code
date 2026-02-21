'use client';

import { useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { BarcodeFormat } from '@/types/config';
import type { Translations } from '@/types/i18n';
import { Field, Select, Modal } from '../shared';

interface FormatInfo {
  value: BarcodeFormat;
  label: string;
  hintKey: keyof Translations['barcodeFormat'];
  descKey: keyof Translations['barcodeFormat'];
  placeholder: string;
}

const formats: FormatInfo[] = [
  { value: 'CODE128', label: 'Code 128', hintKey: 'code128Hint', descKey: 'code128Desc', placeholder: 'ABC-123' },
  { value: 'EAN13', label: 'EAN-13', hintKey: 'ean13Hint', descKey: 'ean13Desc', placeholder: '590123412345' },
  { value: 'UPC', label: 'UPC-A', hintKey: 'upcHint', descKey: 'upcDesc', placeholder: '01234567890' },
  { value: 'CODE39', label: 'Code 39', hintKey: 'code39Hint', descKey: 'code39Desc', placeholder: 'ITEM-001' },
];

interface BarcodeFormatSectionProps {
  format: BarcodeFormat;
  onChange: (format: BarcodeFormat) => void;
}

export function BarcodeFormatSection({ format, onChange }: BarcodeFormatSectionProps) {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const current = formats.find((f) => f.value === format) ?? formats[0];
  const hint = t.barcodeFormat[current.hintKey] as string;

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Field label={t.barcodeFormat.title}>
            <Select
              value={format}
              options={formats.map((f) => ({ label: f.label, value: f.value }))}
              onChange={(v) => onChange(v as BarcodeFormat)}
            />
          </Field>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t.barcodeFormat.learnMore}
          >
            <Info size={16} weight="bold" className="text-[var(--accent)]" />
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] leading-tight">
          {hint}
        </p>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.barcodeFormat.title}>
        <div className="flex flex-col gap-2">
          {formats.map((f) => {
            const selected = f.value === format;
            return (
              <button
                key={f.value}
                onClick={() => { onChange(f.value); setModalOpen(false); }}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]'
                    : 'border-[var(--input-border)] bg-[var(--input-bg)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{f.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[var(--text-muted)] font-mono">
                    {t.barcodeFormat[f.hintKey] as string}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t.barcodeFormat[f.descKey] as string}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                  ej: {f.placeholder}
                </p>
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

export { formats as barcodeFormats };
