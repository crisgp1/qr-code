'use client';

import { useI18n } from '@/i18n';
import { FONTS } from '@/lib/constants';
import { Field, TextInput, NumberInput, RangeSlider, Select } from '../shared';

interface TextSectionProps {
  label: string;
  pageTitle: string;
  titleSize: number;
  labelSize: number;
  fontFamily: string;
  onLabelChange: (v: string) => void;
  onPageTitleChange: (v: string) => void;
  onTitleSizeChange: (v: number) => void;
  onLabelSizeChange: (v: number) => void;
  onFontChange: (v: string) => void;
}

export function TextSection({
  label,
  pageTitle,
  titleSize,
  labelSize,
  fontFamily,
  onLabelChange,
  onPageTitleChange,
  onTitleSizeChange,
  onLabelSizeChange,
  onFontChange,
}: TextSectionProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      <Field label={t.text.label}>
        <TextInput value={label} onChange={onLabelChange} placeholder={t.text.labelPlaceholder} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label={t.text.pageTitle}>
          <TextInput value={pageTitle} onChange={onPageTitleChange} placeholder={t.text.pageTitlePlaceholder} />
        </Field>
        <Field label={t.text.titleSizeLabel}>
          <NumberInput value={titleSize} min={10} max={36} onChange={onTitleSizeChange} />
        </Field>
      </div>
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
