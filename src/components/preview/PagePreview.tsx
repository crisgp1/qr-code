'use client';

import React, { useMemo } from 'react';
import type { AppConfig } from '@/types/config';
import { getPreviewDimensions, getPerPage } from '@/lib/page-calculator';
import { PREVIEW_SCALE } from '@/lib/constants';
import { CodeCell } from './CodeCell';

interface PagePreviewProps {
  config: AppConfig;
  codeCount: number;
  codeDataURLs: string[];
  startIndex: number;
  pageIndex: number;
  totalPages: number;
}

export const PagePreview = React.memo(function PagePreview({
  config,
  codeCount,
  codeDataURLs,
  startIndex,
  pageIndex,
  totalPages,
}: PagePreviewProps) {
  const { pageW, pageH, marginPx, spacingPx, codeSizePx } = getPreviewDimensions(config);
  const perPage = getPerPage(config);
  const titleH = config.pageTitle ? config.titleSize * 2 * PREVIEW_SCALE : 0;
  const pageNumH = config.showPageNum ? 16 * PREVIEW_SCALE : 0;
  const gridW = pageW - marginPx * 2;
  const gridH = pageH - marginPx * 2 - titleH - pageNumH;

  const cells = useMemo(() => {
    const result: React.ReactNode[] = [];
    const cellW = (gridW - spacingPx * (config.cols - 1)) / config.cols;
    const cellH = (gridH - spacingPx * (config.rows - 1)) / config.rows;
    const lblSpace = config.label ? config.labelSize * PREVIEW_SCALE * 1.8 : 0;
    const maxQR = Math.min(codeSizePx, cellW * 0.92, (cellH - lblSpace) * 0.92);

    for (let i = 0; i < perPage; i++) {
      const globalIndex = startIndex + i;
      const hasCode = i < codeCount;
      // For interleave: use per-code URL; for non-interleave: use first URL
      const dataURL = hasCode
        ? codeDataURLs.length > 1
          ? codeDataURLs[globalIndex] ?? null
          : codeDataURLs[0] ?? null
        : null;

      result.push(
        <CodeCell
          key={i}
          dataURL={dataURL}
          label={hasCode ? config.label : ''}
          labelSize={config.labelSize}
          fontFamily={config.fontFamily}
          maxQR={maxQR}
          rounded={config.roundedCode}
          cutLines={config.cutLines}
          codeMode={config.codeMode}
        />,
      );
    }
    return result;
  }, [
    gridW, gridH, spacingPx, config.cols, config.rows, config.label,
    config.labelSize, config.fontFamily, config.roundedCode, config.cutLines,
    config.codeMode, codeSizePx, perPage, startIndex, codeCount, codeDataURLs,
  ]);

  return (
    <div
      className="page-preview relative overflow-hidden shadow-lg rounded-sm"
      style={{
        width: pageW,
        height: pageH,
        background: config.pageBg,
        fontFamily: config.fontFamily,
      }}
    >
      {config.pageTitle && (
        <div
          className="page-title-el absolute w-full text-center font-bold"
          style={{ top: marginPx, fontSize: config.titleSize * PREVIEW_SCALE, color: '#000' }}
        >
          {config.pageTitle}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: marginPx + titleH,
          left: marginPx,
          width: gridW,
          height: gridH,
          display: 'grid',
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gridTemplateRows: `repeat(${config.rows}, 1fr)`,
          gap: spacingPx,
        }}
      >
        {cells}
      </div>

      {config.showPageNum && (
        <div
          className="absolute w-full text-center"
          style={{ bottom: marginPx * 0.3, fontSize: 11 * PREVIEW_SCALE, color: '#999' }}
        >
          {pageIndex + 1} / {totalPages}
        </div>
      )}
    </div>
  );
});
