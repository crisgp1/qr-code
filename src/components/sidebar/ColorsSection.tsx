'use client';

import { useI18n } from '@/i18n';
import { ColorPicker, Toggle } from '../shared';

interface ColorsSectionProps {
  codeColor: string;
  codeBg: string;
  pageBg: string;
  transparentBg: boolean;
  onCodeColorChange: (v: string) => void;
  onCodeBgChange: (v: string) => void;
  onPageBgChange: (v: string) => void;
  onTransparentBgChange: (v: boolean) => void;
}

export function ColorsSection({
  codeColor,
  codeBg,
  pageBg,
  transparentBg,
  onCodeColorChange,
  onCodeBgChange,
  onPageBgChange,
  onTransparentBgChange,
}: ColorsSectionProps) {
  const { t } = useI18n();

  const items = [
    { label: t.colors.code, value: codeColor, onChange: onCodeColorChange, disabled: false },
    { label: t.colors.codeBg, value: codeBg, onChange: onCodeBgChange, disabled: transparentBg },
    { label: t.colors.pageBg, value: pageBg, onChange: onPageBgChange, disabled: false },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Toggle
        checked={transparentBg}
        onChange={onTransparentBgChange}
        label={t.colors.transparentBg}
      />
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className={`flex flex-col items-center gap-1.5 ${item.disabled ? 'opacity-40 pointer-events-none' : ''}`}>
            <span className="text-[11px] font-medium text-[var(--text-muted)] text-center leading-tight">
              {item.label}
            </span>
            <ColorPicker value={item.value} onChange={item.onChange} />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              {item.disabled ? '---' : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
