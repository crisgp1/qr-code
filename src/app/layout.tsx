import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'QR Code & Barcode Generator - Free Online Tool | cgarper.dev',
    template: '%s | cgarper.dev',
  },
  description:
    'Free online QR code and barcode generator. Create print-ready templates with custom layouts, logos, colors, and multiple export formats (PDF, PNG, SVG, Word). No signup required.',
  keywords: [
    'QR code generator',
    'barcode generator',
    'QR code maker',
    'free QR code',
    'barcode maker',
    'print QR codes',
    'bulk QR codes',
    'QR code PDF',
    'Code128 generator',
    'EAN-13 generator',
    'UPC barcode',
    'generador de codigos QR',
    'generador de barras',
    'crear codigo QR gratis',
    'codigos QR para imprimir',
  ],
  applicationName: 'QR & Barcode Generator',
  authors: [{ name: 'cgarper.dev', url: 'https://cgarper.dev' }],
  creator: 'cgarper.dev',
  publisher: 'cgarper.dev',
  category: 'utility',

  alternates: {
    canonical: '/',
    languages: {
      en: '/?lang=en',
      es: '/?lang=es',
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    title: 'QR Code & Barcode Generator - Free Online Tool',
    description:
      'Create QR codes and barcodes with custom layouts, logos, and templates. Export to PDF, PNG, SVG, or Word. Completely free, no signup.',
    url: BASE_URL,
    siteName: 'QR & Barcode Generator',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QR & Barcode Generator - Free online tool by cgarper.dev',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'QR Code & Barcode Generator - Free Online Tool',
    description:
      'Create QR codes and barcodes with custom layouts, logos, and templates. Export to PDF, PNG, SVG, or Word. Free, no signup.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--surface)] text-[var(--text-primary)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
