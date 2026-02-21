'use client';

import { Modal } from '../shared';

interface QRPreviewScannerProps {
  open: boolean;
  onClose: () => void;
  content: string;
}

export function QRPreviewScanner({ open, onClose, content }: QRPreviewScannerProps) {
  return (
    <Modal open={open} onClose={onClose} title="QR Content">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 break-all text-sm text-[var(--text-primary)]">
        {content}
      </div>
    </Modal>
  );
}
