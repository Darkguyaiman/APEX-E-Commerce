'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-background text-primary min-h-screen relative overflow-hidden pb-24">
      {/* Carbon Backdrop Patterns */}
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
      
      {/* Decorative gradient glowing spots */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] aspect-square rounded-full bg-primary-container/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[15%] w-[50%] aspect-square rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Header Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-16 text-center select-none relative z-10">
        <p className="font-label-caps text-xs text-primary-container tracking-widest font-black uppercase mb-3 animate-fade-in">
          THE APEX MANIFESTO
        </p>
        <h1 className="font-headline-lg text-5xl sm:text-6xl md:text-8xl uppercase italic leading-none text-primary font-black tracking-wide animate-fade-in">
          BORN IN THE LAB.<br />
          <span className="text-primary-container">TESTED ON THE PITCH.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto font-body-md text-sm md:text-base text-on-surface-variant/80 leading-relaxed animate-fade-in">
          We don't make boots for the casual player. We engineer high-performance apparatus for the modern athlete who demands absolute velocity, structural support, and split-second energy response.
        </p>
      </section>

      {/* Stats Board Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 border border-white/5 bg-surface-container-low/20 flex flex-col justify-center select-none hover:border-white/10 transition-all duration-300">
            <span className="font-headline-lg text-4xl md:text-5xl text-primary-container font-black italic">185G</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">AVG BOOT WEIGHT</span>
          </div>
          <div className="glass-card p-6 border border-white/5 bg-surface-container-low/20 flex flex-col justify-center select-none hover:border-white/10 transition-all duration-300">
            <span className="font-headline-lg text-4xl md:text-5xl text-primary font-black italic">0.12S</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">PROPULSIVE SNAP LATENCY</span>
          </div>
          <div className="glass-card p-6 border border-white/5 bg-surface-container-low/20 flex flex-col justify-center select-none hover:border-white/10 transition-all duration-300">
            <span className="font-headline-lg text-4xl md:text-5xl text-primary-container font-black italic">100%</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">CARBON FIBER CHASSIS</span>
          </div>
          <div className="glass-card p-6 border border-white/5 bg-surface-container-low/20 flex flex-col justify-center select-none hover:border-white/10 transition-all duration-300">
            <span className="font-headline-lg text-4xl md:text-5xl text-primary font-black italic">60+</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">MATCH TESTING HOURS</span>
          </div>
        </div>
      </section>

      {/* Logo Objectives Graphic Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-24 mb-8 relative z-10 select-none">
        <div className="mb-12 text-center">
          <p className="font-label-caps text-xs text-primary-container tracking-widest font-black uppercase">OUR MISSION</p>
          <h2 className="mt-2 font-headline-lg text-3xl uppercase italic leading-none text-primary md:text-5xl tracking-wide">
            THREE PILLARS OF APEX
          </h2>
        </div>

        {/* Desktop radial graphic */}
        <div className="hidden md:block relative" style={{ height: '560px' }}>
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          ></div>

          {/* SVG curved pulsing lines from center to each card */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary-container)" stopOpacity="0.05" />
                <stop offset="50%" stopColor="var(--color-primary-container)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-primary-container)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <style>{`
              .curve-pulse {
                stroke-dasharray: 12 8;
                animation: dashPulse 2.5s linear infinite;
              }
              .curve-pulse-delay1 { animation-delay: 0.4s; }
              .curve-pulse-delay2 { animation-delay: 0.8s; }
              .curve-pulse-delay3 { animation-delay: 1.2s; }
              .curve-pulse-delay4 { animation-delay: 1.6s; }
              .curve-pulse-delay5 { animation-delay: 2.0s; }
              @keyframes dashPulse {
                0% { stroke-dashoffset: 0; opacity: 0.15; }
                50% { opacity: 0.4; }
                100% { stroke-dashoffset: -40; opacity: 0.15; }
              }
            `}</style>
            {/* Top — gentle S-curve */}
            <path d="M 500 280 C 500 220, 480 120, 500 34" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse" />
            {/* Top-left — sweeping curve */}
            <path d="M 500 280 C 420 240, 260 200, 100 100" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse curve-pulse-delay1" />
            {/* Top-right — sweeping curve */}
            <path d="M 500 280 C 580 240, 740 200, 900 100" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse curve-pulse-delay2" />
            {/* Bottom-left — sweeping curve */}
            <path d="M 500 280 C 420 320, 260 360, 100 460" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse curve-pulse-delay3" />
            {/* Bottom-right — sweeping curve */}
            <path d="M 500 280 C 580 320, 740 360, 900 460" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse curve-pulse-delay4" />
            {/* Bottom — gentle S-curve */}
            <path d="M 500 280 C 500 340, 520 440, 500 526" fill="none" stroke="var(--color-primary-container)" strokeWidth="1.2" className="curve-pulse curve-pulse-delay5" />
          </svg>

          {/* Center Logo Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-32 h-32 rounded-2xl bg-surface border border-primary-container/30 shadow-[0_0_40px_rgba(var(--color-primary-container-rgb,200,170,80),0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_60px_rgba(200,170,80,0.3)] hover:border-primary-container/60 cursor-pointer">
              <Image
                src="/apex-logo.png"
                alt="Apex Logo"
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl object-contain"
              />
            </div>
          </div>

          {/* Top card — VELOCITY */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">speed</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">VELOCITY</span>
          </div>

          {/* Top-left card — DURABILITY */}
          <div className="absolute left-[10%] top-[12%] z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">shield</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">DURABILITY</span>
          </div>

          {/* Top-right card — PRECISION */}
          <div className="absolute right-[10%] top-[12%] z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">precision_manufacturing</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">PRECISION</span>
          </div>

          {/* Bottom-left card — INNOVATION */}
          <div className="absolute left-[10%] bottom-[12%] z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">INNOVATION</span>
          </div>

          {/* Bottom-right card — CRAFT */}
          <div className="absolute right-[10%] bottom-[12%] z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">auto_fix_high</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">CRAFT</span>
          </div>

          {/* Bottom card — PERFORMANCE */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-115 hover:border-primary-container/40 hover:shadow-[0_0_20px_rgba(200,170,80,0.2)] cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">sports_soccer</span>
            </div>
            <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest mt-2">PERFORMANCE</span>
          </div>
        </div>

        {/* Mobile: compact radial layout */}
        <div className="md:hidden relative mx-auto w-full max-w-[320px]" style={{ aspectRatio: '320 / 360' }}>
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          ></div>

          {/* SVG curved pulsing lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 320 360" preserveAspectRatio="none">
            <style>{`
              .m-curve {
                stroke-dasharray: 8 6;
                animation: mDash 2.5s linear infinite;
              }
              .m-d1 { animation-delay: 0.4s; }
              .m-d2 { animation-delay: 0.8s; }
              .m-d3 { animation-delay: 1.2s; }
              .m-d4 { animation-delay: 1.6s; }
              .m-d5 { animation-delay: 2.0s; }
              @keyframes mDash {
                0% { stroke-dashoffset: 0; opacity: 0.15; }
                50% { opacity: 0.35; }
                100% { stroke-dashoffset: -28; opacity: 0.15; }
              }
            `}</style>
            {/* Top */}
            <path d="M 160 180 C 160 140, 150 80, 160 30" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve" />
            {/* Top-left */}
            <path d="M 160 180 C 120 160, 80 100, 36 50" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve m-d1" />
            {/* Top-right */}
            <path d="M 160 180 C 200 160, 240 100, 284 50" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve m-d2" />
            {/* Bottom-left */}
            <path d="M 160 180 C 120 200, 80 260, 36 310" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve m-d3" />
            {/* Bottom-right */}
            <path d="M 160 180 C 200 200, 240 260, 284 310" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve m-d4" />
            {/* Bottom */}
            <path d="M 160 180 C 160 220, 170 280, 160 330" fill="none" stroke="var(--color-primary-container)" strokeWidth="1" className="m-curve m-d5" />
          </svg>

          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-primary-container/30 shadow-[0_0_24px_rgba(200,170,80,0.12)] flex items-center justify-center">
              <Image
                src="/apex-logo.png"
                alt="Apex Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Top */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">speed</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">VELOCITY</span>
          </div>

          {/* Top-left */}
          <div className="absolute left-0 top-[8%] z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">shield</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">DURABILITY</span>
          </div>

          {/* Top-right */}
          <div className="absolute right-0 top-[8%] z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">precision_manufacturing</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">PRECISION</span>
          </div>

          {/* Bottom-left */}
          <div className="absolute left-0 bottom-[8%] z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">INNOVATION</span>
          </div>

          {/* Bottom-right */}
          <div className="absolute right-0 bottom-[8%] z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">auto_fix_high</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">CRAFT</span>
          </div>

          {/* Bottom */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">sports_soccer</span>
            </div>
            <span className="font-label-caps text-[7px] text-on-surface-variant/60 tracking-widest mt-1">PERFORMANCE</span>
          </div>
        </div>
      </section>

      {/* Engineering Pillars Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-20 relative z-10">
        <div className="mb-10 border-b border-white/10 pb-6">
          <p className="font-label-caps text-xs text-primary-container tracking-widest font-black uppercase">CORE PHILOSOPHY</p>
          <h2 className="mt-2 font-headline-lg text-3xl uppercase italic leading-none text-primary md:text-5xl">
            DESIGNED WITH ZERO WASTE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="border border-white/10 bg-surface-container-low/30 p-8 flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
            <div>
              <span className="font-headline-lg text-lg text-primary-container italic font-black">01 / PRECISION</span>
              <h3 className="font-headline-md text-2xl uppercase tracking-tight text-primary leading-none mt-4 mb-3">
                ANATOMICAL LOCKDOWN
              </h3>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
                By contouring our lasts precisely to active athletic arches and biomechanics, we eliminate internal slippage. Every movement translates directly to acceleration.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="border border-white/10 bg-surface-container-low/30 p-8 flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
            <div>
              <span className="font-headline-lg text-lg text-primary-container italic font-black">02 / KINETICS</span>
              <h3 className="font-headline-md text-2xl uppercase tracking-tight text-primary leading-none mt-4 mb-3">
                PROPULSION PLATES
              </h3>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
                We integrate localized multi-directional carbon fibers and reactive nylon soleplates that bend with your stride and snap back immediately, boosting top-end speed.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="border border-white/10 bg-surface-container-low/30 p-8 flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
            <div>
              <span className="font-headline-lg text-lg text-primary-container italic font-black">03 / QUANTUM</span>
              <h3 className="font-headline-md text-2xl uppercase tracking-tight text-primary leading-none mt-4 mb-3">
                LIGHTEST COMPOSITES
              </h3>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
                We design with single-piece structural weaves and micro-textures. We shave away extra millimeters of rubber, offering elite traction without burdening the foot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-28 relative z-10">
        <div className="border border-white/10 bg-surface-container-low p-8 md:p-16 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>
          
          <h2 className="font-headline-lg text-3xl md:text-5xl uppercase italic leading-none text-primary font-black mb-4 relative z-10">
            READY TO DEPLOY?
          </h2>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 max-w-xl mx-auto mb-8 relative z-10">
            Explore the active footwear catalog and complete your training kit with top-tier soccer apparel and gear.
          </p>
          
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary-container text-black px-8 py-4 font-label-caps text-xs font-bold transition-all hover:brightness-110 active:scale-95 cursor-pointer relative z-10"
          >
            ENTER THE APEX SHOP
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
