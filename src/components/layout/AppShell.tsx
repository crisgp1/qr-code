'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { AppConfig } from '@/types/config';
import { useConfig } from '@/hooks/useConfig';
import { useTheme } from '@/hooks/useTheme';
import { useLogo } from '@/hooks/useLogo';
import { useInterleave } from '@/hooks/useInterleave';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';
import { useViewMode } from '@/hooks/useViewMode';
import { useStorage } from '@/hooks/useStorage';
import { useExport } from '@/hooks/useExport';
import { getPagesData, getNumPages } from '@/lib/page-calculator';
import { exportPNG } from '@/lib/export-png';
import { exportSinglePNG, exportSingleSVG } from '@/lib/export-single';
import { exportBulkZIP } from '@/lib/export-zip';
import { encodeContent } from '@/lib/qr-engine';
import { Sidebar } from './Sidebar';
import { MainPreview } from './MainPreview';
import { MobileToolbar } from './MobileToolbar';

export function AppShell() {
  const { config, dispatch } = useConfig();
  const { theme, toggleTheme } = useTheme();
  const { logoImg, logoPreviewURL, fileRef, handleLogoUpload, removeLogo } = useLogo();
  const {
    interleave,
    setMode: setInterleaveMode,
    setManualEntries,
    loadCSV,
    setCsvColumn,
  } = useInterleave();

  // Sync totalCodes with interleave entries — memoised to keep a stable
  // reference so downstream hooks (useCodeGeneration, etc.) don't re-trigger
  // on every unrelated re-render.
  const effectiveConfig = useMemo<AppConfig>(
    () => ({
      ...config,
      totalCodes:
        interleave.mode !== 'off' && interleave.entries.length > 0
          ? interleave.entries.length
          : config.totalCodes,
    }),
    [config, interleave.mode, interleave.entries.length],
  );

  const { codeDataURLs, isGenerating, encodedContent } = useCodeGeneration(
    effectiveConfig,
    interleave,
    logoImg,
  );

  const numPages = getNumPages(effectiveConfig);
  const pagesData = getPagesData(effectiveConfig);
  const { viewMode, setViewMode, currentPage, nextPage, prevPage } = useViewMode(numPages);
  const { save, load, message: saveMessage } = useStorage(dispatch);
  const { pdfLoading, exportPDF } = useExport();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipProgress, setZipProgress] = useState<string | null>(null);
  const zipAbort = useRef(false);

  const handlePDF = useCallback(() => {
    exportPDF(effectiveConfig, codeDataURLs, interleave);
  }, [effectiveConfig, codeDataURLs, interleave, exportPDF]);

  const handlePNG = useCallback(() => {
    exportPNG(effectiveConfig);
  }, [effectiveConfig]);

  const handleSinglePNG = useCallback(() => {
    exportSinglePNG(encodedContent, effectiveConfig);
  }, [encodedContent, effectiveConfig]);

  const handleSingleSVG = useCallback(() => {
    exportSingleSVG(encodedContent, effectiveConfig);
  }, [encodedContent, effectiveConfig]);

  const handleZIP = useCallback(async () => {
    if (zipLoading) return;
    setZipLoading(true);
    setZipProgress(null);
    zipAbort.current = false;
    try {
      await exportBulkZIP(effectiveConfig, interleave, (done, total) => {
        setZipProgress(`${done}/${total}`);
      });
    } finally {
      setZipLoading(false);
      setZipProgress(null);
    }
  }, [effectiveConfig, interleave, zipLoading]);

  const handleSave = useCallback(() => {
    save(config);
  }, [save, config]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeToggle={toggleTheme}
        interleave={interleave}
        onInterleaveMode={setInterleaveMode}
        onManualEntries={setManualEntries}
        onCSVLoad={loadCSV}
        onCSVColumn={setCsvColumn}
        logoImg={logoImg}
        logoPreviewURL={logoPreviewURL}
        fileRef={fileRef}
        onLogoUpload={handleLogoUpload}
        onLogoRemove={removeLogo}
        pdfLoading={pdfLoading}
        onPDF={handlePDF}
        onPNG={handlePNG}
        onSinglePNG={handleSinglePNG}
        onSingleSVG={handleSingleSVG}
        onZIP={handleZIP}
        zipLoading={zipLoading}
        zipProgress={zipProgress}
        onSave={handleSave}
        onLoad={load}
        onReset={handleReset}
        saveMessage={saveMessage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileToolbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onPDF={handlePDF}
          pdfLoading={pdfLoading}
        />
        <MainPreview
          config={effectiveConfig}
          pagesData={pagesData}
          codeDataURLs={codeDataURLs}
          isGenerating={isGenerating}
          viewMode={viewMode}
          currentPage={currentPage}
          onPrev={prevPage}
          onNext={nextPage}
          onViewModeChange={setViewMode}
          onDownloadPNG={handleSinglePNG}
          onDownloadSVG={handleSingleSVG}
        />
      </div>
    </div>
  );
}
