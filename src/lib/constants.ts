export const CM_PER_INCH = 2.54;
export const PX_PER_CM = 37.795;
export const PX_PER_INCH = PX_PER_CM * CM_PER_INCH;

export const PAGE_SIZES = {
  letter: { width: 8.5, height: 11, label: 'Letter (8.5 x 11 in)' },
  a4: { width: 8.27, height: 11.69, label: 'A4 (210 x 297 mm)' },
  a5: { width: 5.83, height: 8.27, label: 'A5 (148 x 210 mm)' },
  custom: { width: 8.5, height: 11, label: 'Custom' },
} as const;

export const FONTS = [
  { label: 'Sans-serif', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
] as const;

export const QR_SIZE = 800;
export const BARCODE_WIDTH = 2;
export const BARCODE_HEIGHT = 100;

export const PREVIEW_SCALE = 0.75;

export const CODE_GEN_DEBOUNCE_MS = 100;
export const BATCH_SIZE = 20;

export const STORAGE_KEY = 'qr-barcode-config';
