import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Legal Framework
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Privacy Policy
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Information Collection
            </h2>
            <p>
              We collect information necessary to process your transactions and personalize your laboratory access. This includes coordinates provided during Apex Club registration (e.g. name, contact coordinates, boot preferences) and details entered during shipping checkouts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Data Processing & Grid Security
            </h2>
            <p>
              Your transaction payloads are encrypted during transit using standard SSL security. In the event of a local database connection disconnect, checkout pipelines fall back to mock memory segments safely to guarantee zero trace exposure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Telemetry & Analytics
            </h2>
            <p>
              For members of the Apex Club, we log performance telemetry inputs submitted via the feedback forms. This telemetry is strictly utilized by the engineering department to calibrate carbon fiber chassis flex points and traction geometries.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              4. Third-Party Disclosures
            </h2>
            <p>
              APEX Performance does not distribute, trade, or otherwise allocate your metrics to external marketing conglomerates. Information is shared exclusively with shipping carriers to ensure accurate delivery of physical inventory.
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
