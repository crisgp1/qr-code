'use client';

import { useI18n } from '@/i18n';
import type { LabelPosition } from '@/types/config';
import { FONTS } from '@/lib/constants';
import { Field, TextInput, NumberInput, RangeSlider, Select } from '../shared';

interface TextSectionProps {
  label: string;
  labelPosition: LabelPosition;
  pageTitle: string;
  titleSize: number;
  labelSize: number;
  fontFamily: string;
  onLabelChange: (v: string) => void;
  onLabelPositionChange: (v: LabelPosition) => void;
  onPageTitleChange: (v: string) => void;
  onTitleSizeChange: (v: number) => void;
  onLabelSizeChange: (v: number) => void;
  onFontChange: (v: string) => void;
}

export function TextSection({
  label,
  labelPosition,
  pageTitle,
  titleSize,
  labelSize,
  fontFamily,
  onLabelChange,
  onLabelPositionChange,
  onPageTitleChange,
  onTitleSizeChange,
  onLabelSizeChange,
  onFontChange,
}: TextSectionProps) {
  const { t } = useI18n();

  const positionOptions = [
    { label: t.text.labelBottom, value: 'bottom' },
    { label: t.text.labelTop, value: 'top' },
    { label: t.text.labelBoth, value: 'both' },
    { label: t.text.labelAll, value: 'all' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Field label={t.text.label}>
        <TextInput value={label} onChange={onLabelChange} placeholder={t.text.labelPlaceholder} />
      </Field>
      {label && (
        <Field label={t.text.labelPosition}>
          <Select
            value={labelPosition}
            options={positionOptions}
            onChange={(v) => onLabelPositionChange(v as LabelPosition)}
          />
        </Field>
      )}
      <Field label={t.text.pageTitle}>
        <TextInput value={pageTitle} onChange={onPageTitleChange} placeholder={t.text.pageTitlePlaceholder} />
      </Field>
      <Field label={`${t.text.titleSizeLabel} — ${titleSize}pt`}>
        <RangeSlider value={titleSize} min={10} max={36} step={1} onChange={onTitleSizeChange} />
      </Field>
      <Field label={`${t.text.labelSizeLabel} — ${labelSize}px`}>
        <RangeSlider value={labelSize} min={6} max={16} step={0.5} onChange={onLabelSizeChange} />
      </Field>
      <Field label={t.text.font}>
        <Select
          value={fontFamily}
          options={FONTS.map((f) => ({ label: f.label, value: f.value }))}
          onChange={onFontChange}
        />
      </Field>
    </div>
  );
}
