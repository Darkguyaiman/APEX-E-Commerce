import React from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Data Storage
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Cookie Policy
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. What are Cookies?
            </h2>
            <p>
              Cookies are small text records parsed into your browser storage directories to store preference variables, shopping bag items, and active admin session tokens.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Core Performance Cookies
            </h2>
            <p>
              We utilize local storage and functional cookies to remember items added to your Cart Drawer. Disabling these cookies will prevent the cart from retaining items across page reloads.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Administrative Session Tokens
            </h2>
            <p>
              Cookies are used to maintain your secure authentication state within the admin console. These tokens are verified server-side on every console request to protect product catalogs and testimonials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              4. Preference Calibration
            </h2>
            <p>
              Cookies help store UI settings (such as size configurations or search query filters) to streamline catalog navigation and enhance speed performance.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 py-3 px-6 text-xs font-label-caps text-primary transition-all select-none"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Return to Lab
          </Link>
        </div>

      </div>
    </div>
  );
}
