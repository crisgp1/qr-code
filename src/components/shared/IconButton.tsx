'use client';

import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
}

export function IconButton({ children, label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
