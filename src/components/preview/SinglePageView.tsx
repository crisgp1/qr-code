'use client';

import { useRef, useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { AppConfig } from '@/types/config';
import { getPerPage, getPreviewDimensions } from '@/lib/page-calculator';
import { useI18n } from '@/i18n';
import { PagePreview } from './PagePreview';

interface SinglePageViewProps {
  config: AppConfig;
  pagesData: number[];
  codeDataURLs: string[];
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SinglePageView({
  config,
  pagesData,
  codeDataURLs,
  currentPage,
  onPrev,
  onNext,
}: SinglePageViewProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const perPage = getPerPage(config);
  const count = pagesData[currentPage] ?? 0;
  const startIndex = currentPage * perPage;
  const { pageW, pageH } = getPreviewDimensions(config);
  const totalPages = pagesData.length;

  // Responsive scale
  const [containerW, setContainerW] = useState(800);
  const [containerH, setContainerH] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
      setContainerH(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const navHeight = 52; // space for navigation bar
  const padding = 48;
  const scaleX = (containerW - padding) / pageW;
  const scaleY = (containerH - navHeight - padding) / pageH;
  const scale = Math.min(1, scaleX, scaleY);

  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  return (
    <div ref={containerRef} className="h-full flex flex-col items-center overflow-hidden">
      {/* Navigation bar */}
      <div className="flex items-center gap-3 py-2.5 shrink-0">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`p-2 rounded-lg transition-colors ${
            hasPrev
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-primary)]'
              : 'opacity-30 cursor-not-allowed text-[var(--text-muted)]'
          }`}
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <span className="text-sm font-semibold text-[var(--text-secondary)] tabular-nums min-w-[100px] text-center">
          {t.view.page} {currentPage + 1} {t.view.of} {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-lg transition-colors ${
            hasNext
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text-primary)]'
              : 'opacity-30 cursor-not-allowed text-[var(--text-muted)]'
          }`}
        >
          <CaretRight size={20} weight="bold" />
        </button>
      </div>

      {/* Page */}
      <div className="flex-1 flex items-start justify-center overflow-auto w-full px-4 pb-4">
        <div
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            width: pageW,
            height: pageH,
            marginBottom: scale < 1 ? -(pageH * (1 - scale)) : 0,
          }}
        >
          <PagePreview
            config={config}
            codeCount={count}
            codeDataURLs={codeDataURLs}
            startIndex={startIndex}
            pageIndex={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
