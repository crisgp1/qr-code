'use client';

import { Lightning } from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import type { ContentConfig } from '@/types/config';
import { getAutoFillData } from '@/lib/autofill';
import { Field, TextInput, Select, Toggle } from '../shared';

interface ContentTypeFieldsProps {
  content: ContentConfig;
  onContentChange: (field: keyof ContentConfig, value: ContentConfig[keyof ContentConfig]) => void;
  onNestedChange: (parent: 'wifi' | 'vcard' | 'email' | 'sms', field: string, value: unknown) => void;
  onAutoFill?: (data: Partial<ContentConfig>) => void;
}

export function ContentTypeFields({ content, onContentChange, onNestedChange, onAutoFill }: ContentTypeFieldsProps) {
  const { t } = useI18n();

  const handleAutoFill = () => {
    const data = getAutoFillData(content.type);
    if (onAutoFill) onAutoFill(data);
  };

  const autoFillButton = (
    <button
      onClick={handleAutoFill}
      className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-md transition-colors"
    >
      <Lightning size={12} weight="bold" />
      {t.content.autoFill}
    </button>
  );

  switch (content.type) {
    case 'url':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.contentType.url}>
            <TextInput
              value={content.value}
              onChange={(v) => onContentChange('value', v)}
              placeholder={t.content.urlPlaceholder}
            />
          </Field>
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.contentType.text}>
            <TextInput
              value={content.value}
              onChange={(v) => onContentChange('value', v)}
              placeholder={t.content.textPlaceholder}
              multiline
            />
          </Field>
        </div>
      );

    case 'email':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.content.emailTo}>
            <TextInput value={content.email.to} onChange={(v) => onNestedChange('email', 'to', v)} placeholder="user@example.com" />
          </Field>
          <Field label={t.content.emailSubject}>
            <TextInput value={content.email.subject} onChange={(v) => onNestedChange('email', 'subject', v)} />
          </Field>
          <Field label={t.content.emailBody}>
            <TextInput value={content.email.body} onChange={(v) => onNestedChange('email', 'body', v)} multiline />
          </Field>
        </div>
      );

    case 'phone':
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.content.phoneNumber}>
            <TextInput value={content.phone} onChange={(v) => onContentChange('phone', v)} placeholder="+1234567890" />
          </Field>
        </div>
      );

    case 'sms':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.content.smsNumber}>
            <TextInput value={content.sms.number} onChange={(v) => onNestedChange('sms', 'number', v)} placeholder="+1234567890" />
          </Field>
          <Field label={t.content.smsBody}>
            <TextInput value={content.sms.body} onChange={(v) => onNestedChange('sms', 'body', v)} multiline />
          </Field>
        </div>
      );

    case 'wifi':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">{autoFillButton}</div>
          <Field label={t.content.wifiSSID}>
            <TextInput value={content.wifi.ssid} onChange={(v) => onNestedChange('wifi', 'ssid', v)} />
          </Field>
          <Field label={t.content.wifiPassword}>
            <TextInput value={content.wifi.password} onChange={(v) => onNestedChange('wifi', 'password', v)} />
          </Field>
          <Field label={t.content.wifiEncryption}>
            <Select
              value={content.wifi.encryption}
              options={[
                { label: 'WPA/WPA2', value: 'WPA' },
                { label: 'WEP', value: 'WEP' },
                { label: t.content.wifiEncNone, value: 'nopass' },
              ]}
              onChange={(v) => onNestedChange('wifi', 'encryption', v)}
            />
          </Field>
          <Toggle
            checked={content.wifi.hidden}
            onChange={(v) => onNestedChange('wifi', 'hidden', v)}
            label={t.content.wifiHidden}
          />
        </div>
      );

    case 'vcard':
      return (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">{autoFillButton}</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.content.vcardFirstName}>
              <TextInput value={content.vcard.firstName} onChange={(v) => onNestedChange('vcard', 'firstName', v)} />
            </Field>
            <Field label={t.content.vcardLastName}>
              <TextInput value={content.vcard.lastName} onChange={(v) => onNestedChange('vcard', 'lastName', v)} />
            </Field>
          </div>
          <Field label={t.content.vcardPhone}>
            <TextInput value={content.vcard.phone} onChange={(v) => onNestedChange('vcard', 'phone', v)} />
          </Field>
          <Field label={t.content.vcardEmail}>
            <TextInput value={content.vcard.email} onChange={(v) => onNestedChange('vcard', 'email', v)} />
          </Field>
          <Field label={t.content.vcardOrg}>
            <TextInput value={content.vcard.org} onChange={(v) => onNestedChange('vcard', 'org', v)} />
          </Field>
          <Field label={t.content.vcardTitle}>
            <TextInput value={content.vcard.title} onChange={(v) => onNestedChange('vcard', 'title', v)} />
          </Field>
          <Field label={t.content.vcardUrl}>
            <TextInput value={content.vcard.url} onChange={(v) => onNestedChange('vcard', 'url', v)} />
          </Field>
        </div>
      );

    default:
      return null;
  }
}
