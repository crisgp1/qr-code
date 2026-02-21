'use client';

const cls = 'w-full px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/60';

interface TextInputProps { value: string; onChange: (value: string) => void; placeholder?: string; multiline?: boolean; rows?: number; }

export function TextInput({ value, onChange, placeholder, multiline, rows }: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        className={cls + ' min-h-[60px] resize-y'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }
  return (
    <input
      type="text"
      className={cls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
