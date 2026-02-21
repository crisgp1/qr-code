'use client';

import type { ReactNode } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
  label: string;
}

export function Toggle({ checked, onChange, icon, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        className="w-4 h-4 accent-[var(--accent)] rounded"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
    </label>
  );
}
