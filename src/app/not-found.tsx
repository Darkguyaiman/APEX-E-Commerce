'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background text-primary min-h-screen relative overflow-hidden flex flex-col justify-center items-center px-6 py-24 select-none">
      {/* Carbon Backdrop Patterns */}
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>

      {/* Decorative stadium spotlight glows */}
      <div className="absolute -top-[10%] left-[20%] w-[50%] aspect-square rounded-full bg-primary-container/10 blur-[150px] pointer-events-none animate-pulse duration-10000"></div>
      <div className="absolute bottom-[5%] right-[10%] w-[45%] aspect-square rounded-full bg-neon-crimson/5 blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-xl mx-auto flex flex-col items-center">
        {/* Large Scoreboard-style 404 */}
        <div className="relative group">
          <span className="absolute -inset-4 rounded-3xl bg-primary-container/20 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></span>
          <h1 className="relative font-headline-lg text-[120px] md:text-[160px] italic leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-on-surface-variant/20 select-none drop-shadow-[0_4px_24px_rgba(204,255,0,0.15)]">
            404
          </h1>
        </div>

        {/* Status indicator */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
          <span className="font-label-caps text-[10px] text-primary-container tracking-widest font-black uppercase">
            STATUS: OUT OF BOUNDS
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-headline-lg text-4xl md:text-5xl uppercase italic leading-none text-primary font-black tracking-wide">
          OFFSIDE PLAY
        </h2>

        {/* Description */}
        <p className="mt-4 font-body-md text-sm md:text-base text-on-surface-variant/80 leading-relaxed max-w-md">
          The pitch coordinate you requested is out of play. It looks like this page was kicked out of bounds or transferred to another stadium.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto bg-primary-container text-black font-label-caps text-xs font-bold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(204,255,0,0.25)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            RETURN TO PITCH
          </Link>
          
          <Link
            href="/shop"
            className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 text-primary font-label-caps text-xs font-bold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            EXPLORE GEAR
            <ArrowRight className="w-4 h-4 text-primary-container" />
          </Link>
        </div>
      </div>

      {/* Decorative scoreboard layout detail */}
      <div className="absolute bottom-10 left-10 hidden lg:flex flex-col gap-1 border border-white/5 bg-surface-container-low/20 backdrop-blur-md rounded-xl p-4 font-label-caps text-[9px] text-on-surface-variant/40 tracking-widest">
        <div>SECTOR: APEX-LABS</div>
        <div>MATCH TIME: 90:00+</div>
        <div>COORDINATE: LOST</div>
      </div>
    </div>
  );
}
