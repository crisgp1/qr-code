'use client';

import { useI18n } from '@/i18n';
import { Field, ColorPicker } from '../shared';

interface ColorsSectionProps {
  codeColor: string;
  codeBg: string;
  pageBg: string;
  onCodeColorChange: (v: string) => void;
  onCodeBgChange: (v: string) => void;
  onPageBgChange: (v: string) => void;
}

export function ColorsSection({
  codeColor,
  codeBg,
  pageBg,
  onCodeColorChange,
  onCodeBgChange,
  onPageBgChange,
}: ColorsSectionProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-2">
      <Field label={t.colors.code}>
        <ColorPicker value={codeColor} onChange={onCodeColorChange} />
      </Field>
      <Field label={t.colors.codeBg}>
        <ColorPicker value={codeBg} onChange={onCodeBgChange} />
      </Field>
      <Field label={t.colors.pageBg}>
        <ColorPicker value={pageBg} onChange={onPageBgChange} />
      </Field>
    </div>
  );
}
