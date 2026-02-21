'use client';

import { useRef, useEffect, useState } from 'react';
import { Download } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { AppConfig } from '@/types/config';
import { QR_SIZE } from '@/lib/constants';
import { Button } from '../shared';

interface SingleCodeViewProps {
  config: AppConfig;
  codeDataURL: string | null;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
}

export function SingleCodeView({
  config,
  codeDataURL,
  onDownloadPNG,
  onDownloadSVG,
}: SingleCodeViewProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 600, h: 500 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isBarcode = config.codeMode === 'barcode';
  const maxImgSize = Math.min(containerSize.w - 120, containerSize.h - 220, 420);
  const imgSize = Math.max(160, maxImgSize);
  const labelFs = config.labelSize * 1.6;

  const showTop = config.label && (config.labelPosition === 'top' || config.labelPosition === 'both' || config.labelPosition === 'all');
  const showBottom = config.label && (config.labelPosition === 'bottom' || config.labelPosition === 'both' || config.labelPosition === 'all');
  const showSides = config.label && config.labelPosition === 'all';

  const lblStyle: React.CSSProperties = {
    fontSize: labelFs,
    color: '#333',
    fontFamily: config.fontFamily,
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  };

  const checkerBg = 'repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 0 0 / 16px 16px';

  return (
    <div ref={containerRef} className="h-full flex flex-col items-center justify-center gap-5 p-6 overflow-auto">
      {/* Live preview card */}
      <div
        className="rounded-xl shadow-lg overflow-hidden flex items-center justify-center"
        style={{
          background: config.transparentBg ? checkerBg : config.codeBg,
          padding: showSides ? 8 : 16,
        }}
      >
        {codeDataURL ? (
          <div className="flex items-center justify-center" style={{ gap: showSides ? 6 : 0 }}>
            {/* Left rotated label */}
            {showSides && (
              <div style={{ ...lblStyle, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {config.label}
              </div>
            )}

            {/* Center column */}
            <div className="flex flex-col items-center" style={{ gap: 4 }}>
              {showTop && (
                <div className="text-center" style={lblStyle}>{config.label}</div>
              )}
              <img
                src={codeDataURL}
                alt="Generated code"
                style={{
                  width: isBarcode ? imgSize * 1.4 : imgSize,
                  height: isBarcode ? imgSize * 0.55 : imgSize,
                  objectFit: 'contain',
                  imageRendering: isBarcode ? 'auto' : config.roundness > 0 ? 'auto' : 'pixelated',
                }}
              />
              {showBottom && (
                <div className="text-center" style={lblStyle}>{config.label}</div>
              )}
            </div>

            {/* Right rotated label */}
            {showSides && (
              <div style={{ ...lblStyle, writingMode: 'vertical-rl' }}>
                {config.label}
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-center text-[var(--text-muted)]"
            style={{ width: imgSize, height: imgSize }}
          >
            No content
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="font-semibold text-[var(--text-primary)]">
          {isBarcode ? config.barcodeFormat : 'QR Code'}
        </span>
        <span className="font-mono">
          {isBarcode ? '—' : `${QR_SIZE} x ${QR_SIZE} px`}
        </span>
      </div>

      {/* Download buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={onDownloadPNG}
          icon={<Download size={16} weight="bold" />}
        >
          {t.view.downloadPNG}
        </Button>
        <Button
          variant="secondary"
          onClick={onDownloadSVG}
          icon={<Download size={16} weight="bold" />}
        >
          {t.view.downloadSVG}
        </Button>
      </div>
    </div>
  );
}
