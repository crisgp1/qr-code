'use client';

import type { AppConfig, ViewMode } from '@/types/config';
import { GridView } from './GridView';
import { SinglePageView } from './SinglePageView';
import { SingleCodeView } from './SingleCodeView';

interface PreviewContainerProps {
  config: AppConfig;
  pagesData: number[];
  codeDataURLs: string[];
  viewMode: ViewMode;
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
}

export function PreviewContainer({
  config,
  pagesData,
  codeDataURLs,
  viewMode,
  currentPage,
  onPrev,
  onNext,
  onDownloadPNG,
  onDownloadSVG,
}: PreviewContainerProps) {
  if (viewMode === 'singleCode') {
    return (
      <SingleCodeView
        config={config}
        codeDataURL={codeDataURLs[0] ?? null}
        onDownloadPNG={onDownloadPNG}
        onDownloadSVG={onDownloadSVG}
      />
    );
  }

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
