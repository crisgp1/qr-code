import { QR_SIZE } from './constants';
import { roundRect } from './utils';

export function overlayLogo(
  canvas: HTMLCanvasElement,
  logoImg: HTMLImageElement,
  logoSizePct: number,
  bgColor: string,
  showBg: boolean,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = QR_SIZE;
  const pct = logoSizePct / 100;
  const logoW = size * pct;
  const logoH = size * pct;
  const cx = size / 2;
  const cy = size / 2;

  if (showBg) {
    const pad = logoW * 0.12;
    ctx.fillStyle = bgColor;
    roundRect(
      ctx,
      cx - logoW / 2 - pad,
      cy - logoH / 2 - pad,
      logoW + pad * 2,
      logoH + pad * 2,
      pad,
    );
    ctx.fill();
  }

  const ratio = logoImg.width / logoImg.height;
  let dw = logoW;
  let dh = logoH;
  if (ratio > 1) dh = logoW / ratio;
  else dw = logoH * ratio;

  ctx.drawImage(logoImg, cx - dw / 2, cy - dh / 2, dw, dh);
}
