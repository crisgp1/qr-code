import type { AppConfig } from '@/types/config';
import { downloadBlob } from './utils';

export function exportPNG(config: AppConfig): void {
  const pages = document.querySelectorAll('.page-preview');
  if (!pages.length) return;

  pages.forEach((page, idx) => {
    const el = page as HTMLElement;
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = el.offsetWidth * scale;
    canvas.height = el.offsetHeight * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.fillStyle = config.pageBg;
    ctx.fillRect(0, 0, el.offsetWidth, el.offsetHeight);

    const pageRect = el.getBoundingClientRect();
    const imgs = el.querySelectorAll('img');
    const lbls = el.querySelectorAll('.qr-lbl');
    const cells = el.querySelectorAll('.qr-cell-preview');

    // Title
    const titleEl = el.querySelector('.page-title-el') as HTMLElement;
    if (titleEl?.textContent) {
      ctx.font = `bold ${parseFloat(getComputedStyle(titleEl).fontSize)}px sans-serif`;
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(
        titleEl.textContent,
        el.offsetWidth / 2,
        titleEl.getBoundingClientRect().top - pageRect.top + parseFloat(getComputedStyle(titleEl).fontSize),
      );
    }

    imgs.forEach((img) => {
      const r = img.getBoundingClientRect();
      ctx.drawImage(img, r.left - pageRect.left, r.top - pageRect.top, r.width, r.height);
    });

    if (config.cutLines) {
      ctx.strokeStyle = '#ccc';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 0.5;
      cells.forEach((cell) => {
        const r = cell.getBoundingClientRect();
        ctx.strokeRect(r.left - pageRect.left, r.top - pageRect.top, r.width, r.height);
      });
    }

    lbls.forEach((lbl) => {
      const el2 = lbl as HTMLElement;
      if (!el2.textContent) return;
      const r = el2.getBoundingClientRect();
      ctx.font = `${parseFloat(getComputedStyle(el2).fontSize)}px sans-serif`;
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(
        el2.textContent,
        r.left - pageRect.left + r.width / 2,
        r.top - pageRect.top + parseFloat(getComputedStyle(el2).fontSize),
      );
    });

    canvas.toBlob((blob) => {
      const filename = config.outputFilename || 'QR_Sheet';
      if (blob) downloadBlob(blob, `${filename}_${idx + 1}.png`);
    }, 'image/png');
  });
}
