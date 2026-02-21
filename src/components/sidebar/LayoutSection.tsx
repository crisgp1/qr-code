'use client';

import { useI18n } from '@/i18n';
import { Field, NumberInput } from '../shared';

interface LayoutSectionProps {
  totalCodes: number;
  cols: number;
  rows: number;
  onTotalChange: (v: number) => void;
  onColsChange: (v: number) => void;
  onRowsChange: (v: number) => void;
}

export function LayoutSection({
  totalCodes,
  cols,
  rows,
  onTotalChange,
  onColsChange,
  onRowsChange,
}: LayoutSectionProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-2">
      <Field label={t.layout.totalCodes}>
        <NumberInput value={totalCodes} min={1} max={500} onChange={(v) => onTotalChange(Math.max(1, v))} />
      </Field>
      <Field label={t.layout.columns}>
        <NumberInput value={cols} min={1} max={8} onChange={(v) => onColsChange(Math.max(1, v))} />
      </Field>
      <Field label={t.layout.rowsLabel}>
        <NumberInput value={rows} min={1} max={10} onChange={(v) => onRowsChange(Math.max(1, v))} />
      </Field>
    </div>
  );
}
