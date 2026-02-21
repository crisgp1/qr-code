'use client';

import { FilePdf, FileImage, Download, FileZip } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { Button, Spinner, Field, TextInput } from '../shared';

interface ExportSectionProps {
  pdfLoading: boolean;
  outputFilename: string;
  onFilenameChange: (v: string) => void;
  onPDF: () => void;
  onPNG: () => void;
  onSinglePNG: () => void;
  onSingleSVG: () => void;
  onZIP: () => void;
  zipLoading: boolean;
  zipProgress: string | null;
}

export function ExportSection({
  pdfLoading,
  outputFilename,
  onFilenameChange,
  onPDF,
  onPNG,
  onSinglePNG,
  onSingleSVG,
  onZIP,
  zipLoading,
  zipProgress,
}: ExportSectionProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2.5">
      <Field label={t.export.filename}>
        <TextInput
          value={outputFilename}
          onChange={onFilenameChange}
          placeholder="QR_Template"
        />
      </Field>
      <Button
        variant="danger"
        onClick={onPDF}
        disabled={pdfLoading}
        icon={pdfLoading ? <Spinner size={16} /> : <FilePdf size={16} weight="bold" />}
        className="w-full"
      >
        {t.export.pdf}
      </Button>
      <Button
        variant="primary"
        onClick={onZIP}
        disabled={zipLoading}
        icon={zipLoading ? <Spinner size={16} /> : <FileZip size={16} weight="bold" />}
        className="w-full !bg-emerald-600 hover:!bg-emerald-700"
      >
        {zipLoading && zipProgress ? zipProgress : t.export.zip}
      </Button>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="warning" onClick={onPNG} icon={<FileImage size={16} weight="bold" />}>
          {t.export.png}
        </Button>
        <Button variant="secondary" onClick={onSinglePNG} icon={<Download size={16} weight="bold" />}>
          PNG
        </Button>
        <Button variant="secondary" onClick={onSingleSVG} icon={<Download size={16} weight="bold" />}>
          SVG
        </Button>
      </div>
    </div>
  );
}
