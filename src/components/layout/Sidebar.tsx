'use client';

import {
  QrCode, Barcode, GridFour, ArrowsOutSimple, TextT, ImageSquare,
  Palette, Scissors, Shuffle, Layout, X, Warning,
} from '@phosphor-icons/react';
import { useI18n } from '@/i18n';
import { useConfig } from '@/hooks/useConfig';
import type { InterleaveState, InterleaveMode, AppConfig, CodeMode, ContentType, ContentConfig, BarcodeFormat, PageSize, ErrorCorrectionLevel, LabelPosition } from '@/types/config';
import type { Translations } from '@/types/i18n';
import type { CSVResult } from '@/lib/csv-parser';
import { getPerPage, getNumPages } from '@/lib/page-calculator';
import { validateBarcodeInput, getBarcodePlaceholder } from '@/lib/barcode-engine';
import { Field, TextInput } from '../shared';
import { SidebarSection } from './SidebarSection';
import { Footer } from './Footer';
import { ThemeToggle } from '../features/ThemeToggle';
import { LanguageToggle } from '../features/LanguageToggle';
import { SaveLoadControls } from '../features/SaveLoadControls';
import { CodeTypeSection } from '../sidebar/CodeTypeSection';
import { BarcodeFormatSection } from '../sidebar/BarcodeFormatSection';
import { ContentTypeSection } from '../sidebar/ContentTypeSection';
import { ContentTypeFields } from '../sidebar/ContentTypeFields';
import { LayoutSection } from '../sidebar/LayoutSection';
import { SizeSection } from '../sidebar/SizeSection';
import { TextSection } from '../sidebar/TextSection';
import { LogoSection } from '../sidebar/LogoSection';
import { ColorsSection } from '../sidebar/ColorsSection';
import { StyleSection } from '../sidebar/StyleSection';
import { InterleaveSection } from '../sidebar/InterleaveSection';
import { TemplateSection } from '../sidebar/TemplateSection';
import { ExportSection } from '../sidebar/ExportSection';

// --- Barcode error message resolver ---

const FORMAT_DIGITS: Record<string, number> = { EAN13: 12, UPC: 11 };

function formatBarcodeError(
  errorCode: string | null,
  t: Translations,
  format: BarcodeFormat,
): string | null {
  if (!errorCode) return null;

  if (errorCode === 'empty') return t.barcodeFormat.errEmpty;
  if (errorCode === 'digits_only') return t.barcodeFormat.errDigitsOnly;

  if (errorCode.startsWith('need_digits:')) {
    const n = errorCode.split(':')[1];
    const total = String(FORMAT_DIGITS[format] ?? '?');
    return t.barcodeFormat.errNeedDigits
      .replace('{n}', n)
      .replace('{total}', total);
  }

  if (errorCode.startsWith('too_long:')) {
    const max = errorCode.split(':')[1];
    return t.barcodeFormat.errTooLong.replace('{max}', max);
  }

  if (errorCode.startsWith('invalid_chars:')) {
    const chars = errorCode.split(':')[1];
    return t.barcodeFormat.errInvalidChars.replace('{chars}', chars);
  }

  return t.barcodeFormat.invalidInput;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  interleave: InterleaveState;
  onInterleaveMode: (mode: InterleaveMode) => void;
  onManualEntries: (text: string) => void;
  onCSVLoad: (text: string, fileName: string) => CSVResult;
  onCSVColumn: (csvText: string, col: number) => void;
  logoImg: HTMLImageElement | null;
  logoPreviewURL: string | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  pdfLoading: boolean;
  onPDF: () => void;
  onPNG: () => void;
  onSinglePNG: () => void;
  onSingleSVG: () => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  saveMessage: string | null;
}

