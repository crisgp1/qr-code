'use client';

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function RangeSlider({ value, min, max, step, onChange }: RangeSliderProps) {
  return (
    <input
      type="range"
      className="w-full"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(+e.target.value)}
    />
  );
}
