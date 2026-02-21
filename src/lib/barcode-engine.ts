import JsBarcode from 'jsbarcode';
import type { BarcodeFormat } from '@/types/config';

// ---------------------------------------------------------------------------
// Validation schemas per format
// ---------------------------------------------------------------------------

function ean13Validate(text: string): string | null {
  if (!text) return 'empty';
  if (!/^\d*$/.test(text)) return 'digits_only';
  if (text.length < 12) return `need_digits:${12 - text.length}`;
  if (text.length > 13) return 'too_long:13';
  return null;
}

function upcValidate(text: string): string | null {
  if (!text) return 'empty';
  if (!/^\d*$/.test(text)) return 'digits_only';
  if (text.length < 11) return `need_digits:${11 - text.length}`;
  if (text.length > 12) return 'too_long:12';
  return null;
}

function code39Validate(text: string): string | null {
  if (!text) return 'empty';
  if (!/^[A-Z0-9 \-.$/+%]*$/i.test(text)) {
    const invalid = text.replace(/[A-Z0-9 \-.$/+%]/gi, '');
    const unique = [...new Set(invalid)].slice(0, 5).join(' ');
    return `invalid_chars:${unique}`;
  }
  return null;
}

function code128Validate(text: string): string | null {
  if (!text) return 'empty';
  return null;
}

const validators: Record<BarcodeFormat, (t: string) => string | null> = {
  EAN13: ean13Validate,
  UPC: upcValidate,
  CODE39: code39Validate,
  CODE128: code128Validate,
};

// ---------------------------------------------------------------------------
// Public validation API
// ---------------------------------------------------------------------------

export interface BarcodeValidation {
  valid: boolean;
  /** Raw error code — parsed by the UI into a human-readable message */
  errorCode: string | null;
}

export function validateBarcodeInput(
  text: string,
  format: BarcodeFormat,
): BarcodeValidation {
  const errorCode = validators[format](text);
  return { valid: errorCode === null, errorCode };
}

// ---------------------------------------------------------------------------
// Placeholders
// ---------------------------------------------------------------------------

export function getBarcodePlaceholder(format: BarcodeFormat): string {
  switch (format) {
    case 'EAN13':  return '590123412345';
    case 'UPC':    return '01234567890';
    case 'CODE39': return 'ITEM-001';
    case 'CODE128':
    default:       return 'ABC-123';
  }
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

interface BarcodeOptions {
  format: BarcodeFormat;
  text: string;
  lineColor: string;
  background: string;
  width?: number;
  height?: number;
}

export function generateBarcode(options: BarcodeOptions): string {
  const canvas = document.createElement('canvas');
  const { valid } = validateBarcodeInput(options.text, options.format);

  if (!valid) return renderPlaceholder(canvas, options.background);

  try {
    JsBarcode(canvas, options.text, {
      format: options.format,
      lineColor: options.lineColor,
      background: options.background,
      width: options.width ?? 2,
      height: options.height ?? 100,
      displayValue: true,
      margin: 10,
      fontSize: 14,
    });
    return canvas.toDataURL('image/png');
  } catch {
    return renderPlaceholder(canvas, options.background);
  }
}

function renderPlaceholder(canvas: HTMLCanvasElement, bg: string): string {
  canvas.width = 300;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 300, 80);
    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(4, 4, 292, 72);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('...', 150, 40);
  }
  return canvas.toDataURL('image/png');
}

export function generateBarcodeSVG(options: BarcodeOptions): string {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  try {
    JsBarcode(svg, options.text || ' ', {
      format: options.format,
      lineColor: options.lineColor,
      background: options.background,
      width: options.width ?? 2,
      height: options.height ?? 100,
      displayValue: true,
      margin: 10,
      xmlDocument: document,
    });
    return new XMLSerializer().serializeToString(svg);
  } catch {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><rect x="4" y="4" width="292" height="72" fill="none" stroke="#e5e7eb" stroke-dasharray="4"/><text x="150" y="44" text-anchor="middle" fill="#9ca3af" font-size="13">...</text></svg>';
  }
}