export function Sidebar({
  open,
  onClose,
  theme,
  onThemeToggle,
  interleave,
  onInterleaveMode,
  onManualEntries,
  onCSVLoad,
  onCSVColumn,
  logoPreviewURL,
  fileRef,
  onLogoUpload,
  onLogoRemove,
  pdfLoading,
  onPDF,
  onPNG,
  onSinglePNG,
  onSingleSVG,
  onSave,
  onLoad,
  onReset,
  saveMessage,
}: SidebarProps) {
  const { t, lang, toggleLang } = useI18n();
  const { config, dispatch } = useConfig();
  const perPage = getPerPage(config);
  const numPages = getNumPages(config);

  const set = (field: keyof AppConfig, value: AppConfig[keyof AppConfig]) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[356px] bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col
          transform transition-transform duration-200 ease-out
          lg:relative lg:translate-x-0 no-print
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[var(--sidebar-bg)]/95 backdrop-blur-sm border-b border-[var(--sidebar-border)]/50 px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)]/10">
                  <QrCode size={24} weight="duotone" className="text-[var(--accent)]" />
                </div>
                <div>
                  <h1 className="text-[15px] font-bold leading-tight text-[var(--text-primary)]">
                    {t.app.title}
                  </h1>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{t.app.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                <LanguageToggle lang={lang} onToggle={toggleLang} />
                <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <X size={20} className="text-[var(--text-primary)]" />
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { value: config.totalCodes, label: t.stats.total },
                { value: perPage, label: t.stats.perSheet },
                { value: numPages, label: t.stats.sheets },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-2.5 rounded-lg bg-[var(--accent)]/[0.07]">
                  <div className="text-lg font-bold text-[var(--accent)] tabular-nums">{stat.value}</div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="px-4 py-4 flex flex-col gap-3">
            {/* Save/Load — small utility row */}
            <SaveLoadControls onSave={onSave} onLoad={onLoad} onReset={onReset} message={saveMessage} />

            {/* ── Code type ── */}
            <CodeTypeSection
              codeMode={config.codeMode}
              onChange={(mode: CodeMode) => set('codeMode', mode)}
            />

            {/* ── Barcode format ── */}
            {config.codeMode === 'barcode' && (
              <BarcodeFormatSection
                format={config.barcodeFormat}
                onChange={(f: BarcodeFormat) => set('barcodeFormat', f)}
              />
            )}

            {/* ── Content ── */}
            {config.codeMode === 'qr' && (
              <SidebarSection icon={QrCode} title={t.contentType.title}>
                <ContentTypeSection
                  contentType={config.content.type}
                  onChange={(type: ContentType) => dispatch({ type: 'SET_CONTENT_FIELD', field: 'type', value: type })}
                />
                <ContentTypeFields
                  content={config.content}
                  onContentChange={(field, value) => dispatch({ type: 'SET_CONTENT_FIELD', field, value })}
                  onNestedChange={(parent, field, value) =>
                    dispatch({ type: 'SET_CONTENT_NESTED', parent, field, value })
                  }
                  onAutoFill={(data: Partial<ContentConfig>) => {
                    Object.entries(data).forEach(([key, val]) => {
                      if (key === 'wifi' || key === 'vcard' || key === 'email' || key === 'sms') {
                        const nested = val as unknown as Record<string, unknown>;
                        Object.entries(nested).forEach(([field, value]) => {
                          dispatch({ type: 'SET_CONTENT_NESTED', parent: key, field, value });
                        });
                      } else {
                        dispatch({ type: 'SET_CONTENT_FIELD', field: key as keyof ContentConfig, value: val as ContentConfig[keyof ContentConfig] });
                      }
                    });
                  }}
                />
              </SidebarSection>
            )}

            {config.codeMode === 'barcode' && (() => {
              const validation = validateBarcodeInput(config.barcodeContent, config.barcodeFormat);
              const placeholder = getBarcodePlaceholder(config.barcodeFormat);
              const errMsg = !validation.valid && config.barcodeContent.length > 0
                ? formatBarcodeError(validation.errorCode, t, config.barcodeFormat)
                : null;
              return (
                <SidebarSection icon={Barcode} title={t.content.title}>
                  <Field label={t.content.title}>
                    <TextInput
                      value={config.barcodeContent}
                      onChange={(v) => set('barcodeContent', v)}
                      placeholder={placeholder}
                    />
                  </Field>
                  {errMsg && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                      <Warning size={14} weight="bold" className="text-red-500 mt-0.5 shrink-0" />
                      <span className="text-[12px] text-red-600 dark:text-red-400 leading-snug">{errMsg}</span>
                    </div>
                  )}
                </SidebarSection>
              );
            })()}

            {/* ── Layout & Size ── */}
            <SidebarSection icon={GridFour} title={t.layout.title}>
              <LayoutSection
                totalCodes={config.totalCodes}
                cols={config.cols}
                rows={config.rows}
                onTotalChange={(v) => set('totalCodes', v)}
                onColsChange={(v) => set('cols', v)}
                onRowsChange={(v) => set('rows', v)}
              />
            </SidebarSection>

            <SidebarSection icon={ArrowsOutSimple} title={t.size.title}>
              <SizeSection
                codeMode={config.codeMode}
                codeSize={config.codeSize}
                margin={config.margin}
                spacing={config.spacing}
                pageSize={config.pageSize}
                customWidth={config.customPageWidth}
                customHeight={config.customPageHeight}
                onCodeSizeChange={(v) => set('codeSize', v)}
                onMarginChange={(v) => set('margin', v)}
                onSpacingChange={(v) => set('spacing', v)}
                onPageSizeChange={(v: PageSize) => set('pageSize', v)}
                onCustomWidthChange={(v) => set('customPageWidth', v)}
                onCustomHeightChange={(v) => set('customPageHeight', v)}
              />
            </SidebarSection>

            {/* ── Appearance ── */}
            <SidebarSection icon={TextT} title={t.text.title} defaultOpen={false}>
              <TextSection
                label={config.label}
                labelPosition={config.labelPosition}
                pageTitle={config.pageTitle}
                titleSize={config.titleSize}
                labelSize={config.labelSize}
                fontFamily={config.fontFamily}
                onLabelChange={(v) => set('label', v)}
                onLabelPositionChange={(v: LabelPosition) => set('labelPosition', v)}
                onPageTitleChange={(v) => set('pageTitle', v)}
                onTitleSizeChange={(v) => set('titleSize', v)}
                onLabelSizeChange={(v) => set('labelSize', v)}
                onFontChange={(v) => set('fontFamily', v)}
              />
            </SidebarSection>

            {config.codeMode === 'qr' && (
              <SidebarSection icon={ImageSquare} title={t.logo.title} defaultOpen={false}>
                <LogoSection
                  logoPreviewURL={logoPreviewURL}
                  logoSize={config.logoSize}
                  logoBgWhite={config.logoBgWhite}
                  fileRef={fileRef}
                  onUpload={onLogoUpload}
                  onRemove={onLogoRemove}
                  onSizeChange={(v) => set('logoSize', v)}
                  onBgChange={(v) => set('logoBgWhite', v)}
                />
              </SidebarSection>
            )}

            <SidebarSection icon={Palette} title={t.colors.title} defaultOpen={false}>
              <ColorsSection
                codeColor={config.codeColor}
                codeBg={config.codeBg}
                pageBg={config.pageBg}
                transparentBg={config.transparentBg}
                onCodeColorChange={(v) => set('codeColor', v)}
                onCodeBgChange={(v) => set('codeBg', v)}
                onPageBgChange={(v) => set('pageBg', v)}
                onTransparentBgChange={(v) => set('transparentBg', v)}
              />
            </SidebarSection>

            <SidebarSection icon={Scissors} title={t.style.title} defaultOpen={false}>
              <StyleSection
                codeMode={config.codeMode}
                cutLines={config.cutLines}
                showPageNum={config.showPageNum}
                roundness={config.roundness}
                errorCorrection={config.errorCorrection}
                onCutLinesChange={(v) => set('cutLines', v)}
                onShowPageNumChange={(v) => set('showPageNum', v)}
                onRoundnessChange={(v) => set('roundness', v)}
                onErrorCorrectionChange={(v: ErrorCorrectionLevel) => set('errorCorrection', v)}
              />
            </SidebarSection>

            {/* ── Advanced ── */}
            <SidebarSection icon={Shuffle} title={t.interleave.title} defaultOpen={false}>
              <InterleaveSection
                interleave={interleave}
                onModeChange={onInterleaveMode}
                onManualChange={onManualEntries}
                onCSVLoad={onCSVLoad}
                onCSVColumnChange={onCSVColumn}
              />
            </SidebarSection>

            <SidebarSection icon={Layout} title={t.templates.title} defaultOpen={false}>
              <TemplateSection
                currentTemplateId={config.templateId}
                onApply={(cfg, id) => {
                  dispatch({ type: 'APPLY_TEMPLATE', config: { ...cfg, templateId: id } });
                }}
              />
            </SidebarSection>
          </div>
        </div>

        {/* Export buttons - sticky bottom */}
        <div className="px-4 py-4 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
          <ExportSection
            pdfLoading={pdfLoading}
            outputFilename={config.outputFilename}
            onFilenameChange={(v) => set('outputFilename', v)}
            onPDF={onPDF}
            onPNG={onPNG}
            onSinglePNG={onSinglePNG}
            onSingleSVG={onSingleSVG}
          />
        </div>

        <Footer />
      </aside>
    </>
  );
}
