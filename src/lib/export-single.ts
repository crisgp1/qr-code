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
    const bg = config.transparentBg ? 'transparent' : config.codeBg;
    dataURL = await generateQRDataURL(content, config.codeColor, bg, config.errorCorrection);
  }

  // Convert data URL to blob
  const res = await fetch(dataURL);
  const blob = await res.blob();
  const filename = config.outputFilename || 'code_hires';
  downloadBlob(blob, `${filename}.png`);
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
    const bg = config.transparentBg ? 'transparent' : config.codeBg;
    svg = await generateQRSVG(content, config.codeColor, bg, config.errorCorrection);
  }

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const filename = config.outputFilename || 'code';
  downloadBlob(blob, `${filename}.svg`);
}
