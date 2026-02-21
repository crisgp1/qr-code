'use client';

import type { ReactNode } from 'react';

interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; icon?: ReactNode; label: string; }

export function Toggle({ checked, onChange, icon, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 py-1 cursor-pointer group">
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-9 h-5 rounded-full bg-gray-200 dark:bg-gray-600 peer-checked:bg-[var(--accent)] transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </div>
      {icon && <span className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">{icon}</span>}
      <span className="text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{label}</span>
    </label>
  );
}
