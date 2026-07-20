'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TestimonialsSection from '@/components/TestimonialsSection';
import type { Category } from '@/lib/db';

const fallbackCategoryCards: Category[] = [
  { id: 1, name: 'Men', slug: 'men', image_url: '/images/collection-mens.jpg' },
  { id: 2, name: 'Women', slug: 'women', image_url: '/images/collection-womens.jpg' },
  { id: 3, name: 'Kit', slug: 'kit', image_url: '/images/collection-speedlab.jpg' }
];

function getCategoryHref(slug: string) {
  if (slug === 'men' || slug === 'women') {
    return `/shop/${slug}`;
  }

  return `/shop?category=${encodeURIComponent(slug)}`;
}

function getCategoryLabel(category: Category) {
  if (category.slug === 'men') return 'PREMIUM RANGE';
  if (category.slug === 'women') return 'ELITE FIT';
  if (category.slug === 'kit') return 'MATCH READY';
  return 'PRODUCT CATEGORY';
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [categoryCards, setCategoryCards] = useState<Category[]>(fallbackCategoryCards);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryCards(
            data
              .filter((category: Category) => category.slug && category.name)
              .slice(0, 3)
              .map((category: Category, index: number) => ({
                ...category,
                image_url: category.image_url || fallbackCategoryCards[index]?.image_url || '/images/product/ghost.png'
              }))
          );
        }
      })
      .catch((error) => {
        console.error('Failed to load home category cards:', error);
      });
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
          <h2 className="font-display-hero text-[52px] sm:text-7xl md:text-8xl text-white uppercase italic font-black tracking-wide leading-none drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)] animate-fade-in-up">
            EVOLVE YOUR GAME
          </h2>
          <p className="font-headline-md text-base sm:text-xl md:text-2xl text-white/85 mt-4 max-w-2xl mx-auto uppercase tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] animate-fade-in-up delay-200">
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
          <span className="hero-scroll-cue-label font-label-caps text-[9px] sm:text-label-caps tracking-widest">
            SCROLL TO DISCOVER
          </span>
          <span className="hero-scroll-cue-icon material-symbols-outlined animate-scroll-bounce text-2xl">
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
          {categoryCards.map((category, index) => (
            <div key={category.id} className="group relative aspect-[3/4] overflow-hidden glass-card">
              <Image
                src={category.image_url || fallbackCategoryCards[index]?.image_url || '/images/product/ghost.png'}
                alt={`${category.name} product category`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-label-caps text-[#c3f400] mb-2 inline-flex items-center gap-2 select-none">
                  <span className={`w-2 h-2 bg-[#c3f400] rounded-full ${index === 0 ? 'animate-pulse' : ''}`}></span>
                  {getCategoryLabel(category)}
                </span>
                <h4 className="font-headline-md text-2xl uppercase italic text-white mb-4">
                  {category.name}
                </h4>
                <Link
                  href={getCategoryHref(category.slug)}
                  className="bg-white text-black font-label-caps text-label-caps py-3 px-6 w-fit uppercase hover:bg-[#c3f400] transition-colors select-none text-center"
                >
                  Explore Category
                </Link>
              </div>
            </div>
          ))}
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
              href="/membership"
              className="md:col-span-1 glass-card p-8 flex flex-col justify-between items-start group relative overflow-hidden select-none hover:border-primary-container/30 transition-colors"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/5 blur-[100px] group-hover:bg-primary-container/15 transition-colors"></div>
              <div>
                <span className="font-label-caps text-label-caps text-primary-container border-l-2 border-primary-container pl-3 mb-6 block select-none">
                  MEMBERSHIP
                </span>
                <h4 className="font-headline-md text-2xl text-primary uppercase italic leading-none mb-3">
                  JOIN THE<br/>APEX CLUB
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant/70 leading-relaxed">
                  Gain exclusive early access to prototype releases, elite training, and member-only catalog drops.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-primary-container font-label-caps text-[10px] tracking-widest font-bold group-hover:text-primary transition-colors">
                <span>REGISTER NOW</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1.5 transition-transform font-bold">
                  arrow_forward
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
