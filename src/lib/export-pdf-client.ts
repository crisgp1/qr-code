import { jsPDF } from 'jspdf';
import type { AppConfig, InterleaveState } from '@/types/config';
import { getPageDimensions, getPerPage, getNumPages } from './page-calculator';

/**
 * Client-side PDF export using jsPDF.
 *
 * Draws the exact same grid layout as the preview — QR/barcode images,
 * labels, titles, cut lines, page numbers — directly into a vector PDF.
 * No Puppeteer or server dependency required.
 */
export async function exportPDFClient(
  config: AppConfig,
  codeDataURLs: string[],
  interleave: InterleaveState,
): Promise<void> {
  const { widthIn, heightIn } = getPageDimensions(config);
  const perPage = getPerPage(config);
  const numPages = getNumPages(config);

  const orientation = widthIn > heightIn ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'in',
    format: [widthIn, heightIn],
  });

  // Convert config units (cm) to inches
  const marginIn = config.margin / 2.54;
  const spacingIn = config.spacing / 2.54;
  const codeSizeIn = config.codeSize / 2.54;

  // Title metrics (approximate: 1pt ≈ 1/72 in)
  const hasTitleText = !!config.pageTitle;
  const titleHeightIn = hasTitleText ? (config.titleSize / 72) * 2 : 0;
  const hasPageNum = config.showPageNum;
  const pageNumHeightIn = hasPageNum ? 0.25 : 0;

  // Available grid area
  const gridLeft = marginIn;
  const gridTop = marginIn + titleHeightIn;
  const gridWidth = widthIn - marginIn * 2;
  const gridHeight = heightIn - marginIn * 2 - titleHeightIn - pageNumHeightIn;

  // Cell dimensions
  const cellW = (gridWidth - spacingIn * (config.cols - 1)) / config.cols;
  const cellH = (gridHeight - spacingIn * (config.rows - 1)) / config.rows;

  // Label space
  const hasLabel = !!config.label;
  const labelHeightIn = hasLabel ? (config.labelSize / 72) * 1.8 : 0;

  // Image size — fit within cell leaving room for label
  const isBarcode = config.codeMode === 'barcode';
  const maxImgW = cellW * 0.92;
  const maxImgH = (cellH - labelHeightIn) * 0.92;
  const imgSizeW = Math.min(codeSizeIn, maxImgW);
  const imgSizeH = isBarcode ? imgSizeW * 0.5 : Math.min(codeSizeIn, maxImgH, imgSizeW);

  let remaining = config.totalCodes;
  let globalIndex = 0;

  for (let page = 0; page < numPages; page++) {
    if (page > 0) pdf.addPage([widthIn, heightIn], orientation);

    // Page background
    pdf.setFillColor(config.pageBg);
    pdf.rect(0, 0, widthIn, heightIn, 'F');

    // Title
    if (hasTitleText) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(config.titleSize);
      pdf.setTextColor('#000000');
      pdf.text(config.pageTitle, widthIn / 2, marginIn + titleHeightIn * 0.6, {
        align: 'center',
      });
    }

    const codesOnPage = Math.min(perPage, remaining);
    remaining -= codesOnPage;

    for (let i = 0; i < perPage; i++) {
      const col = i % config.cols;
      const row = Math.floor(i / config.cols);
      const cellX = gridLeft + col * (cellW + spacingIn);
      const cellY = gridTop + row * (cellH + spacingIn);

      // Cut lines
      if (config.cutLines) {
        pdf.setDrawColor('#cccccc');
        pdf.setLineDashPattern([0.04, 0.04], 0);
        pdf.setLineWidth(0.005);
        pdf.rect(cellX, cellY, cellW, cellH);
      }

      if (i >= codesOnPage) continue;

      // Determine data URL
      const dataURL =
        codeDataURLs.length > 1
          ? codeDataURLs[globalIndex] ?? null
          : codeDataURLs[0] ?? null;
      globalIndex++;

      if (!dataURL) continue;

      // Center image in cell (above label)
      const availH = cellH - labelHeightIn;
      const imgX = cellX + (cellW - imgSizeW) / 2;
      const imgY = cellY + (availH - imgSizeH) / 2;

      try {
        pdf.addImage(dataURL, 'PNG', imgX, imgY, imgSizeW, imgSizeH);
      } catch {
        // skip unrenderable images
      }

      // Label
      if (hasLabel) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(config.labelSize);
        pdf.setTextColor('#333333');
        pdf.text(config.label, cellX + cellW / 2, cellY + availH + labelHeightIn * 0.65, {
          align: 'center',
        });
      }
    }

    // Page number
    if (hasPageNum) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor('#999999');
      pdf.text(
        `${page + 1} / ${numPages}`,
        widthIn / 2,
        heightIn - marginIn * 0.3,
        { align: 'center' },
      );
    }

    // Reset dash pattern for next page
    pdf.setLineDashPattern([], 0);
  }

  pdf.save('QR_Template.pdf');
}
