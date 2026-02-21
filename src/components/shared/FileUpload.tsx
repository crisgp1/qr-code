'use client';

import { useRef, type ReactNode } from 'react';

interface FileUploadProps {
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function FileUpload({ accept, onChange, children, className = '', inputRef }: FileUploadProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? internalRef;

  return (
    <label className={`cursor-pointer ${className}`}>
      {children}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />
    </label>
  );
}
