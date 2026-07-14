'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

export default function WomenShop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, FG, SG
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/products?category=women')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load women products:', err);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Filter logic
  const filteredProducts = products.filter((p) => {
    // Avoid showing the hero product in the grid
    if (p.slug === 'nike-womens-phantom-luna-ii-elite-fg') return false;

    // Pitch filter
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'FG' && !p.traction_type.includes('FG')) return false;
      if (activeFilter === 'SG' && !p.traction_type.includes('SG')) return false;
    }

    return true;
  });

  const heroProduct = products.find((p) => p.slug === 'nike-womens-phantom-luna-ii-elite-fg') || products[0];

  const scrollTech = () => {
    const techSection = document.getElementById('fit-technology');
    if (techSection) {
      techSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative bg-background min-h-screen">
      {/* Hero Section */}
      {heroProduct && (
        <section className="relative w-full h-[85vh] overflow-hidden flex items-center select-none animate-fade-in">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/collection-womens.jpg"
              alt="Women professional soccer cleats background"
              fill
              priority
              className="object-cover object-center scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-12 bg-primary-container"></span>
                <p className="font-label-caps text-xs text-primary-container tracking-widest uppercase font-bold">
                  {heroProduct.type_chip || "WOMEN'S ELITE PERFORMANCE"}
                </p>
              </div>
              <h1 className="font-display-hero text-6xl md:text-[90px] italic leading-none text-primary uppercase font-black">
                CRIMSON <span className="text-neon-crimson">AGILITY</span>
              </h1>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg">
                {heroProduct.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => addToCart(heroProduct, '8.5')}
                  className="bg-primary-container text-black font-headline-md text-base px-10 py-4 flex items-center gap-2 group hover:brightness-110 transition-all active:scale-95 cursor-pointer"
                >
                  SHOP THE LINE
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform font-bold">
                    chevron_right
                  </span>
                </button>
                <button
                  onClick={scrollTech}
                  className="border border-white/20 backdrop-blur-md text-primary font-headline-md text-base px-10 py-4 hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                >
                  VIEW FIT TECH
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 right-margin-mobile hidden sm:flex flex-col items-center gap-4 select-none">
            <span className="font-label-caps text-[9px] [writing-mode:vertical-lr] tracking-widest text-on-surface-variant/40">
              SCROLL DOWN
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-primary-container to-transparent"></div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop carbon-pattern relative">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 select-none">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase italic mb-2 leading-none text-primary">
                APEX <span className="text-neon-crimson">COLLECTION</span>
              </h2>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant/70">
                Specialized performance cleats optimized for her game.
              </p>
            </div>
            
            {/* Quick selectors */}
            <div className="flex gap-4">
              <div className="flex bg-surface-container rounded-full p-1 border border-white/5">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-6 py-2 rounded-full font-label-caps text-[10px] transition-all cursor-pointer ${
                    activeFilter === 'ALL'
                      ? 'bg-primary-container text-black font-bold'
                      : 'text-on-surface-variant/70 hover:text-white'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setActiveFilter('FG')}
                  className={`px-6 py-2 rounded-full font-label-caps text-[10px] transition-all cursor-pointer ${
                    activeFilter === 'FG'
                      ? 'bg-primary-container text-black font-bold'
                      : 'text-on-surface-variant/70 hover:text-white'
                  }`}
                >
                  FG
                </button>
                <button
                  onClick={() => setActiveFilter('SG')}
                  className={`px-6 py-2 rounded-full font-label-caps text-[10px] transition-all cursor-pointer ${
                    activeFilter === 'SG'
                      ? 'bg-primary-container text-black font-bold'
                      : 'text-on-surface-variant/70 hover:text-white'
                  }`}
                >
                  SG
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-2 border-primary-container/20 border-t-primary-container rounded-full animate-spin"></div>
              <p className="font-label-caps text-xs text-on-surface-variant animate-pulse">LOADING LOCKERS...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fit Technology Hotspots Breakdown */}
      <section id="fit-technology" className="relative py-32 bg-surface-container-lowest overflow-hidden">
        <div className="absolute -left-20 top-0 w-96 h-96 bg-neon-crimson/5 blur-[120px]"></div>
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-primary-container/5 blur-[120px]"></div>
        
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Interactive hotspot picture */}
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 glass-card p-1 border border-white/10 select-none">
              <div className="relative w-full aspect-[4/3] bg-surface-container-high/50">
                <Image
                  src="/images/tech-anatomical-fit.jpg"
                  alt="Anatomical mapping design grid for soccer cleat"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Hotspot 1: Lockdown Heel */}
            <div 
              className="absolute top-[20%] right-[15%] z-20 group cursor-pointer"
              onMouseEnter={() => setActiveHotspot('heel')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(activeHotspot === 'heel' ? null : 'heel')}
            >
              <div className="w-4 h-4 bg-primary-container rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-primary-container rounded-full relative"></div>
              <div className={`absolute left-6 top-0 w-48 glass-card p-4 translate-y-[-50%] transition-opacity duration-200 shadow-xl ${
                activeHotspot === 'heel' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                <p className="font-label-caps text-[10px] text-primary-container mb-1 font-bold">LOCKDOWN HEEL</p>
                <p className="text-[11px] text-white/95 leading-normal">
                  Anatomically contoured heel cup prevents slippage during high-speed explosive cuts.
                </p>
              </div>
            </div>

            {/* Hotspot 2: React Cushioning */}
            <div 
              className="absolute bottom-[25%] left-[30%] z-20 group cursor-pointer"
              onMouseEnter={() => setActiveHotspot('react')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(activeHotspot === 'react' ? null : 'react')}
            >
              <div className="w-4 h-4 bg-neon-crimson rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-neon-crimson rounded-full relative"></div>
              <div className={`absolute left-6 top-0 w-48 glass-card p-4 translate-y-[-50%] transition-opacity duration-200 shadow-xl ${
                activeHotspot === 'react' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                <p className="font-label-caps text-[10px] text-neon-crimson mb-1 font-bold">REACT MIDSOLE</p>
                <p className="text-[11px] text-white/95 leading-normal">
                  Energy return foam calibrated specifically for agility and speed spring support.
                </p>
              </div>
            </div>

            {/* Hotspot 3: Sens-Touch Upper */}
            <div 
              className="absolute top-[35%] left-[45%] z-20 group cursor-pointer"
              onMouseEnter={() => setActiveHotspot('upper')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(activeHotspot === 'upper' ? null : 'upper')}
            >
              <div className="w-4 h-4 bg-primary-container rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-primary-container rounded-full relative"></div>
              <div className={`absolute left-6 top-0 w-48 glass-card p-4 translate-y-[-50%] transition-opacity duration-200 shadow-xl ${
                activeHotspot === 'upper' ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                <p className="font-label-caps text-[10px] text-primary-container mb-1 font-bold">SENS-TOUCH UPPER</p>
                <p className="text-[11px] text-white/95 leading-normal">
                  Micro-textured polymer skin layout provides ultimate ball control friction.
                </p>
              </div>
            </div>
          </div>

          {/* Technology text list */}
          <div className="space-y-12 order-1 lg:order-2">
            <div>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg italic uppercase leading-none mb-6 text-primary">
                PRECISION <span className="text-neon-crimson">FIT</span> TECHNOLOGY
              </h2>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed">
                Built from the ground up on a woman's anatomical last. This isn't a scaled-down men's cleat; it's a completely engineered performance matrix.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-white/10 select-none">
                    <span className="material-symbols-outlined text-primary-container">footprint</span>
                  </div>
                  <h4 className="font-headline-md text-xl italic text-primary uppercase">ANATOMICAL LAST</h4>
                </div>
                <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                  Contoured to match female bio-mechanics with a narrower heel cradle and adjusted arch support.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-white/10 select-none">
                    <span className="material-symbols-outlined text-primary-container">bolt</span>
                  </div>
                  <h4 className="font-headline-md text-xl italic text-primary uppercase">REACT CUSHIONING</h4>
                </div>
                <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                  Energy return elements calibrated specifically for athletic loading, maximizing spring off the turf.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-white/10 select-none">
                    <span className="material-symbols-outlined text-primary-container">grid_view</span>
                  </div>
                  <h4 className="font-headline-md text-xl italic text-primary uppercase">MULTI-STUD</h4>
                </div>
                <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                  Optimized stud density layout distributes pressure evenly to reduce rotational stress injuries.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container border border-white/10 select-none">
                    <span className="material-symbols-outlined text-primary-container">texture</span>
                  </div>
                  <h4 className="font-headline-md text-xl italic text-primary uppercase">SENS-TOUCH</h4>
                </div>
                <p className="text-on-surface-variant/80 text-sm leading-relaxed">
                  Engineered outer touch layer delivers high friction index on the ball in wet conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crimson Skew Access CTA Section */}
      <section className="relative bg-neon-crimson py-24 skew-section overflow-hidden select-none">
        <div className="absolute inset-0 carbon-pattern opacity-20 pointer-events-none"></div>
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-margin-mobile flex flex-col items-center">
          <h2 className="font-display-hero text-4xl sm:text-6xl md:text-7xl italic text-black leading-none uppercase font-black">
            JOIN THE ELITE ROSTER
          </h2>
          <p className="font-body-lg text-base md:text-lg text-black/80 font-bold max-w-xl">
            Get priority dispatch access to new inventory cycles, custom size alerts, and elite lab tests.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center max-w-lg">
            <input
              className="bg-black/10 border-2 border-black/25 text-black placeholder:text-black/40 font-label-caps text-xs px-6 py-4.5 w-full sm:w-96 focus:outline-none focus:border-black transition-colors"
              placeholder="ENTER YOUR EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-black text-white font-headline-md text-base px-10 py-4.5 hover:opacity-90 active:scale-95 transition-all w-full sm:w-auto cursor-pointer font-bold select-none text-center"
            >
              {subscribed ? 'CONFIRMED' : 'SECURE ACCESS'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
