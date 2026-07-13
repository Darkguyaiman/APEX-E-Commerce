import React from 'react';
import Link from 'next/link';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Calibration Guide
        </span>
        <h1 className="font-headline-lg text-4xl md:text-5xl uppercase italic leading-none tracking-tight mb-8">
          Size Guide
        </h1>
        
        {/* Content */}
        <div className="space-y-8 font-body-md text-sm md:text-base text-on-surface-variant/90 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              1. Measuring Foot Length
            </h2>
            <p>
              To get the most accurate fit coordinates, stand on a flat surface with your heel against a wall. Measure the distance from the wall to the tip of your longest toe in centimeters. Compare this to the size chart matrix below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              2. Sizing Conversion Matrix
            </h2>
            <div className="overflow-x-auto border border-white/10 mt-4">
              <table className="w-full border-collapse text-left text-sm text-on-surface">
                <thead>
                  <tr className="border-b border-white/10 bg-surface-container-low font-label-caps text-xs text-primary uppercase">
                    <th className="px-6 py-3">US (Men)</th>
                    <th className="px-6 py-3">UK</th>
                    <th className="px-6 py-3">EU</th>
                    <th className="px-6 py-3">CM (Foot Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  <tr><td className="px-6 py-3 text-primary">7.0</td><td className="px-6 py-3">6.0</td><td className="px-6 py-3">40.0</td><td className="px-6 py-3">25.0 cm</td></tr>
                  <tr><td className="px-6 py-3 text-primary">8.0</td><td className="px-6 py-3">7.0</td><td className="px-6 py-3">41.0</td><td className="px-6 py-3">26.0 cm</td></tr>
                  <tr><td className="px-6 py-3 text-primary">9.0</td><td className="px-6 py-3">8.0</td><td className="px-6 py-3">42.5</td><td className="px-6 py-3">27.0 cm</td></tr>
                  <tr><td className="px-6 py-3 text-primary">10.0</td><td className="px-6 py-3">9.0</td><td className="px-6 py-3">44.0</td><td className="px-6 py-3">28.0 cm</td></tr>
                  <tr><td className="px-6 py-3 text-primary">11.0</td><td className="px-6 py-3">10.0</td><td className="px-6 py-3">45.0</td><td className="px-6 py-3">29.0 cm</td></tr>
                  <tr><td className="px-6 py-3 text-primary">12.0</td><td className="px-6 py-3">11.0</td><td className="px-6 py-3">46.0</td><td className="px-6 py-3">30.0 cm</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-headline-md text-xl text-primary uppercase italic">
              3. Width Profiles & Anatomical Last
            </h2>
            <p>
              APEX cleats utilize a narrow anatomical last designed for maximum lock-down speed. If you have wide feet, we recommend choosing 0.5 size larger than your regular measurement to allow natural toe splay across the carbon plate.
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
