import type { AppConfig, InterleaveState, PageSize } from '@/types/config';
import { PAGE_SIZES } from './constants';
import { getPerPage, getNumPages } from './page-calculator';

function getPageSizeCSS(config: AppConfig): string {
  const size = config.pageSize as PageSize;
  if (size === 'custom') return `${config.customPageWidth}in ${config.customPageHeight}in`;
  if (size === 'a4') return 'A4';
  if (size === 'a5') return 'A5';
  return 'letter';
}

function getPageDimensionsInches(config: AppConfig): { w: number; h: number } {
  const size = config.pageSize as PageSize;
  if (size === 'custom') return { w: config.customPageWidth, h: config.customPageHeight };
  const def = PAGE_SIZES[size] ?? PAGE_SIZES.letter;
  return { w: def.width, h: def.height };
}

export function buildPrintHTML(
  config: AppConfig,
  codeDataURLs: string[],
  interleave: InterleaveState,
): string {
  const perPage = getPerPage(config);
  const numPages = getNumPages(config);
  const pageCSS = getPageSizeCSS(config);
  const dims = getPageDimensionsInches(config);
  const isInterleave = interleave.mode !== 'off' && codeDataURLs.length > 1;

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
@page{size:${pageCSS};margin:0}
body{font-family:${config.fontFamily}}
.page{width:${dims.w}in;height:${dims.h}in;padding:${config.margin}cm;background:${config.pageBg};position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:avoid}
.title{text-align:center;font-weight:700;font-size:${config.titleSize}pt;margin-bottom:8px}
.grid{display:grid;grid-template-columns:repeat(${config.cols},1fr);grid-template-rows:repeat(${config.rows},1fr);gap:${config.spacing}cm;height:calc(100% ${config.pageTitle ? `- ${config.titleSize * 1.5}pt - 8px` : ''} ${config.showPageNum ? '- 20px' : ''})}
.cell{display:flex;flex-direction:column;align-items:center;justify-content:center;${config.cutLines ? 'border:1px dashed #ccc;' : ''}}
.cell img{width:${config.codeSize}cm;height:${config.codeMode === 'barcode' ? config.codeSize * 0.5 : config.codeSize}cm;object-fit:contain;image-rendering:${config.codeMode === 'barcode' ? 'auto' : 'pixelated'};${config.roundedCode && config.codeMode !== 'barcode' ? `border-radius:${config.codeSize * 0.08}cm` : ''}}
.lbl{font-size:${config.labelSize}pt;color:#333;margin-top:3px;text-align:center}
.pnum{position:absolute;bottom:${config.margin * 0.3}cm;width:100%;text-align:center;font-size:9pt;color:#999}
</style></head><body>`;

  let globalIdx = 0;
  for (let p = 0; p < numPages; p++) {
    const count = Math.min(perPage, config.totalCodes - globalIdx);
    html += '<div class="page">';
    if (config.pageTitle) html += `<div class="title">${config.pageTitle}</div>`;
    html += '<div class="grid">';
    for (let i = 0; i < perPage; i++) {
      html += '<div class="cell">';
      if (i < count) {
        const src = isInterleave
          ? codeDataURLs[globalIdx] ?? codeDataURLs[0]
          : codeDataURLs[0] ?? '';
        html += `<img src="${src}"/>`;
        if (config.label) html += `<div class="lbl">${config.label}</div>`;
        globalIdx++;
      }
      html += '</div>';
    }
    html += '</div>';
    if (config.showPageNum) html += `<div class="pnum">${p + 1} / ${numPages}</div>`;
    html += '</div>';
  }

  html += '</body></html>';
  return html;
}
