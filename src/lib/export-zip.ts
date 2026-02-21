import JSZip from 'jszip';
import type { AppConfig, InterleaveState } from '@/types/config';
import { generateQRDataURL, generateQRSVG, encodeContent } from './qr-engine';
import { generateBarcode, generateBarcodeSVG } from './barcode-engine';
import { downloadBlob } from './utils';

async function generatePNG(content: string, config: AppConfig): Promise<Blob> {
  let dataURL: string;
  if (config.codeMode === 'barcode') {
    dataURL = generateBarcode({
      format: config.barcodeFormat,
      text: content,
      lineColor: config.codeColor,
      background: config.codeBg,
      width: 4,
      height: 200,
    });
  } else {
    const bg = config.transparentBg ? 'transparent' : config.codeBg;
    dataURL = await generateQRDataURL(content, config.codeColor, bg, config.errorCorrection);
  }
  const res = await fetch(dataURL);
  return res.blob();
}

async function generateSVGBlob(content: string, config: AppConfig): Promise<Blob> {
  let svg: string;
  if (config.codeMode === 'barcode') {
    svg = generateBarcodeSVG({
      format: config.barcodeFormat,
      text: content,
      lineColor: config.codeColor,
      background: config.codeBg,
    });
  } else {
    const bg = config.transparentBg ? 'transparent' : config.codeBg;
    svg = await generateQRSVG(content, config.codeColor, bg, config.errorCorrection);
  }
  return new Blob([svg], { type: 'image/svg+xml' });
}

function pad(n: number, total: number): string {
  const digits = String(total).length;
  return String(n).padStart(digits, '0');
}

export async function exportBulkZIP(
  config: AppConfig,
  interleave: InterleaveState,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const zip = new JSZip();
  const baseName = config.outputFilename || 'code';

  // Build list of contents to generate
  const entries: string[] = [];
  if (interleave.mode !== 'off' && interleave.entries.length > 0) {
    entries.push(...interleave.entries);
  } else {
    const content = config.codeMode === 'barcode'
      ? config.barcodeContent
      : encodeContent(config.content);
    for (let i = 0; i < config.totalCodes; i++) {
      entries.push(content);
    }
  }

  const total = entries.length;

  // Generate in batches to avoid blocking UI
  const BATCH = 10;
  for (let i = 0; i < total; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (content, j) => {
        const idx = i + j;
        const label = pad(idx + 1, total);
        const png = await generatePNG(content, config);
        const svg = await generateSVGBlob(content, config);
        return { label, png, svg };
      }),
    );

    for (const { label, png, svg } of results) {
      zip.file(`${baseName}_${label}.png`, png);
      zip.file(`${baseName}_${label}.svg`, svg);
    }

    onProgress?.(Math.min(i + BATCH, total), total);

    // Yield to UI thread
    await new Promise((r) => setTimeout(r, 0));
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${baseName}_bulk.zip`);
}
