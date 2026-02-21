'use client';

import { useState, useCallback } from 'react';
import type { AppConfig, InterleaveState } from '@/types/config';

export function useExport() {
  const [pdfLoading, setPdfLoading] = useState(false);

  const exportPDF = useCallback(
    async (config: AppConfig, codeDataURLs: string[], interleave: InterleaveState) => {
      setPdfLoading(true);
      try {
        const { exportPDFClient } = await import('@/lib/export-pdf-client');
        await exportPDFClient(config, codeDataURLs, interleave);
      } catch (err) {
        console.error('PDF export failed', err);
      } finally {
        setPdfLoading(false);
      }
    },
    [],
  );

  return { pdfLoading, exportPDF };
}
