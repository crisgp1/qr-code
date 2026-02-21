'use client';

import { useState, useCallback } from 'react';
import type { ViewMode } from '@/types/config';

export function useViewMode(totalPages: number) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'single' : 'grid'));
  }, []);

  return {
    viewMode,
    setViewMode,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    toggleViewMode,
  };
}
