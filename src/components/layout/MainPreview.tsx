'use client';

import type { AppConfig, ViewMode } from '@/types/config';
import { GridFour, File, QrCode } from '@phosphor-icons/react';
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
  onDownloadPNG: () => void;
  onDownloadSVG: () => void;
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
  onDownloadPNG,
  onDownloadSVG,
}: MainPreviewProps) {
  const { t } = useI18n();

  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'singleCode', icon: <QrCode size={14} weight="bold" />, label: t.view.singleCode },
    { mode: 'single', icon: <File size={14} weight="bold" />, label: t.view.singlePage },
    { mode: 'grid', icon: <GridFour size={14} weight="bold" />, label: t.view.grid },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden print-area">
      {/* Toolbar — always visible */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] no-print">
        <div className="flex items-center gap-1">
          {viewButtons.map((btn) => (
            <button
              key={btn.mode}
              onClick={() => onViewModeChange(btn.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === btn.mode
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
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
          viewMode={viewMode}
          currentPage={currentPage}
          onPrev={onPrev}
          onNext={onNext}
          onDownloadPNG={onDownloadPNG}
          onDownloadSVG={onDownloadSVG}
        />
      </div>
    </div>
  );
}
