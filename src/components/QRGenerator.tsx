'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  QrCode, GridFour, ArrowsOutSimple, TextT, ImageSquare,
  Palette, Printer, FilePdf, FileDoc, FileImage,
  UploadSimple, Trash, List, X, Scissors, Hash,
  Warning, CircleNotch, SquareHalf, Download,
} from '@phosphor-icons/react';

interface Config {
  content: string;
  totalQR: number;
  cols: number;
  rows: number;
  qrSize: number;
  margin: number;
  spacing: number;
  label: string;
  pageTitle: string;
  titleSize: number;
  labelSize: number;
  fontFamily: string;
  qrColor: string;
  qrBg: string;
  pageBg: string;
  cutLines: boolean;
  showPageNum: boolean;
  roundedQR: boolean;
  logoSize: number;
  logoBgWhite: boolean;
}

const defaults: Config = {
  content: 'https://ejemplo.com',
  totalQR: 24,
  cols: 3,
  rows: 4,
  qrSize: 4,
  margin: 1.5,
  spacing: 0,
  label: 'Escanea aquí',
  pageTitle: '',
  titleSize: 18,
  labelSize: 9,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  qrColor: '#000000',
  qrBg: '#ffffff',
  pageBg: '#ffffff',
  cutLines: true,
  showPageNum: false,
  roundedQR: false,
  logoSize: 25,
  logoBgWhite: true,
};

