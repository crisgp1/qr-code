'use client';

import React from 'react';
import { PREVIEW_SCALE } from '@/lib/constants';
import type { CodeMode, LabelPosition } from '@/types/config';

interface CodeCellProps {
  dataURL: string | null;
  label: string;
  labelPosition: LabelPosition;
  labelSize: number;
  fontFamily: string;
  maxQR: number;
  rounded: boolean;
  cutLines: boolean;
  codeMode: CodeMode;
}

export const CodeCell = React.memo(function CodeCell({
  dataURL,
  label,
  labelPosition,
  labelSize,
  fontFamily,
  maxQR,
  rounded,
  cutLines,
  codeMode,
}: CodeCellProps) {
  const isBarcode = codeMode === 'barcode';
  const fs = labelSize * PREVIEW_SCALE;
  const lblStyle: React.CSSProperties = {
    fontSize: fs,
    color: '#333',
    fontFamily,
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  };

  const showTop = label && (labelPosition === 'top' || labelPosition === 'both' || labelPosition === 'all');
  const showBottom = label && (labelPosition === 'bottom' || labelPosition === 'both' || labelPosition === 'all');
  const showSides = label && labelPosition === 'all';

  const imgEl = dataURL ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataURL}
      alt="Code"
      style={{
        width: maxQR,
        height: isBarcode ? maxQR * 0.5 : maxQR,
        objectFit: 'contain',
        imageRendering: isBarcode ? 'auto' : rounded ? 'auto' : 'pixelated',
      }}
    />
  ) : null;

  if (!dataURL) {
    return (
      <div
        className="qr-cell-preview flex items-center justify-center overflow-hidden"
        style={cutLines ? { border: '1px dashed #ccc' } : undefined}
      />
    );
  }

  return (
    <div
      className="qr-cell-preview flex items-center justify-center overflow-hidden"
      style={cutLines ? { border: '1px dashed #ccc' } : undefined}
    >
      {/* Outer wrapper: row layout when sides are shown */}
      <div className="flex items-center justify-center" style={{ gap: showSides ? 2 * PREVIEW_SCALE : 0 }}>
        {/* Left label (rotated) */}
        {showSides && (
          <div className="qr-lbl flex items-center justify-center" style={{ ...lblStyle, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            {label}
          </div>
        )}

        {/* Center column: top label + image + bottom label */}
        <div className="flex flex-col items-center" style={{ gap: 2 * PREVIEW_SCALE }}>
          {showTop && (
            <div className="qr-lbl text-center" style={lblStyle}>
              {label}
            </div>
          )}
          {imgEl}
          {showBottom && (
            <div className="qr-lbl text-center" style={lblStyle}>
              {label}
            </div>
          )}
        </div>

        {/* Right label (rotated) */}
        {showSides && (
          <div className="qr-lbl flex items-center justify-center" style={{ ...lblStyle, writingMode: 'vertical-rl' }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
