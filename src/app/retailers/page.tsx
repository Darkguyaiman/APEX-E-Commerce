import React from 'react';
import Link from 'next/link';

export default function RetailersPage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Physical Grid Locations
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Authorized Retailers
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Laboratory Stockists
            </h2>
            <p>
              APEX cleats and equipment lines are distributed through a curated network of elite athletic stockists globally. Our retail locations feature dynamic test tracks for real-time traction validation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Major Hubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="border border-white/10 bg-surface-container-low p-5">
                <h3 className="font-headline-md text-lg text-primary uppercase italic mb-1">LONDON LAB</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Unit 4B, Shoreditch High St, London E1 6PG<br/>
                  Support Hotline: +44 20 7946 0912
                </p>
              </div>
              <div className="border border-white/10 bg-surface-container-low p-5">
                <h3 className="font-headline-md text-lg text-primary uppercase italic mb-1">MILAN LAB</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Corso Garibaldi 86, 20121 Milano MI<br/>
                  Support Hotline: +39 02 8946 2201
                </p>
              </div>
              <div className="border border-white/10 bg-surface-container-low p-5">
                <h3 className="font-headline-md text-lg text-primary uppercase italic mb-1">MANCHESTER LAB</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  12 Hilton St, Manchester M1 1JF<br/>
                  Support Hotline: +44 161 946 0418
                </p>
              </div>
              <div className="border border-white/10 bg-surface-container-low p-5">
                <h3 className="font-headline-md text-lg text-primary uppercase italic mb-1">KUALA LUMPUR HUB</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lot 1.12, Pavilion Elite, Bukit Bintang, 55100 KL<br/>
                  Support Hotline: +60 3 2119 4948
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Trial Camp Tours
            </h2>
            <p>
              Demo stock catalog batches are periodically made available during local tournament trial camps. Check your APEX Club dispatch newsletter for upcoming tour calendars in your region.
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
