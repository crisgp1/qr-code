'use client';

const cls = 'w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors cursor-pointer';

interface SelectOption { label: string; value: string; }
interface SelectProps { value: string; options: readonly SelectOption[] | SelectOption[]; onChange: (value: string) => void; }

export function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      className={cls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
