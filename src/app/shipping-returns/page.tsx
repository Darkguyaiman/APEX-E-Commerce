import React from 'react';
import Link from 'next/link';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Client Fulfillment
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Shipping & Returns
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Processing Speed
            </h2>
            <p>
              All orders are processed and dispatched within 48 hours from our central distribution lab. Tracked carrier alerts are synchronized directly with your contact email as soon as packaging labels are scanned.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Domestic & International Rates
            </h2>
            <p>
              Standard courier delivery inside Malaysia is fully complimentary. International express dispatch carries flat-rate shipping surcharges calculated dynamically during the checkout grid process.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Returns Procedure
            </h2>
            <p>
              If the carbon fiber chassis lockdown does not conform to your boot parameters, you can initiate a return within 14 days of carriage arrival. Cleats must be unused, free of turf debris, and packed inside the original APEX structural box.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              4. Exchanges
            </h2>
            <p>
              Exchanges for alternate cleat sizing coordinates are processed immediately contingent on active stock availability in our catalog warehouse.
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
