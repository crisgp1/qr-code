'use client';

const cls = 'w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors';

interface NumberInputProps { value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void; }

export function NumberInput({ value, min, max, step, onChange }: NumberInputProps) {
  return (
    <input
      type="number"
      className={cls}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(+e.target.value)}
    />
  );
}
