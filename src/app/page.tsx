'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full relative"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <Image 
              src="/images/hero-home.jpg" 
              alt="Elite football cleat shot in stadium pitch golden hour" 
              fill
              priority
              className="object-cover object-center brightness-90"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
          <div className="absolute inset-0 carbon-overlay opacity-25"></div>
        </div>

        <div className="relative z-10 text-center px-margin-mobile flex flex-col items-center">
          <h2 className="font-display-hero text-[52px] sm:text-7xl md:text-8xl text-primary uppercase italic font-black tracking-wide leading-none animate-fade-in-up">
            EVOLVE YOUR GAME
          </h2>
          <p className="font-headline-md text-base sm:text-xl md:text-2xl text-primary/80 mt-4 max-w-2xl mx-auto uppercase tracking-wide leading-relaxed animate-fade-in-up delay-200">
            ENGINEERED FOR THE ELITE. DESIGNED FOR THE FEARLESS.
          </p>
          <div className="mt-10 animate-fade-in-up delay-400">
            <Link 
              href="/shop/men"
              className="bg-primary-container text-on-primary-container font-headline-md px-10 py-4 uppercase tracking-tighter hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 group mx-auto select-none"
            >
              SHOP THE COLLECTION
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform font-bold">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none">
          <span className="font-label-caps text-[9px] sm:text-label-caps tracking-widest text-primary/60">
            SCROLL TO DISCOVER
          </span>
          <span className="material-symbols-outlined animate-scroll-bounce text-primary-container text-2xl">
            expand_more
          </span>
        </div>
      </section>

      {/* Asymmetric Transition skew */}
      <div className="speed-divider"></div>

      {/* Collections Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h3 className="font-headline-lg text-4xl md:text-headline-lg uppercase italic text-primary leading-none">
              SELECT YOUR ARMOR
            </h3>
            <div className="h-1 w-24 bg-primary-container mt-3"></div>
          </div>
          <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant/80 max-w-md leading-relaxed">
            Every pitch demands a different kind of intensity. Choose the technology that matches your playstyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* ELITE MENS */}
          <div className="group relative aspect-[3/4] overflow-hidden glass-card">
            <Image 
              src="/images/collection-mens.jpg" 
              alt="Elite black and gold cleats on glowing pedestal" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <span className="font-label-caps text-label-caps text-primary-container mb-2 inline-flex items-center gap-2 select-none">
                <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
                PREMIUM RANGE
              </span>
              <h4 className="font-headline-md text-2xl uppercase italic text-primary mb-4">
                ELITE MENS
              </h4>
              <Link 
                href="/shop/men"
                className="bg-white text-black font-label-caps text-label-caps py-3 px-6 w-fit uppercase hover:bg-primary-container transition-colors select-none text-center"
              >
                EXPLORE LINE
              </Link>
            </div>
          </div>

          {/* PRO WOMENS */}
          <div className="group relative aspect-[3/4] overflow-hidden glass-card">
            <Image 
              src="/images/collection-womens.jpg" 
              alt="Women sports photography cleat" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <span className="font-label-caps text-label-caps text-primary-container mb-2 inline-flex items-center gap-2 select-none">
                <span className="w-2 h-2 bg-primary-container rounded-full"></span>
                ELITE FIT
              </span>
              <h4 className="font-headline-md text-2xl uppercase italic text-primary mb-4">
                PRO WOMENS
              </h4>
              <Link 
                href="/shop/women"
                className="bg-white text-black font-label-caps text-label-caps py-3 px-6 w-fit uppercase hover:bg-primary-container transition-colors select-none text-center"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>

          {/* SPEED LAB */}
          <div className="group relative aspect-[3/4] overflow-hidden glass-card">
            <Image 
              src="/images/collection-speedlab.jpg" 
              alt="Neon lime and carbon fiber cleat design" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>
            
            {/* Spinning hover icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-28 h-28 rounded-full border-2 border-primary-container/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-primary-container/40 flex items-center justify-center animate-spin">
                  <span className="material-symbols-outlined text-primary-container text-3xl font-bold">
                    bolt
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <span className="font-label-caps text-label-caps text-primary-container mb-2 inline-flex items-center gap-2 select-none">
                <span className="w-2 h-2 bg-primary-container rounded-full"></span>
                LAB TESTED
              </span>
              <h4 className="font-headline-md text-2xl uppercase italic text-primary mb-4">
                SPEED LAB
              </h4>
              <Link 
                href="/product/apex-gold-elite"
                className="bg-white text-black font-label-caps text-label-caps py-3 px-6 w-fit uppercase hover:bg-primary-container transition-colors select-none text-center"
              >
                ENTER LAB
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs / Bento Grid */}
      <section className="py-section-gap bg-surface-container relative">
        <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h3 className="font-headline-lg text-4xl md:text-headline-lg uppercase italic text-primary mb-12 leading-none">
            BEYOND PERFORMANCE
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[600px]">
            {/* Large Tech Card */}
            <div className="md:col-span-2 md:row-span-2 glass-card p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/5 blur-[100px] group-hover:bg-primary-container/10 transition-colors"></div>
              <div>
                <span className="font-label-caps text-label-caps text-primary-container border-l-2 border-primary-container pl-3 mb-6 block select-none">
                  KINETIC RESPONSE
                </span>
                <h4 className="font-headline-lg text-4xl md:text-headline-lg text-primary mb-6 uppercase italic leading-none">
                  CARBON FIBER CHASSIS
                </h4>
                <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant/80 leading-relaxed max-w-md">
                  Our proprietary 3K weave carbon fiber plate delivers 15% more energy return with every stride. Zero energy waste, total dominance.
                </p>
              </div>
              <div className="flex items-end justify-between mt-8 md:mt-0">
                <div className="flex gap-4 select-none">
                  <div className="text-center">
                    <div className="font-stats-value text-xl md:text-2xl text-primary font-bold">185g</div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant/50">WEIGHT</div>
                  </div>
                  <div className="h-10 w-px bg-white/10 mx-2"></div>
                  <div className="text-center">
                    <div className="font-stats-value text-xl md:text-2xl text-primary font-bold">100%</div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant/50">LOCKDOWN</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-4xl text-white/10 group-hover:text-primary-container/45 transition-colors select-none font-bold">
                  precision_manufacturing
                </span>
              </div>
            </div>

            {/* Secondary Tech Card 1 */}
            <div className="md:col-span-2 glass-card p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
              <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-primary-container/20 transition-all select-none">
                <span className="material-symbols-outlined text-3xl text-primary-container font-bold">
                  waves
                </span>
              </div>
              <div>
                <h4 className="font-headline-md text-xl text-primary uppercase italic tracking-tight mb-2">
                  GRIP-SKIN UPPER
                </h4>
                <p className="font-body-md text-sm md:text-body-md text-on-surface-variant/80 leading-relaxed">
                  Micro-textured synthetic skin applied to critical contact zones for absolute ball control in both wet and dry weather conditions.
                </p>
              </div>
            </div>

            {/* Secondary Tech Card 2 */}
            <div className="md:col-span-1 glass-card p-8 flex flex-col justify-between group">
              <div>
                <span className="material-symbols-outlined text-3xl text-primary-container mb-4 select-none font-bold">
                  location_searching
                </span>
                <h4 className="font-headline-md text-xl text-primary uppercase italic tracking-tight mb-2">
                  PRO-TRACT
                </h4>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
                Multi-directional stud geometry engineered for explosive turns and acceleration on firm pitches.
              </p>
            </div>

            {/* CTA Join Club Button Grid */}
            <Link 
              href="/product/apex-gold-elite"
              className="md:col-span-1 glass-card p-8 flex flex-col justify-between items-center text-center bg-primary-container hover:bg-white text-black transition-colors cursor-pointer group select-none"
            >
              <h4 className="font-headline-md text-xl font-bold uppercase leading-none italic">
                JOIN THE<br/>APEX CLUB
              </h4>
              <span className="material-symbols-outlined text-4xl text-black group-hover:translate-x-2 transition-transform font-bold">
                trending_flat
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
