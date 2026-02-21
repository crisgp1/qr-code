'use client';

import type { AppConfig, ViewMode } from '@/types/config';
import { GridView } from './GridView';
import { SinglePageView } from './SinglePageView';

interface PreviewContainerProps {
  config: AppConfig;
  pagesData: number[];
  codeDataURLs: string[];
  viewMode: ViewMode;
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PreviewContainer({
  config,
  pagesData,
  codeDataURLs,
  viewMode,
  currentPage,
  onPrev,
  onNext,
}: PreviewContainerProps) {
  if (viewMode === 'single') {
    return (
      <SinglePageView
        config={config}
        pagesData={pagesData}
        codeDataURLs={codeDataURLs}
        currentPage={currentPage}
        onPrev={onPrev}
        onNext={onNext}
      />
    );
  }

  return (
    <GridView
      config={config}
      pagesData={pagesData}
      codeDataURLs={codeDataURLs}
    />
  );
}
