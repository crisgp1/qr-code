'use client';

import React from 'react';
import { PREVIEW_SCALE } from '@/lib/constants';
import type { CodeMode } from '@/types/config';

interface CodeCellProps {
  dataURL: string | null;
  label: string;
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
  labelSize,
  fontFamily,
  maxQR,
  rounded,
  cutLines,
  codeMode,
}: CodeCellProps) {
  const isBarcode = codeMode === 'barcode';

  return (
    <div
      className="qr-cell-preview flex flex-col items-center justify-center overflow-hidden"
      style={cutLines ? { border: '1px dashed #ccc' } : undefined}
    >
      {dataURL && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataURL}
            alt="Code"
            style={{
              width: maxQR,
              height: isBarcode ? maxQR * 0.5 : maxQR,
              objectFit: 'contain',
              // Rounded QR uses smooth rendering so curves look clean;
              // standard QR uses pixelated to keep sharp module edges.
              imageRendering: isBarcode ? 'auto' : rounded ? 'auto' : 'pixelated',
            }}
          />
          {label && (
            <div
              className="qr-lbl text-center"
              style={{
                fontSize: labelSize * PREVIEW_SCALE,
                color: '#333',
                marginTop: 2 * PREVIEW_SCALE,
                fontFamily,
              }}
            >
              {label}
            </div>
          )}
        </>
      )}
    </div>
  );
});
