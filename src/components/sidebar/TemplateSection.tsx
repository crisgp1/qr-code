'use client';

import { useI18n } from '@/i18n';
import { templates } from '@/types/templates';
import type { AppConfig } from '@/types/config';
import type { Translations } from '@/types/i18n';

interface TemplateSectionProps {
  currentTemplateId: string;
  onApply: (config: Partial<AppConfig>, id: string) => void;
}

function getTranslated(t: Translations, key: string): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = t;
  for (const p of parts) {
    obj = obj?.[p];
  }
  return typeof obj === 'string' ? obj : key;
}

export function TemplateSection({ currentTemplateId, onApply }: TemplateSectionProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      {templates.map((tmpl) => {
        const selected = currentTemplateId === tmpl.id;
        return (
          <button
            key={tmpl.id}
            onClick={() => onApply(tmpl.config, tmpl.id)}
            className={`text-left px-3.5 py-3 rounded-lg text-sm transition-all ${
              selected
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-gray-50 dark:bg-gray-700/50 text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className="font-semibold">{getTranslated(t, tmpl.labelKey)}</div>
            <div className={`text-[11.5px] mt-0.5 ${selected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
              {getTranslated(t, tmpl.descriptionKey)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
