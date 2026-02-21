'use client';

import { CircleNotch } from '@phosphor-icons/react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = '' }: SpinnerProps) {
  return <CircleNotch size={size} className={`animate-spin ${className}`} />;
}
