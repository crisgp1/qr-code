'use client';

import { useRef, useState } from 'react';
import { UploadSimple } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { InterleaveState, InterleaveMode } from '@/types/config';
import type { CSVResult } from '@/lib/csv-parser';
import { Field, TextInput, Select } from '../shared';

interface InterleaveSectionProps {
  interleave: InterleaveState;
  onModeChange: (mode: InterleaveMode) => void;
  onManualChange: (text: string) => void;
  onCSVLoad: (text: string, fileName: string) => CSVResult;
  onCSVColumnChange: (csvText: string, col: number) => void;
}

export function InterleaveSection({
  interleave,
  onModeChange,
  onManualChange,
  onCSVLoad,
  onCSVColumnChange,
}: InterleaveSectionProps) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [manualText, setManualText] = useState('');

  const modeOptions = [
    { label: t.interleave.off, value: 'off' },
    { label: t.interleave.manual, value: 'manual' },
    { label: t.interleave.csv, value: 'csv' },
  ];

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      const result = onCSVLoad(text, file.name);
      setCsvHeaders(result.headers);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={interleave.mode}
        options={modeOptions}
        onChange={(v) => onModeChange(v as InterleaveMode)}
      />

      {interleave.mode === 'manual' && (
        <>
          <TextInput
            value={manualText}
            onChange={(v) => {
              setManualText(v);
              onManualChange(v);
            }}
            placeholder={t.interleave.manualPlaceholder}
            multiline
            rows={4}
          />
          {interleave.entries.length > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              {interleave.entries.length} {t.interleave.entriesCount}
            </p>
          )}
        </>
      )}

      {interleave.mode === 'csv' && (
        <>
          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-all">
            <UploadSimple size={16} weight="bold" />
            {interleave.csvFileName || t.interleave.csvUpload}
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.tsv,.txt"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </label>
          {csvHeaders.length > 0 && (
            <Field label={t.interleave.csvColumn}>
              <Select
                value={String(interleave.csvColumn)}
                options={csvHeaders.map((h, i) => ({ label: h || `Column ${i + 1}`, value: String(i) }))}
                onChange={(v) => onCSVColumnChange(csvText, Number(v))}
              />
            </Field>
          )}
          {interleave.entries.length > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              {interleave.entries.length} {t.interleave.entriesCount}
            </p>
          )}
        </>
      )}
    </div>
  );
}
