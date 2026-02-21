import type { AppConfig } from '@/types/config';
import { generateQR, encodeContent } from './qr-engine';
import { generateBarcode } from './barcode-engine';
import { overlayLogo } from './logo-overlay';

export async function generateCodeDataURL(
  config: AppConfig,
  logoImg: HTMLImageElement | null,
  contentOverride?: string,
): Promise<string> {
  if (config.codeMode === 'barcode') {
    const text = contentOverride ?? config.barcodeContent;
    return generateBarcode({
      format: config.barcodeFormat,
      text,
      lineColor: config.codeColor,
      background: config.codeBg,
    });
  }

  // QR mode
  const text = contentOverride ?? encodeContent(config.content);
  const canvas = await generateQR(text, config.codeColor, config.codeBg, config.roundedCode);

  if (logoImg) {
    overlayLogo(canvas, logoImg, config.logoSize, config.codeBg, config.logoBgWhite);
  }

  return canvas.toDataURL('image/png');
}
