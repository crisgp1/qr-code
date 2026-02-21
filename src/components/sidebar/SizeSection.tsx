'use client';

import { useI18n } from '@/i18n';
import type { PageSize } from '@/types/config';
import { PAGE_SIZES } from '@/lib/constants';
import { Field, RangeSlider, NumberInput, Select } from '../shared';

interface SizeSectionProps {
  codeSize: number;
  margin: number;
  spacing: number;
  pageSize: PageSize;
  customWidth: number;
  customHeight: number;
  onCodeSizeChange: (v: number) => void;
  onMarginChange: (v: number) => void;
  onSpacingChange: (v: number) => void;
  onPageSizeChange: (v: PageSize) => void;
  onCustomWidthChange: (v: number) => void;
  onCustomHeightChange: (v: number) => void;
}

export function SizeSection({
  codeSize,
  margin,
  spacing,
  pageSize,
  customWidth,
  customHeight,
  onCodeSizeChange,
  onMarginChange,
  onSpacingChange,
  onPageSizeChange,
  onCustomWidthChange,
  onCustomHeightChange,
}: SizeSectionProps) {
  const { t } = useI18n();

  const pageSizeOptions = Object.entries(PAGE_SIZES).map(([key, val]) => ({
    label: val.label,
    value: key,
  }));

  return (
    <div className="flex flex-col gap-2">
      <Field label={`${t.size.codeSize} — ${codeSize.toFixed(1)} cm`}>
        <RangeSlider value={codeSize} min={1} max={8} step={0.1} onChange={onCodeSizeChange} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label={t.size.marginLabel}>
          <NumberInput value={margin} min={0} max={5} step={0.1} onChange={onMarginChange} />
        </Field>
        <Field label={t.size.spacing}>
          <NumberInput value={spacing} min={0} max={3} step={0.1} onChange={onSpacingChange} />
        </Field>
      </div>
      <Field label={t.size.pageSize}>
        <Select
          value={pageSize}
          options={pageSizeOptions}
          onChange={(v) => onPageSizeChange(v as PageSize)}
        />
      </Field>
      {pageSize === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <Field label={t.size.customWidth}>
            <NumberInput value={customWidth} min={3} max={20} step={0.1} onChange={onCustomWidthChange} />
          </Field>
          <Field label={t.size.customHeight}>
            <NumberInput value={customHeight} min={3} max={30} step={0.1} onChange={onCustomHeightChange} />
          </Field>
        </div>
      )}
    </div>
  );
}
