'use client';

import { Scissors, Hash, SquareHalf } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { Toggle } from '../shared';

interface StyleSectionProps {
  cutLines: boolean;
  showPageNum: boolean;
  roundedCode: boolean;
  onCutLinesChange: (v: boolean) => void;
  onShowPageNumChange: (v: boolean) => void;
  onRoundedChange: (v: boolean) => void;
}

export function StyleSection({
  cutLines,
  showPageNum,
  roundedCode,
  onCutLinesChange,
  onShowPageNumChange,
  onRoundedChange,
}: StyleSectionProps) {
  const { t } = useI18n();

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
      <Toggle
        checked={roundedCode}
        onChange={onRoundedChange}
        icon={<SquareHalf size={15} />}
        label={t.style.rounded}
      />
    </div>
  );
}
