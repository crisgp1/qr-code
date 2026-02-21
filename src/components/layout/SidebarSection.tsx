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
    <div className="rounded-xl bg-[var(--input-bg)]/60 dark:bg-white/[0.03] border border-[var(--sidebar-border)]/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-3.5 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors rounded-xl"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)]/10">
          <Icon size={15} weight="bold" className="text-[var(--accent)]" />
        </div>
        <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex-1 text-left">
          {title}
        </span>
        <CaretDown
          size={14}
          className={`text-[var(--text-muted)] transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 px-3.5 pb-3.5 pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
