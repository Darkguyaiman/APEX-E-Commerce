import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import { CartProvider } from '@/context/CartContext';
import LenisProvider from '@/components/LenisProvider';
import LayoutContent from '@/components/LayoutContent';

export const metadata: Metadata = {
  title: 'Apex Pitch | Elite Football Gear',
  description: 'Building the future of athletic performance through precision engineering and data-driven design. Engineered for the elite.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-electric-lime selection:text-black overflow-x-hidden min-h-full flex flex-col">
        <LenisProvider>
          <CartProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
