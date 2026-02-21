'use client';

import { useState, type ReactNode } from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface SidebarSectionProps {
  icon: React.ElementType;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarSection({ icon: Icon, title, children, defaultOpen = true }: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pt-3 pb-1 w-full border-t border-gray-100 dark:border-gray-700 first:border-0 first:pt-0"
      >
        <Icon size={14} weight="bold" className="text-[var(--accent)]" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] flex-1 text-left">
          {title}
        </span>
        <CaretDown
          size={12}
          className={`text-[var(--text-muted)] transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="flex flex-col gap-2 pt-1">{children}</div>}
    </div>
  );
}
