import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import LenisProvider from '@/components/LenisProvider';
import LayoutContent from '@/components/LayoutContent';
import PWARegistration from '@/components/PWARegistration';

export const metadata: Metadata = {
  title: 'Apex | Elite Football Gear',
  description: 'Building the future of athletic performance through precision engineering and data-driven design. Engineered for the elite.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apex-logo.png', sizes: '500x500', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Apex',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('apex-theme');
        if (theme !== 'light' && theme !== 'dark') theme = 'dark';
        var background = theme === 'light' ? '#f8f9f2' : '#131313';
        var color = theme === 'light' ? '#20221d' : '#e5e2e1';
        var root = document.documentElement;
        root.dataset.theme = theme;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        root.style.backgroundColor = background;
        root.style.color = color;
        var style = document.createElement('style');
        style.id = 'apex-initial-theme';
        style.textContent = 'html,body{background-color:' + background + ';color:' + color + ';color-scheme:' + theme + ';}';
        document.head.appendChild(style);
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.style.backgroundColor = '#131313';
        document.documentElement.style.color = '#e5e2e1';
      }
    })();
  `;

  return (
    <html lang="en" className="dark h-full" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          id="apex-theme"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-electric-lime selection:text-black overflow-x-hidden min-h-full flex flex-col">
        <PWARegistration />
        <LenisProvider>
          <ThemeProvider>
            <CartProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </CartProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
