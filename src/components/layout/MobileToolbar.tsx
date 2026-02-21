'use client';

import { List, QrCode, Download } from '@phosphor-icons/react';
import { Spinner } from '../shared';

interface MobileToolbarProps {
  onOpenSidebar: () => void;
  onPDF: () => void;
  pdfLoading: boolean;
}

export function MobileToolbar({ onOpenSidebar, onPDF, pdfLoading }: MobileToolbarProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--sidebar-bg)]/80 backdrop-blur border-b border-[var(--sidebar-border)] lg:hidden no-print">
      <button onClick={onOpenSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <List size={22} className="text-[var(--text-primary)]" />
      </button>
      <div className="flex items-center gap-1.5">
        <QrCode size={20} weight="duotone" className="text-[var(--accent)]" />
        <span className="font-bold text-sm text-[var(--text-primary)]">QR & Barcode</span>
      </div>
      <button onClick={onPDF} disabled={pdfLoading} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
        {pdfLoading ? <Spinner size={20} /> : <Download size={20} weight="bold" />}
      </button>
    </div>
  );
}
