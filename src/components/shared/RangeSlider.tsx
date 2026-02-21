'use client';

interface RangeSliderProps { value: number; min: number; max: number; step: number; onChange: (value: number) => void; }

export function RangeSlider({ value, min, max, step, onChange }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-1">
      <input
        type="range"
        className="w-full accent-range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(+e.target.value)}
        style={{ '--range-pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}
