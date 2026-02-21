'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { AppConfig } from '@/types/config';
import { getPerPage, getPreviewDimensions } from '@/lib/page-calculator';
import { PagePreview } from './PagePreview';
import { PageIndicator } from './PageIndicator';

interface GridViewProps {
  config: AppConfig;
  pagesData: number[];
  codeDataURLs: string[];
}

/**
 * Multi-page grid view — pages are arranged side by side in rows,
 * similar to Word's "Multiple Pages" view. Scales pages down so
 * multiple fit per row.
 */
export function GridView({ config, pagesData, codeDataURLs }: GridViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(
    () => new Set(pagesData.map((_, i) => i)),
  );
  const perPage = getPerPage(config);
  const { pageW, pageH } = getPreviewDimensions(config);

  // Measure available width
  const [containerW, setContainerW] = useState(800);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Calculate how many pages fit per row (at least 2 for the grid to make sense)
  const gap = 24;
  const outerPad = 32;
  const availW = containerW - outerPad * 2;

  // Try fitting 2, 3, 4… columns and pick the most that still gives ≥120px thumbnails
  const minThumbW = 140;
  let cols = 2;
  for (let c = 4; c >= 2; c--) {
    const thumbW = (availW - gap * (c - 1)) / c;
    if (thumbW >= minThumbW) {
      cols = c;
      break;
    }
  }

  const thumbW = (availW - gap * (cols - 1)) / cols;
  const scale = thumbW / pageW;
  const thumbH = pageH * scale;

  // Lazy loading via IntersectionObserver
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setVisiblePages((prev) => {
        const next = new Set(prev);
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-page-idx'));
          if (entry.isIntersecting) next.add(idx);
        });
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      rootMargin: '300px',
      threshold: 0,
    });

    const wrappers = container.querySelectorAll('[data-page-idx]');
    wrappers.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pagesData.length, observerCallback]);

  // Build code start indices
  const startIndices: number[] = [];
  let accum = 0;
  for (const count of pagesData) {
    startIndices.push(accum);
    accum += count;
  }

  return (
    <div ref={scrollRef} className="h-full overflow-auto p-4 sm:p-6">
      <div
        className="mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${thumbW}px)`,
          gap,
          justifyContent: 'center',
        }}
      >
        {pagesData.map((count, pageIdx) => (
          <div key={pageIdx} data-page-idx={pageIdx} className="flex flex-col items-center">
            <PageIndicator current={pageIdx + 1} total={pagesData.length} />
            {visiblePages.has(pageIdx) ? (
              <div
                style={{
                  width: thumbW,
                  height: thumbH,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: pageW,
                    height: pageH,
                  }}
                >
                  <PagePreview
                    config={config}
                    codeCount={count}
                    codeDataURLs={codeDataURLs}
                    startIndex={startIndices[pageIdx]}
                    pageIndex={pageIdx}
                    totalPages={pagesData.length}
                  />
                </div>
              </div>
            ) : (
              <div
                className="bg-gray-50 dark:bg-gray-800 rounded-sm shadow-lg"
                style={{ width: thumbW, height: thumbH }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
