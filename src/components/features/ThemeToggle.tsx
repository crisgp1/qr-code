'use client';

import { Sun, Moon } from '@phosphor-icons/react';
import { IconButton } from '../shared';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <IconButton onClick={onToggle} label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
      {theme === 'dark' ? (
        <Sun size={18} weight="bold" className="text-yellow-400" />
      ) : (
        <Moon size={18} weight="bold" className="text-[var(--text-muted)]" />
      )}
    </IconButton>
  );
}
