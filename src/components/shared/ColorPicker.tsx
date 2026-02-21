'use client';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <input
      type="color"
      className="w-full h-9 rounded-lg border border-[var(--input-border)] cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
