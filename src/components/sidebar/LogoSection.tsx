'use client';

import { useMemo } from 'react';
import { UploadSimple, Trash, Warning } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { Field, RangeSlider, FileUpload, Button } from '../shared';

interface LogoSectionProps {
  codeMode: string;
  logoPreviewURL: string | null;
  logoSize: number;
  logoBgWhite: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onSizeChange: (v: number) => void;
  onBgChange: (v: boolean) => void;
}

export function LogoSection({
  codeMode,
  logoPreviewURL,
  logoSize,
  logoBgWhite,
  fileRef,
  onUpload,
  onRemove,
  onSizeChange,
  onBgChange,
}: LogoSectionProps) {
  const { t } = useI18n();

  const warning = useMemo(() => {
    if (!logoPreviewURL) return null;
    if (logoSize >= 28) return { text: t.logo.warningHigh, color: 'text-red-600' };
    if (logoSize >= 25) return { text: t.logo.warningMax, color: 'text-orange-600' };
    return null;
  }, [logoSize, logoPreviewURL, t]);

  if (codeMode === 'barcode') {
    return (
      <p className="text-xs text-[var(--text-muted)] italic">{t.logo.disabledBarcode}</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <FileUpload accept="image/*" onChange={onUpload} inputRef={fileRef} className="flex-1">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer">
            <UploadSimple size={16} weight="bold" />
            {logoPreviewURL ? t.logo.change : t.logo.upload}
          </div>
        </FileUpload>
        {logoPreviewURL && (
          <Button variant="danger" onClick={onRemove} icon={<Trash size={16} weight="bold" />}>
            {t.logo.remove}
          </Button>
        )}
      </div>

      {logoPreviewURL && (
        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoPreviewURL} alt="Logo" className="h-10 rounded border border-[var(--input-border)]" />
          <div className="flex-1">
            <Field label={`${t.logo.sizeLabel} — ${logoSize}%`}>
              <RangeSlider value={logoSize} min={10} max={30} step={1} onChange={onSizeChange} />
            </Field>
            {warning && (
              <div className={`flex items-center gap-1 mt-1 text-[10px] ${warning.color}`}>
                <Warning size={12} weight="bold" />
                {warning.text}
              </div>
            )}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-[var(--accent)] rounded"
          checked={logoBgWhite}
          onChange={(e) => onBgChange(e.target.checked)}
        />
        <span className="text-xs text-[var(--text-secondary)]">{t.logo.whiteBg}</span>
      </label>
    </div>
  );
}
