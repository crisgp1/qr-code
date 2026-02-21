'use client';

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker, HexColorInput } from 'react-colorful';

interface ColorPickerProps { value: string; onChange: (value: string) => void; }

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const popover = useRef<HTMLDivElement>(null);
  const swatch = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Position the popover relative to the swatch
  useLayoutEffect(() => {
    if (!open || !swatch.current) return;
    const rect = swatch.current.getBoundingClientRect();
    const popW = 232; // picker width + padding
    let left = rect.left + rect.width / 2 - popW / 2;
    // Keep within viewport
    if (left < 8) left = 8;
    if (left + popW > window.innerWidth - 8) left = window.innerWidth - 8 - popW;
    setPos({ top: rect.bottom + 8, left });
  }, [open]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popover.current && !popover.current.contains(e.target as Node) &&
        swatch.current && !swatch.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [open, close]);

  return (
    <>
      {/* Swatch button — checkerboard behind for transparency/white visibility */}
      <button
        ref={swatch}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 rounded-lg cursor-pointer transition-all hover:shadow-md active:scale-[0.97] color-swatch"
        style={{ '--swatch-color': value } as React.CSSProperties}
        aria-label={`Color: ${value}`}
      />

      {/* Portal popover */}
      {open && pos && createPortal(
        <div
          ref={popover}
          className="fixed z-[9999] w-[232px] p-3 rounded-xl bg-white dark:bg-gray-800 shadow-2xl border border-[var(--sidebar-border)]"
          style={{ top: pos.top, left: pos.left, animation: 'popIn 150ms ease-out' }}
        >
          <HexColorPicker color={value} onChange={onChange} />
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)] font-medium select-none">#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed={false}
              className="flex-1 px-2 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] uppercase"
            />
            <div
              className="w-6 h-6 rounded-md shrink-0 ring-1 ring-black/10"
              style={{ backgroundColor: value }}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