const fonts = [
  { label: 'Sans-serif', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: "'Courier New', monospace" },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

// --- Helpers ---

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildPrintHTML(c: Config, qrDataURL: string): string {
  const perPage = c.cols * c.rows;
  const numPages = Math.ceil(c.totalQR / perPage);

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
@page{size:letter;margin:0}
body{font-family:${c.fontFamily}}
.page{width:8.5in;height:11in;padding:${c.margin}cm;background:${c.pageBg};position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:avoid}
.title{text-align:center;font-weight:700;font-size:${c.titleSize}pt;margin-bottom:8px}
.grid{display:grid;grid-template-columns:repeat(${c.cols},1fr);grid-template-rows:repeat(${c.rows},1fr);gap:${c.spacing}cm;height:calc(100% ${c.pageTitle ? `- ${c.titleSize * 1.5}pt - 8px` : ''} ${c.showPageNum ? '- 20px' : ''})}
.cell{display:flex;flex-direction:column;align-items:center;justify-content:center;${c.cutLines ? 'border:1px dashed #ccc;' : ''}}
.cell img{width:${c.qrSize}cm;height:${c.qrSize}cm;image-rendering:pixelated;${c.roundedQR ? `border-radius:${c.qrSize * 0.08}cm` : ''}}
.lbl{font-size:${c.labelSize}pt;color:#333;margin-top:3px;text-align:center}
.pnum{position:absolute;bottom:${c.margin * 0.3}cm;width:100%;text-align:center;font-size:9pt;color:#999}
</style></head><body>`;

  let idx = 0;
  for (let p = 0; p < numPages; p++) {
    const count = Math.min(perPage, c.totalQR - idx);
    html += '<div class="page">';
    if (c.pageTitle) html += `<div class="title">${c.pageTitle}</div>`;
    html += '<div class="grid">';
    for (let i = 0; i < perPage; i++) {
      html += '<div class="cell">';
      if (i < count) {
        html += `<img src="${qrDataURL}"/>`;
        if (c.label) html += `<div class="lbl">${c.label}</div>`;
        idx++;
      }
      html += '</div>';
    }
    html += '</div>';
    if (c.showPageNum) html += `<div class="pnum">Página ${p + 1} de ${numPages}</div>`;
    html += '</div>';
  }

  html += '</body></html>';
  return html;
}

// --- Section header ---

function Section({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-3 pb-1 border-t border-gray-100 first:border-0 first:pt-0">
      <Icon size={14} weight="bold" className="text-indigo-500" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">{title}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  );
}

// =====================
// MAIN COMPONENT
// =====================

export default function QRGenerator() {
  const [c, setC] = useState<Config>(defaults);
  const [sidebar, setSidebar] = useState(false);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoPreviewURL, setLogoPreviewURL] = useState<string | null>(null);
  const [qrDataURL, setQrDataURL] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof Config>(key: K, val: Config[K]) => {
    setC(prev => ({ ...prev, [key]: val }));
  }, []);

  const perPage = c.cols * c.rows;
  const numPages = Math.ceil(c.totalQR / perPage);

  // --- QR generation ---

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.content, c.qrColor, c.qrBg, c.logoSize, c.logoBgWhite, logoImg]);

  const generateQR = useCallback(async () => {
    const content = c.content.trim();
    if (!content) return;
    try {
      const canvas = document.createElement('canvas');
      const size = 800;
      await QRCode.toCanvas(canvas, content, {
        width: size,
        errorCorrectionLevel: 'H',
        color: { dark: c.qrColor, light: c.qrBg },
        margin: 1,
      });

      if (logoImg) {
        const ctx = canvas.getContext('2d')!;
        const pct = c.logoSize / 100;
        const logoW = size * pct;
        const logoH = size * pct;
        const cx = size / 2;
        const cy = size / 2;

        if (c.logoBgWhite) {
          const pad = logoW * 0.12;
          ctx.fillStyle = c.qrBg;
          roundRect(ctx, cx - logoW / 2 - pad, cy - logoH / 2 - pad, logoW + pad * 2, logoH + pad * 2, pad);
          ctx.fill();
        }

        const ratio = logoImg.width / logoImg.height;
        let dw = logoW, dh = logoH;
        if (ratio > 1) dh = logoW / ratio;
        else dw = logoH * ratio;
        ctx.drawImage(logoImg, cx - dw / 2, cy - dh / 2, dw, dh);
      }

      setQrDataURL(canvas.toDataURL('image/png'));
    } catch {
      /* ignore invalid content */
    }
  }, [c.content, c.qrColor, c.qrBg, c.logoSize, c.logoBgWhite, logoImg]);

  // --- Logo handling ---

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setLogoPreviewURL(url);
      const img = new Image();
      img.onload = () => setLogoImg(img);
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoImg(null);
    setLogoPreviewURL(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // --- Exports ---

  const exportPDF = async () => {
    if (!qrDataURL) return;
    setPdfLoading(true);
    try {
      const html = buildPrintHTML(c, qrDataURL);
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      downloadBlob(blob, 'QR_Plantilla.pdf');
    } catch (err) {
      alert('Error generando PDF. Usa "Imprimir" y selecciona "Guardar como PDF".');
    } finally {
      setPdfLoading(false);
    }
  };

  const exportWord = () => {
    if (!qrDataURL) return;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8">
      <style>@page{size:8.5in 11in;margin:0}</style></head>
      <body>${buildPrintHTML(c, qrDataURL).replace(/<!DOCTYPE html><html>[\s\S]*?<body>/, '').replace(/<\/body><\/html>/, '')}</body></html>`;
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    downloadBlob(blob, 'QR_Plantilla.doc');
  };

  const exportPNG = () => {
    if (!qrDataURL) return;
    const pages = document.querySelectorAll('.page-preview');
    if (!pages.length) return;

    pages.forEach((page, idx) => {
      const el = page as HTMLElement;
      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = el.offsetWidth * scale;
      canvas.height = el.offsetHeight * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.fillStyle = c.pageBg;
      ctx.fillRect(0, 0, el.offsetWidth, el.offsetHeight);

      const pageRect = el.getBoundingClientRect();
      const imgs = el.querySelectorAll('img');
      const lbls = el.querySelectorAll('.qr-lbl');
      const cells = el.querySelectorAll('.qr-cell-preview');

      // Title
      const titleEl = el.querySelector('.page-title-el') as HTMLElement;
      if (titleEl?.textContent) {
        ctx.font = `bold ${parseFloat(getComputedStyle(titleEl).fontSize)}px sans-serif`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(titleEl.textContent, el.offsetWidth / 2,
          titleEl.getBoundingClientRect().top - pageRect.top + parseFloat(getComputedStyle(titleEl).fontSize));
      }

      imgs.forEach((img, i) => {
        const r = img.getBoundingClientRect();
        ctx.drawImage(img, r.left - pageRect.left, r.top - pageRect.top, r.width, r.height);
      });

      if (c.cutLines) {
        ctx.strokeStyle = '#ccc';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 0.5;
        cells.forEach(cell => {
          const r = cell.getBoundingClientRect();
          ctx.strokeRect(r.left - pageRect.left, r.top - pageRect.top, r.width, r.height);
        });
      }

      lbls.forEach(lbl => {
        const el2 = lbl as HTMLElement;
        if (!el2.textContent) return;
        const r = el2.getBoundingClientRect();
        ctx.font = `${parseFloat(getComputedStyle(el2).fontSize)}px sans-serif`;
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(el2.textContent, r.left - pageRect.left + r.width / 2,
          r.top - pageRect.top + parseFloat(getComputedStyle(el2).fontSize));
      });

      canvas.toBlob(blob => {
        if (blob) downloadBlob(blob, `QR_Hoja_${idx + 1}.png`);
      }, 'image/png');
    });
  };

  // --- Preview scale ---

  const SCALE = 0.75;
  const CM = 37.795;
  const pageW = 8.5 * 2.54 * CM * SCALE;
  const pageH = 11 * 2.54 * CM * SCALE;
  const marginPx = c.margin * CM * SCALE;
  const spacingPx = c.spacing * CM * SCALE;
  const qrSizePx = c.qrSize * CM * SCALE;

  // --- Logo warning ---

  const logoWarning = useMemo(() => {
    if (!logoImg) return null;
    if (c.logoSize >= 28) return { text: 'Límite. Puede fallar en algunos lectores.', color: 'text-red-600' };
    if (c.logoSize >= 25) return { text: 'Máximo seguro (nivel H = 30% corrección).', color: 'text-orange-600' };
    return null;
  }, [c.logoSize, logoImg]);

  // --- Pages data ---

  const pages = useMemo(() => {
    const result: number[] = [];
    let remaining = c.totalQR;
    for (let i = 0; i < numPages; i++) {
      result.push(Math.min(perPage, remaining));
      remaining -= perPage;
    }
    return result;
  }, [c.totalQR, numPages, perPage]);

  // --- Input classes ---

  const inputCls = 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors';
  const btnCls = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.97]';

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Mobile overlay */}
      {sidebar && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebar(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[330px] bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-out
        lg:relative lg:translate-x-0 no-print
        ${sidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <QrCode size={28} weight="duotone" className="text-indigo-600" />
              <div>
                <h1 className="text-lg font-bold leading-tight">Generador QR</h1>
                <p className="text-[11px] text-gray-400">Plantillas para imprimir</p>
              </div>
            </div>
            <button onClick={() => setSidebar(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 bg-indigo-50 rounded-xl p-3">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{c.totalQR}</div>
              <div className="text-[10px] text-gray-500 uppercase">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{perPage}</div>
              <div className="text-[10px] text-gray-500 uppercase">Por hoja</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{numPages}</div>
              <div className="text-[10px] text-gray-500 uppercase">Hojas</div>
            </div>
          </div>

          {/* Content */}
          <Field label="Contenido del QR">
            <textarea
              className={inputCls + ' min-h-[56px] resize-y'}
              value={c.content}
              onChange={e => set('content', e.target.value)}
              placeholder="URL, texto, código..."
            />
          </Field>

          {/* Quantity */}
          <Section icon={GridFour} title="Cantidad y distribución" />
          <div className="grid grid-cols-3 gap-2">
            <Field label="Total QR">
              <input type="number" className={inputCls} value={c.totalQR} min={1} max={500}
                onChange={e => set('totalQR', Math.max(1, +e.target.value))} />
            </Field>
            <Field label="Columnas">
              <input type="number" className={inputCls} value={c.cols} min={1} max={8}
                onChange={e => set('cols', Math.max(1, +e.target.value))} />
            </Field>
            <Field label="Filas">
              <input type="number" className={inputCls} value={c.rows} min={1} max={10}
                onChange={e => set('rows', Math.max(1, +e.target.value))} />
            </Field>
          </div>

          {/* Size */}
          <Section icon={ArrowsOutSimple} title="Tamaño y espaciado" />
          <Field label={`Tamaño QR — ${c.qrSize.toFixed(1)} cm`}>
            <input type="range" className="w-full" min={1} max={8} step={0.1}
              value={c.qrSize} onChange={e => set('qrSize', +e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Margen (cm)">
              <input type="number" className={inputCls} value={c.margin} min={0} max={5} step={0.1}
                onChange={e => set('margin', +e.target.value)} />
            </Field>
            <Field label="Espacio entre QR (cm)">
              <input type="number" className={inputCls} value={c.spacing} min={0} max={3} step={0.1}
                onChange={e => set('spacing', +e.target.value)} />
            </Field>
          </div>

          {/* Text */}
          <Section icon={TextT} title="Texto" />
          <Field label="Texto bajo cada QR">
            <input type="text" className={inputCls} value={c.label}
              onChange={e => set('label', e.target.value)} placeholder="Dejar vacío para ocultar" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Título de la hoja">
              <input type="text" className={inputCls} value={c.pageTitle}
                onChange={e => set('pageTitle', e.target.value)} placeholder="Opcional" />
            </Field>
            <Field label="Tamaño título">
              <input type="number" className={inputCls} value={c.titleSize} min={10} max={36}
                onChange={e => set('titleSize', +e.target.value)} />
            </Field>
          </div>
          <Field label={`Tamaño texto QR — ${c.labelSize}px`}>
            <input type="range" className="w-full" min={6} max={16} step={0.5}
              value={c.labelSize} onChange={e => set('labelSize', +e.target.value)} />
          </Field>
          <Field label="Fuente">
            <select className={inputCls} value={c.fontFamily} onChange={e => set('fontFamily', e.target.value)}>
              {fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </Field>

          {/* Logo */}
          <Section icon={ImageSquare} title="Logo en el QR" />
          <div className="flex gap-2">
            <label className={`${btnCls} flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer`}>
              <UploadSimple size={16} weight="bold" />
              {logoPreviewURL ? 'Cambiar' : 'Subir imagen'}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
            {logoPreviewURL && (
              <button onClick={removeLogo} className={`${btnCls} bg-red-50 text-red-500 hover:bg-red-100`}>
                <Trash size={16} weight="bold" />
              </button>
            )}
          </div>
          {logoPreviewURL && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoPreviewURL} alt="Logo" className="h-10 rounded border border-gray-200" />
              <div className="flex-1">
                <Field label={`Tamaño — ${c.logoSize}%`}>
                  <input type="range" className="w-full" min={10} max={30} step={1}
                    value={c.logoSize} onChange={e => set('logoSize', +e.target.value)} />
                </Field>
                {logoWarning && (
                  <div className={`flex items-center gap-1 mt-1 text-[10px] ${logoWarning.color}`}>
                    <Warning size={12} weight="bold" />
                    {logoWarning.text}
                  </div>
                )}
              </div>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-indigo-600 rounded"
              checked={c.logoBgWhite} onChange={e => set('logoBgWhite', e.target.checked)} />
            <span className="text-xs text-gray-600">Fondo blanco detrás del logo</span>
          </label>

          {/* Colors */}
          <Section icon={Palette} title="Colores" />
          <div className="grid grid-cols-3 gap-2">
            <Field label="QR">
              <input type="color" className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                value={c.qrColor} onChange={e => set('qrColor', e.target.value)} />
            </Field>
            <Field label="Fondo QR">
              <input type="color" className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                value={c.qrBg} onChange={e => set('qrBg', e.target.value)} />
            </Field>
            <Field label="Fondo hoja">
              <input type="color" className="w-full h-9 rounded-lg border border-gray-200 cursor-pointer"
                value={c.pageBg} onChange={e => set('pageBg', e.target.value)} />
            </Field>
          </div>

          {/* Options */}
          <Section icon={Scissors} title="Opciones" />
          {[
            { key: 'cutLines' as const, label: 'Líneas de corte', icon: Scissors },
            { key: 'showPageNum' as const, label: 'Número de página', icon: Hash },
            { key: 'roundedQR' as const, label: 'QR redondeado', icon: SquareHalf },
          ].map(({ key, label, icon: Icon }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600 rounded"
                checked={c[key]} onChange={e => set(key, e.target.checked)} />
              <Icon size={15} className="text-gray-400" />
              <span className="text-xs text-gray-600">{label}</span>
            </label>
          ))}
        </div>

        {/* Export buttons - sticky */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => window.print()} className={`${btnCls} bg-indigo-600 text-white hover:bg-indigo-700`}>
              <Printer size={16} weight="bold" /> Imprimir
            </button>
            <button onClick={exportPDF} disabled={pdfLoading}
              className={`${btnCls} bg-red-600 text-white hover:bg-red-700 disabled:opacity-50`}>
              {pdfLoading ? <CircleNotch size={16} className="animate-spin" /> : <FilePdf size={16} weight="bold" />}
              PDF
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={exportWord} className={`${btnCls} bg-blue-600 text-white hover:bg-blue-700`}>
              <FileDoc size={16} weight="bold" /> Word
            </button>
            <button onClick={exportPNG} className={`${btnCls} bg-orange-600 text-white hover:bg-orange-700`}>
              <FileImage size={16} weight="bold" /> PNG
            </button>
          </div>
        </div>
      </aside>

      {/* Preview */}
      <main className="flex-1 overflow-auto print-area">
        {/* Mobile toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b border-gray-200 lg:hidden no-print">
          <button onClick={() => setSidebar(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <List size={22} />
          </button>
          <div className="flex items-center gap-1.5">
            <QrCode size={20} weight="duotone" className="text-indigo-600" />
            <span className="font-bold text-sm">Generador QR</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-gray-100 text-indigo-600">
              <Printer size={20} weight="bold" />
            </button>
            <button onClick={exportPDF} disabled={pdfLoading}
              className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
              {pdfLoading ? <CircleNotch size={20} className="animate-spin" /> : <Download size={20} weight="bold" />}
            </button>
          </div>
        </div>

        {/* Pages */}
        <div className="flex flex-col items-center gap-6 p-4 sm:p-6">
          {pages.map((count, pageIdx) => {
            const titleH = c.pageTitle ? c.titleSize * 2 * SCALE : 0;
            const pageNumH = c.showPageNum ? 16 * SCALE : 0;
            const gridW = pageW - marginPx * 2;
            const gridH = pageH - marginPx * 2 - titleH - pageNumH;

            return (
              <div key={pageIdx} className="page-wrapper">
                <div className="text-center text-xs font-semibold text-gray-400 mb-1.5 no-print">
                  Hoja {pageIdx + 1} de {numPages}
                </div>
                <div
                  className="page-preview relative overflow-hidden shadow-lg rounded-sm"
                  style={{
                    width: pageW,
                    height: pageH,
                    background: c.pageBg,
                    fontFamily: c.fontFamily,
                  }}
                >
                  {/* Title */}
                  {c.pageTitle && (
                    <div
                      className="page-title-el absolute w-full text-center font-bold"
                      style={{ top: marginPx, fontSize: c.titleSize * SCALE }}
                    >
                      {c.pageTitle}
                    </div>
                  )}

                  {/* Grid */}
                  <div
                    className={c.cutLines ? 'cut-grid' : ''}
                    style={{
                      position: 'absolute',
                      top: marginPx + titleH,
                      left: marginPx,
                      width: gridW,
                      height: gridH,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${c.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${c.rows}, 1fr)`,
                      gap: spacingPx,
                    }}
                  >
                    {Array.from({ length: perPage }).map((_, i) => {
                      const cellW = (gridW - spacingPx * (c.cols - 1)) / c.cols;
                      const cellH = (gridH - spacingPx * (c.rows - 1)) / c.rows;
                      const lblSpace = c.label ? c.labelSize * SCALE * 1.8 : 0;
                      const maxQR = Math.min(qrSizePx, cellW * 0.92, (cellH - lblSpace) * 0.92);

                      return (
                        <div
                          key={i}
                          className="qr-cell-preview flex flex-col items-center justify-center overflow-hidden"
                          style={c.cutLines ? { border: '1px dashed #ccc' } : undefined}
                        >
                          {i < count && qrDataURL && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={qrDataURL}
                                alt="QR"
                                style={{
                                  width: maxQR,
                                  height: maxQR,
                                  imageRendering: 'pixelated',
                                  borderRadius: c.roundedQR ? maxQR * 0.08 : 0,
                                }}
                              />
                              {c.label && (
                                <div
                                  className="qr-lbl text-center"
                                  style={{
                                    fontSize: c.labelSize * SCALE,
                                    color: '#333',
                                    marginTop: 2 * SCALE,
                                    fontFamily: c.fontFamily,
                                  }}
                                >
                                  {c.label}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Page number */}
                  {c.showPageNum && (
                    <div
                      className="absolute w-full text-center"
                      style={{ bottom: marginPx * 0.3, fontSize: 11 * SCALE, color: '#999' }}
                    >
                      Página {pageIdx + 1} de {numPages}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
