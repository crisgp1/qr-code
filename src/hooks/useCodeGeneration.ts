'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { AppConfig, InterleaveState } from '@/types/config';
import { generateCodeDataURL } from '@/lib/code-factory';
import { encodeContent } from '@/lib/qr-engine';
import { CODE_GEN_DEBOUNCE_MS, BATCH_SIZE } from '@/lib/constants';

export function useCodeGeneration(
  config: AppConfig,
  interleave: InterleaveState,
  logoImg: HTMLImageElement | null,
) {
  const [codeDataURLs, setCodeDataURLs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const cancelRef = useRef(false);

  // Use refs so the generate callback is stable and doesn't re-trigger
  // the effect every time a parent re-render produces new object references.
  const configRef = useRef(config);
  const interleaveRef = useRef(interleave);
  const logoImgRef = useRef(logoImg);
  configRef.current = config;
  interleaveRef.current = interleave;
  logoImgRef.current = logoImg;

  const generate = useCallback(async () => {
    const cfg = configRef.current;
    const il = interleaveRef.current;
    const logo = logoImgRef.current;

    cancelRef.current = false;
    setIsGenerating(true);

    try {
      if (il.mode === 'off' || il.entries.length === 0) {
        // Single code — generate once
        const url = await generateCodeDataURL(cfg, logo);
        if (!cancelRef.current) {
          setCodeDataURLs([url]);
        }
      } else {
        // Multiple different codes — batch generate
        const entries = il.entries;
        const urls: string[] = [];

        for (let i = 0; i < entries.length; i++) {
          if (cancelRef.current) break;

          urls.push(await generateCodeDataURL(cfg, logo, entries[i]));

          // Yield between batches
          if ((i + 1) % BATCH_SIZE === 0) {
            await new Promise((r) => setTimeout(r, 0));
            if (!cancelRef.current) {
              setCodeDataURLs([...urls]);
            }
          }
        }

        if (!cancelRef.current) {
          setCodeDataURLs([...urls]);
        }
      }
    } catch {
      // ignore generation errors
    } finally {
      if (!cancelRef.current) {
        setIsGenerating(false);
      }
    }
  }, []); // stable — reads from refs

  // Re-trigger generation when the actual inputs change.
  useEffect(() => {
    cancelRef.current = true;
    const timer = setTimeout(generate, CODE_GEN_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      cancelRef.current = true;
    };
  }, [config, interleave, logoImg, generate]);

  // Compute the encoded content for single-download purposes
  const encodedContent = config.codeMode === 'barcode'
    ? config.barcodeContent
    : encodeContent(config.content);

  return { codeDataURLs, isGenerating, encodedContent };
}
