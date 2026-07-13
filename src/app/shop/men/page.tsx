'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

export default function MenShop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, SG, FG, TF
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/products?category=men')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load men products:', err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredProducts = products.filter((p) => {
    // Avoid showing the hero product in the grid to prevent redundancy
    if (p.slug === 'nike-air-zoom-mercurial-vapor-15-elite-fg') return false;

    // Pitch filter
    if (activeFilter !== 'ALL' && p.traction_type !== activeFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.colorway.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const heroProduct = products.find((p) => p.slug === 'nike-air-zoom-mercurial-vapor-15-elite-fg') || products[0];

  return (
    <main className="pb-32 bg-background relative min-h-screen">
      {/* Featured Hero Banner */}
      {heroProduct && (
        <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden mb-section-gap select-none animate-fade-in">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/collection-speedlab.jpg"
              alt={heroProduct.name}
              fill
              priority
              className="object-cover object-center scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute inset-0 carbon-pattern opacity-15"></div>
          </div>

          <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop pb-12 flex flex-col items-start max-w-container-max mx-auto">
            <div className="bg-surface-container-highest px-4 py-1.5 border-l-2 border-primary-container mb-4">
              <span className="font-label-caps text-xs text-primary-container tracking-widest font-bold uppercase">
                {heroProduct.type_chip || 'ELITE PERFORMANCE'}
              </span>
            </div>

            <h1 className="font-display-hero text-5xl md:text-7xl uppercase leading-none mb-4 italic tracking-wide text-primary">
              {heroProduct.name.split(' ')[0]} {heroProduct.name.split(' ')[1]} <span className="text-primary-container">{heroProduct.name.split(' ').slice(2).join(' ')}</span>
            </h1>

            <p className="max-w-xl font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
              {heroProduct.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => addToCart(heroProduct, '10.5')}
                className="bg-primary-container text-black px-8 py-4 font-label-caps text-sm font-bold flex items-center group transition-all active:scale-95 cursor-pointer"
              >
                DEPLOY VELOCITY
                <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-2 font-bold">
                  arrow_forward
                </span>
              </button>
              <div className="glass-card px-6 py-4 flex flex-col justify-center border border-white/10">
                <span className="font-label-caps text-[9px] text-on-surface-variant/50">LOCKED RATE</span>
                <span className="font-stats-value text-stats-value text-primary-container">
                  RM {Number(heroProduct.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none py-2 select-none">
            <span className="font-label-caps text-label-caps text-on-surface-variant mr-4">
              FILTER BY PITCH:
            </span>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-5 py-2 border-2 transition-all font-label-caps text-xs cursor-pointer ${activeFilter === 'ALL'
                  ? 'border-primary-container bg-primary-container text-black font-bold'
                  : 'border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
            >
              ALL GEAR
            </button>
            <button
              onClick={() => setActiveFilter('SG')}
              className={`px-5 py-2 border-2 transition-all font-label-caps text-xs cursor-pointer ${activeFilter === 'SG'
                  ? 'border-primary-container bg-primary-container text-black font-bold'
                  : 'border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
            >
              SOFT GROUND
            </button>
            <button
              onClick={() => setActiveFilter('FG')}
              className={`px-5 py-2 border-2 transition-all font-label-caps text-xs cursor-pointer ${activeFilter === 'FG'
                  ? 'border-primary-container bg-primary-container text-black font-bold'
                  : 'border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
            >
              FIRM GROUND
            </button>
            <button
              onClick={() => setActiveFilter('TF')}
              className={`px-5 py-2 border-2 transition-all font-label-caps text-xs cursor-pointer ${activeFilter === 'TF'
                  ? 'border-primary-container bg-primary-container text-black font-bold'
                  : 'border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
            >
              ARTIFICIAL TURF
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 bg-surface-container border border-white/10">
            <input
              type="text"
              placeholder="SEARCH MEN'S GEAR"
              className="w-full bg-transparent px-4 py-2.5 font-label-caps text-xs text-primary placeholder:text-on-surface-variant/40 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant/50 text-xl pointer-events-none">
              search
            </span>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-2 border-primary-container/20 border-t-primary-container rounded-full animate-spin"></div>
            <p className="font-label-caps text-xs text-on-surface-variant animate-pulse">LOADING LOCKERS...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-card p-10 border border-white/5">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 select-none">
              sports_soccer
            </span>
            <h4 className="font-headline-md text-xl uppercase italic text-on-surface-variant">NO CLEATS DEPLOYED</h4>
            <p className="font-body-md text-sm text-on-surface-variant/50 mt-1 max-w-md mx-auto">
              No matching football boots found for "{searchQuery || activeFilter}". Reset filters to synchronize grid.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Tech Story Banner */}
      <section className="mt-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto select-none">
        <div className="relative w-full h-[460px] overflow-hidden group border border-white/5">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/tech-carbon-sole.jpg"
              alt="Macro shot of carbon fiber sole plate of cleat"
              fill
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/70 group-hover:bg-black/55 transition-colors duration-500"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full max-w-xl px-8 sm:px-12 md:px-16 italic">
            <h2 className="font-display-hero text-4xl sm:text-5xl md:text-6xl uppercase mb-4 tracking-wide text-primary leading-none">
              Carbon Core<br /><span className="text-primary-container">Integrity</span>
            </h2>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
              Our patented 12-layer carbon composite provides 40% more energy return compared to traditional TPU plates. Maximum power, minimum weight.
            </p>
          </div>

          <div className="absolute bottom-8 right-8 hidden sm:block">
            <div className="flex gap-4 speed-skew">
              <div className="bg-surface border border-white/10 px-4 py-2.5 border-l-2 border-primary-container">
                <span className="font-stats-value text-lg text-primary font-bold">165g</span>
                <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase mt-0.5">
                  Total Weight
                </span>
              </div>
              <div className="bg-surface border border-white/10 px-4 py-2.5 border-l-2 border-primary-container">
                <span className="font-stats-value text-lg text-primary font-bold">4.2s</span>
                <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase mt-0.5">
                  40m Sprint Avg
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
