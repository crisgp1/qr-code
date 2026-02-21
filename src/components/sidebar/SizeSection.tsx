'use client';

import { useI18n } from '@/i18n';
import type { CodeMode, PageSize } from '@/types/config';
import { PAGE_SIZES, QR_SIZE, BARCODE_WIDTH, BARCODE_HEIGHT } from '@/lib/constants';
import { Field, RangeSlider, NumberInput, Select } from '../shared';

interface SizeSectionProps {
  codeMode: CodeMode;
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
  codeMode,
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

  const pageSizeLabelMap: Record<string, string> = {
    letter: t.size.pageLetter,
    a4: t.size.pageA4,
    a5: t.size.pageA5,
    custom: t.size.pageCustom,
  };

  const pageSizeOptions = Object.keys(PAGE_SIZES).map((key) => ({
    label: pageSizeLabelMap[key] ?? key,
    value: key,
  }));

  return (
    <div className="flex flex-col gap-3">
      <Field label={`${t.size.codeSize} — ${codeSize.toFixed(1)} cm`}>
        <RangeSlider value={codeSize} min={1} max={8} step={0.1} onChange={onCodeSizeChange} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.size.customWidth}>
            <NumberInput value={customWidth} min={3} max={20} step={0.1} onChange={onCustomWidthChange} />
          </Field>
          <Field label={t.size.customHeight}>
            <NumberInput value={customHeight} min={3} max={30} step={0.1} onChange={onCustomHeightChange} />
          </Field>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--accent)]/[0.06]">
        <span className="text-[11px] text-[var(--text-muted)]">{t.size.pixelSize}:</span>
        <span className="text-[11px] font-mono font-semibold text-[var(--accent)]">
          {codeMode === 'qr'
            ? `${QR_SIZE} x ${QR_SIZE} px`
            : `${BARCODE_WIDTH * 100} x ${BARCODE_HEIGHT} px`}
        </span>
      </div>
    </div>
  );
}
