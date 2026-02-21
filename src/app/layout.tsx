import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generador de QR',
  description: 'Genera plantillas de QR codes para imprimir en hoja carta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
