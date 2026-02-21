'use client';

import { Translate } from '@phosphor-icons/react';
import { IconButton } from '../shared';

interface LanguageToggleProps {
  lang: string;
  onToggle: () => void;
}

export function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <IconButton onClick={onToggle} label="Toggle language" className="relative">
      <Translate size={18} weight="bold" className="text-[var(--text-muted)]" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold text-[var(--accent)] uppercase">
        {lang}
      </span>
    </IconButton>
  );
}
