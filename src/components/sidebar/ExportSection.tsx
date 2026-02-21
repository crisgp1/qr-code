'use client';

import { FilePdf, FileDoc, FileImage, Download } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { Button, Spinner } from '../shared';

interface ExportSectionProps {
  pdfLoading: boolean;
  onPDF: () => void;
  onWord: () => void;
  onPNG: () => void;
  onSinglePNG: () => void;
  onSingleSVG: () => void;
}

export function ExportSection({
  pdfLoading,
  onPDF,
  onWord,
  onPNG,
  onSinglePNG,
  onSingleSVG,
}: ExportSectionProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="danger"
          onClick={onPDF}
          disabled={pdfLoading}
          icon={pdfLoading ? <Spinner size={16} /> : <FilePdf size={16} weight="bold" />}
        >
          {t.export.pdf}
        </Button>
        <Button variant="primary" onClick={onWord} icon={<FileDoc size={16} weight="bold" />} className="!bg-blue-600 hover:!bg-blue-700">
          {t.export.word}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="warning" onClick={onPNG} icon={<FileImage size={16} weight="bold" />}>
          {t.export.png}
        </Button>
        <Button variant="secondary" onClick={onSinglePNG} icon={<Download size={16} weight="bold" />}>
          {t.export.singlePNG}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Button variant="secondary" onClick={onSingleSVG} icon={<Download size={16} weight="bold" />}>
          {t.export.singleSVG}
        </Button>
      </div>
    </div>
  );
}
