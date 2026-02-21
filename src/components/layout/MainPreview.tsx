'use client';

import type { AppConfig, ViewMode } from '@/types/config';
import { GridFour, File } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { PreviewContainer } from '../preview/PreviewContainer';
import { Spinner } from '../shared';

interface MainPreviewProps {
  config: AppConfig;
  pagesData: number[];
  codeDataURLs: string[];
  isGenerating: boolean;
  viewMode: ViewMode;
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function MainPreview({
  config,
  pagesData,
  codeDataURLs,
  isGenerating,
  viewMode,
  currentPage,
  onPrev,
  onNext,
  onViewModeChange,
}: MainPreviewProps) {
  const { t } = useI18n();
  const multiPage = pagesData.length > 1;

  // When only 1 page, always force single-page view
  const activeView: ViewMode = multiPage ? viewMode : 'single';

  return (
    <div className="flex-1 flex flex-col overflow-hidden print-area">
      {/* Toolbar — toggle only visible with 2+ pages */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] no-print">
        <div className="flex items-center gap-2">
          {multiPage ? (
            <>
              <button
                onClick={() => onViewModeChange('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'single'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <File size={14} weight="bold" />
                {t.view.singlePage}
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'grid'
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <GridFour size={14} weight="bold" />
                {t.view.grid}
              </button>
            </>
          ) : (
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {t.view.page} 1
            </span>
          )}
        </div>
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Spinner size={14} />
          </div>
        )}
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden bg-[var(--surface)]">
        <PreviewContainer
          config={config}
          pagesData={pagesData}
          codeDataURLs={codeDataURLs}
          viewMode={activeView}
          currentPage={currentPage}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  );
}
