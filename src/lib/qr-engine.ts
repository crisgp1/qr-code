import QRCode from 'qrcode';
import type { ContentConfig, WiFiConfig, VCardConfig, EmailConfig, SMSConfig } from '@/types/config';
import { QR_SIZE } from './constants';

function encodeWiFi(wifi: WiFiConfig): string {
  const hidden = wifi.hidden ? 'H:true' : '';
  return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};${hidden};`;
}

function encodeVCard(vc: VCardConfig): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vc.lastName};${vc.firstName};;;`,
    `FN:${vc.firstName} ${vc.lastName}`,
  ];
  if (vc.phone) lines.push(`TEL:${vc.phone}`);
  if (vc.email) lines.push(`EMAIL:${vc.email}`);
  if (vc.org) lines.push(`ORG:${vc.org}`);
  if (vc.title) lines.push(`TITLE:${vc.title}`);
  if (vc.url) lines.push(`URL:${vc.url}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

function encodeEmail(email: EmailConfig): string {
  const params: string[] = [];
  if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
  if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
  const query = params.length ? `?${params.join('&')}` : '';
  return `mailto:${email.to}${query}`;
}

function encodeSMS(sms: SMSConfig): string {
  const body = sms.body ? `?body=${encodeURIComponent(sms.body)}` : '';
  return `sms:${sms.number}${body}`;
}

export function encodeContent(content: ContentConfig): string {
  switch (content.type) {
    case 'url': {
      const val = content.value.trim();
      if (val && !val.match(/^https?:\/\//i)) return `https://${val}`;
      return val;
    }
    case 'text':
      return content.value;
    case 'email':
      return encodeEmail(content.email);
    case 'phone':
      return `tel:${content.phone}`;
    case 'sms':
      return encodeSMS(content.sms);
    case 'wifi':
      return encodeWiFi(content.wifi);
    case 'vcard':
      return encodeVCard(content.vcard);
    default:
      return content.value;
  }
}

// ---------------------------------------------------------------------------
// Rounded-rect helper (draws a single filled rounded rectangle)
// ---------------------------------------------------------------------------

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------------------
// QR generation
// ---------------------------------------------------------------------------

export async function generateQR(
  text: string,
  color: string,
  bg: string,
  rounded = false,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');

  if (!rounded) {
    await QRCode.toCanvas(canvas, text || ' ', {
      width: QR_SIZE,
      errorCorrectionLevel: 'H',
      color: { dark: color, light: bg },
      margin: 1,
    });
    return canvas;
  }

  // --- Rounded QR: draw each module as a rounded dot ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qr = (QRCode as any).create(text || ' ', {
    errorCorrectionLevel: 'H',
  });

  const moduleCount: number = qr.modules.size;
  const data: Uint8Array = qr.modules.data;
  const quietZone = 2; // modules of margin
  const totalModules = moduleCount + quietZone * 2;
  const modPx = QR_SIZE / totalModules;

  canvas.width = QR_SIZE;
  canvas.height = QR_SIZE;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, QR_SIZE, QR_SIZE);

  // Rounded modules
  ctx.fillStyle = color;
  const gap = modPx * 0.12;
  const dotSize = modPx - gap;
  const r = dotSize * 0.35;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Bit 0 indicates a dark module
      if (data[row * moduleCount + col] & 1) {
        const x = (col + quietZone) * modPx + gap / 2;
        const y = (row + quietZone) * modPx + gap / 2;
        roundRect(ctx, x, y, dotSize, dotSize, r);
      }
    }
  }

  return canvas;
}

export async function generateQRDataURL(
  text: string,
  color: string,
  bg: string,
): Promise<string> {
  const canvas = await generateQR(text, color, bg);
  return canvas.toDataURL('image/png');
}

export async function generateQRSVG(
  text: string,
  color: string,
  bg: string,
): Promise<string> {
  return QRCode.toString(text || ' ', {
    type: 'svg',
    errorCorrectionLevel: 'H',
    color: { dark: color, light: bg },
    margin: 1,
  });
}
