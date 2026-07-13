import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          User Agreement
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Terms of Service
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the APEX store, you agree to comply with our transaction policies and site guidelines. These terms govern catalog utilization, laboratory account generation, and early prototype acquisitions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Catalog Orders & Custom Purchases
            </h2>
            <p>
              All purchases made via the checkout grid represent authorization to process coordinates for product fulfillment. Price specifications are listed in Ringgit Malaysia (RM) and are subject to immediate adjustments during inventory cycles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Laboratory Membership Requirements
            </h2>
            <p>
              Apex Club membership grants access to restricted sections of our catalog. Members agree to provide accurate sizing details and coordinate credentials. Membership remains contingent on adhering to scientific beta feedback submission requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              4. Disclaimer of Product Limits
            </h2>
            <p>
              Prototype gear is calibrated for testing environments. While engineered for elite performance speed, metrics can vary based on pitch conditions, wet weather variables, and user biomechanics.
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
