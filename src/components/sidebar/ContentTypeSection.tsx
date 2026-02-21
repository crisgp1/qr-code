'use client';

import { useI18n } from '@/i18n';
import type { ContentType } from '@/types/config';
import { Field, Select } from '../shared';

interface ContentTypeSectionProps {
  contentType: ContentType;
  onChange: (type: ContentType) => void;
}

export function ContentTypeSection({ contentType, onChange }: ContentTypeSectionProps) {
  const { t } = useI18n();

  const options = [
    { label: t.contentType.url, value: 'url' },
    { label: t.contentType.text, value: 'text' },
    { label: t.contentType.email, value: 'email' },
    { label: t.contentType.phone, value: 'phone' },
    { label: t.contentType.sms, value: 'sms' },
    { label: t.contentType.wifi, value: 'wifi' },
    { label: t.contentType.vcard, value: 'vcard' },
  ];

  return (
    <Field label={t.contentType.title}>
      <Select
        value={contentType}
        options={options}
        onChange={(v) => onChange(v as ContentType)}
      />
    </Field>
  );
}
