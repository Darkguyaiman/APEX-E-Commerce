import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Communication Channels
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Contact Us
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Laboratory Customer Support
            </h2>
            <p>
              For queries related to active catalog orders, shipping tracking details, or returns calibration, email us at:
            </p>
            <p className="font-mono text-primary bg-surface-container-low px-4 py-2 border border-white/5 w-fit">
              grid-support@corex.performance
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Design Feedback Telemetry
            </h2>
            <p>
              If you are a member of the Apex Club, please submit cleat wear-test telemetry files directly via your membership dashboard page. This telemetry is prioritized for future prototype iterations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Telecommunication Link
            </h2>
            <p>
              Need immediate support coordinates? Click to message our client services representatives directly on WhatsApp:
            </p>
            <a 
              href="https://wa.me/601121194948" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-primary-container hover:bg-white text-black font-label-caps text-xs font-bold py-3 px-6 uppercase transition-colors"
            >
              <span className="material-symbols-outlined font-bold text-lg">chat</span>
              WhatsApp Hotline
            </a>
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
