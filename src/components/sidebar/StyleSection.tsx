'use client';

import { Scissors, Hash } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { CodeMode, ErrorCorrectionLevel } from '@/types/config';
import { Toggle, RangeSlider, Select, Field } from '../shared';

interface StyleSectionProps {
  codeMode: CodeMode;
  cutLines: boolean;
  showPageNum: boolean;
  roundness: number;
  errorCorrection: ErrorCorrectionLevel;
  onCutLinesChange: (v: boolean) => void;
  onShowPageNumChange: (v: boolean) => void;
  onRoundnessChange: (v: number) => void;
  onErrorCorrectionChange: (v: ErrorCorrectionLevel) => void;
}

export function StyleSection({
  codeMode,
  cutLines,
  showPageNum,
  roundness,
  errorCorrection,
  onCutLinesChange,
  onShowPageNumChange,
  onRoundnessChange,
  onErrorCorrectionChange,
}: StyleSectionProps) {
  const { t } = useI18n();

  const ecOptions = [
    { label: t.style.ecL, value: 'L' },
    { label: t.style.ecM, value: 'M' },
    { label: t.style.ecQ, value: 'Q' },
    { label: t.style.ecH, value: 'H' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Toggle
        checked={cutLines}
        onChange={onCutLinesChange}
        icon={<Scissors size={15} />}
        label={t.style.cutLines}
      />
      <Toggle
        checked={showPageNum}
        onChange={onShowPageNumChange}
        icon={<Hash size={15} />}
        label={t.style.pageNumbers}
      />
      {codeMode === 'qr' && (
        <>
          <Field label={`${t.style.roundness} — ${roundness}%`}>
            <RangeSlider
              value={roundness}
              min={0}
              max={100}
              step={5}
              onChange={onRoundnessChange}
            />
          </Field>
          <Field label={t.style.errorCorrection}>
            <Select
              value={errorCorrection}
              options={ecOptions}
              onChange={(v) => onErrorCorrectionChange(v as ErrorCorrectionLevel)}
            />
          </Field>
        </>
      )}
    </div>
  );
}
