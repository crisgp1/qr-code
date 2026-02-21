import { AppShell } from '@/components/layout/AppShell';
import { BASE_URL } from '@/lib/constants';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'QR & Barcode Generator',
  url: BASE_URL,
  description:
    'Free online QR code and barcode generator. Create print-ready templates with custom layouts, logos, and multiple export formats.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'cgarper.dev',
    url: 'https://cgarper.dev',
  },
  inLanguage: ['en', 'es'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '2.0.0',
  screenshot: `${BASE_URL}/og-image.png`,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <AppShell />
    </>
  );
}
