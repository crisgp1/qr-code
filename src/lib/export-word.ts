import type { AppConfig, InterleaveState } from '@/types/config';
import { downloadBlob } from './utils';
import { buildPrintHTML } from './html-builder';

export function exportWord(
  config: AppConfig,
  codeDataURLs: string[],
  interleave: InterleaveState,
): void {
  const innerHTML = buildPrintHTML(config, codeDataURLs, interleave);
  const bodyContent = innerHTML
    .replace(/<!DOCTYPE html><html>[\s\S]*?<body>/, '')
    .replace(/<\/body><\/html>/, '');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8">
    <style>@page{size:8.5in 11in;margin:0}</style></head>
    <body>${bodyContent}</body></html>`;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const filename = config.outputFilename || 'QR_Template';
  downloadBlob(blob, `${filename}.doc`);
}
