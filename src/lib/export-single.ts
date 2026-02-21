import type { AppConfig } from '@/types/config';
import { downloadBlob } from './utils';
import { generateQRDataURL, generateQRSVG } from './qr-engine';
import { generateBarcode, generateBarcodeSVG } from './barcode-engine';

export async function exportSinglePNG(content: string, config: AppConfig): Promise<void> {
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
    dataURL = await generateQRDataURL(content, config.codeColor, config.codeBg);
  }

  // Convert data URL to blob
  const res = await fetch(dataURL);
  const blob = await res.blob();
  downloadBlob(blob, `code_hires.png`);
}

export async function exportSingleSVG(content: string, config: AppConfig): Promise<void> {
  let svg: string;

  if (config.codeMode === 'barcode') {
    svg = generateBarcodeSVG({
      format: config.barcodeFormat,
      text: content,
      lineColor: config.codeColor,
      background: config.codeBg,
    });
  } else {
    svg = await generateQRSVG(content, config.codeColor, config.codeBg);
  }

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `code.svg`);
}
