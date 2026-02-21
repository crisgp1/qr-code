'use client';

import { useI18n } from '@/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <div className="px-5 py-3 border-t border-[var(--sidebar-border)] text-center">
      <p className="text-[10px] text-[var(--text-muted)]">
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
      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
        {t.app.free}
      </span>
    </div>
  );
}
