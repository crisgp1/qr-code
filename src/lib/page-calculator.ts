import type { AppConfig, PageSize } from '@/types/config';
import { PAGE_SIZES, PX_PER_INCH, CM_PER_INCH, PREVIEW_SCALE, PX_PER_CM } from './constants';

export interface PageDimensions {
  widthIn: number;
  heightIn: number;
  widthPx: number;
  heightPx: number;
}

export function getPageDimensions(config: AppConfig): PageDimensions {
  const size = config.pageSize as PageSize;
  const def = PAGE_SIZES[size] ?? PAGE_SIZES.letter;
  const widthIn = size === 'custom' ? config.customPageWidth : def.width;
  const heightIn = size === 'custom' ? config.customPageHeight : def.height;
  return {
    widthIn,
    heightIn,
    widthPx: widthIn * PX_PER_INCH,
    heightPx: heightIn * PX_PER_INCH,
  };
}

export function getPreviewDimensions(config: AppConfig) {
  const page = getPageDimensions(config);
  const pageW = page.widthIn * CM_PER_INCH * PX_PER_CM * PREVIEW_SCALE;
  const pageH = page.heightIn * CM_PER_INCH * PX_PER_CM * PREVIEW_SCALE;
  const marginPx = config.margin * PX_PER_CM * PREVIEW_SCALE;
  const spacingPx = config.spacing * PX_PER_CM * PREVIEW_SCALE;
  const codeSizePx = config.codeSize * PX_PER_CM * PREVIEW_SCALE;

  return { pageW, pageH, marginPx, spacingPx, codeSizePx };
}

export function getPerPage(config: AppConfig): number {
  return config.cols * config.rows;
}

export function getNumPages(config: AppConfig): number {
  const perPage = getPerPage(config);
  return Math.ceil(config.totalCodes / perPage);
}

export function getPagesData(config: AppConfig): number[] {
  const perPage = getPerPage(config);
  const numPages = getNumPages(config);
  const result: number[] = [];
  let remaining = config.totalCodes;
  for (let i = 0; i < numPages; i++) {
    result.push(Math.min(perPage, remaining));
    remaining -= perPage;
  }
  return result;
}
