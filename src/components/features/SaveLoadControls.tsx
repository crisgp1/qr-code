'use client';

import { FloppyDisk, FolderOpen, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { IconButton } from '../shared';

interface SaveLoadControlsProps {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  message: string | null;
}

export function SaveLoadControls({ onSave, onLoad, onReset, message }: SaveLoadControlsProps) {
  const { t } = useI18n();

  const messageText = message === 'saved' ? t.save.saved
    : message === 'loaded' ? t.save.loaded
    : message === 'noData' ? t.save.noData
    : null;

  return (
    <div className="flex items-center gap-1">
      <IconButton onClick={onSave} label={t.save.save}>
        <FloppyDisk size={18} weight="bold" className="text-[var(--text-muted)]" />
      </IconButton>
      <IconButton onClick={onLoad} label={t.save.load}>
        <FolderOpen size={18} weight="bold" className="text-[var(--text-muted)]" />
      </IconButton>
      <IconButton onClick={onReset} label={t.save.reset}>
        <ArrowCounterClockwise size={18} weight="bold" className="text-[var(--text-muted)]" />
      </IconButton>
      {messageText && (
        <span className="text-[10px] text-[var(--accent)] font-semibold animate-pulse">
          {messageText}
        </span>
      )}
    </div>
  );
}
