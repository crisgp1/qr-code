'use client';

import { useState, useCallback } from 'react';
import type { InterleaveState, InterleaveMode } from '@/types/config';
import { defaultInterleave } from '@/types/config';
import { parseCSV, getColumn } from '@/lib/csv-parser';

export function useInterleave() {
  const [interleave, setInterleave] = useState<InterleaveState>(defaultInterleave);

  const setMode = useCallback((mode: InterleaveMode) => {
    setInterleave((prev) => ({
      ...prev,
      mode,
      entries: mode === 'off' ? [] : prev.entries,
    }));
  }, []);

  const setManualEntries = useCallback((text: string) => {
    const entries = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    setInterleave((prev) => ({ ...prev, entries }));
  }, []);

  const loadCSV = useCallback((text: string, fileName: string) => {
    const csv = parseCSV(text);
    const entries = csv.headers.length > 0 ? getColumn(csv, 0) : [];
    setInterleave({
      mode: 'csv',
      entries,
      csvFileName: fileName,
      csvColumn: 0,
    });
    return csv;
  }, []);

  const setCsvColumn = useCallback((csvText: string, colIndex: number) => {
    const csv = parseCSV(csvText);
    const entries = getColumn(csv, colIndex);
    setInterleave((prev) => ({
      ...prev,
      entries,
      csvColumn: colIndex,
    }));
  }, []);

  const reset = useCallback(() => {
    setInterleave(defaultInterleave);
  }, []);

  return {
    interleave,
    setMode,
    setManualEntries,
    loadCSV,
    setCsvColumn,
    reset,
  };
}
