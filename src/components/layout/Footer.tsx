'use client';

import { useI18n } from '@/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <div className="px-4 py-3 border-t border-[var(--sidebar-border)] text-center">
      <div className="flex items-center justify-center gap-2">
        <p className="text-[11px] text-[var(--text-muted)]">
          {t.app.developedBy}{' '}
          <a
            href="https://cgarper.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            cgarper.dev
          </a>
        </p>
        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
          {t.app.free}
        </span>
      </div>
    </div>
  );
}
