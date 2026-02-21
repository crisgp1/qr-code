import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'QR & Barcode Generator - Free Online Tool';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* QR icon placeholder */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            ▣
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            QR & Barcode Generator
          </div>
        </div>

        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Create print-ready QR codes and barcodes with custom layouts, logos, and templates.
          Export to PDF, PNG, SVG, or Word.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 40,
          }}
        >
          {['PDF', 'PNG', 'SVG', 'Word'].map((fmt) => (
            <div
              key={fmt}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding: '8px 20px',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {fmt}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            opacity: 0.7,
          }}
        >
          Free Tool — cgarper.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
