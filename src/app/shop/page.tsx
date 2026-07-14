'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [heroProductId, setHeroProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL'); // ALL, men, women, kit
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/shop-hero').then((res) => res.json()).catch(() => null),
      fetch('/api/categories').then((res) => res.json()).catch(() => [])
    ])
      .then(([productsData, heroData, categoriesData]) => {
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
        if (heroData && typeof heroData.productId === 'number') {
          setHeroProductId(heroData.productId);
        }
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load catalog products:', err);
        setLoading(false);
      });
  }, []);

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (activeCategory !== 'ALL' && p.category !== activeCategory) {
      return false;
    }

    // Search query filter
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.colorway.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return true;
  });

  const heroProduct = products.find((p) => p.id === heroProductId) || products[0];

  return (
    <main className="pb-32 bg-background relative min-h-screen">
      {/* Carbon fiber grid overlay */}
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>

      {/* Featured Banner (only displayed when category is ALL or men) */}
      {heroProduct && (activeCategory === 'ALL' || heroProduct.category === activeCategory) && (
        <section className="relative w-full min-h-[60vh] flex items-end overflow-hidden mb-16 select-none animate-fade-in border-b border-white/5">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroProduct.image_url}
              alt={heroProduct.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"></div>
            <div className="absolute inset-0 bg-black/35"></div>
          </div>

          <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop pb-12 flex flex-col items-start max-w-container-max mx-auto">
            <div className="bg-primary-container px-3 py-1 mb-4 select-none">
              <span className="font-label-caps text-[10px] text-black tracking-widest font-black uppercase">
                FEATURED PRO-CLEAT
              </span>
            </div>
            
            <h1 className="font-display-hero text-4xl sm:text-5xl md:text-7xl uppercase leading-none mb-4 italic tracking-wide text-primary">
              {heroProduct.name.split(' ')[0]} {heroProduct.name.split(' ')[1]} <span className="text-primary-container">{heroProduct.name.split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="max-w-xl font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
              {heroProduct.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => addToCart(heroProduct, '10.5')}
                className="bg-primary-container hover:bg-white text-black px-6 py-3 font-label-caps text-xs font-black tracking-wider uppercase transition-colors active:scale-95 cursor-pointer"
              >
                DEPLOY SIZE 10.5 — RM {heroProduct.price}
              </button>
              <Link
                href={`/product/${heroProduct.slug}`}
                className="border border-white/10 hover:border-white/30 text-primary px-6 py-3 font-label-caps text-xs font-bold tracking-wider uppercase transition-colors"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Filter & Search Control Panel */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 pt-16">
        
        {/* Title */}
        <div className="mb-10">
          <p className="font-label-caps text-xs text-primary-container tracking-widest uppercase">Apex Dispatch Catalog</p>
          <h2 className="mt-2 font-headline-lg text-4xl md:text-5xl uppercase italic text-primary leading-none">
            {activeCategory === 'ALL' ? 'ALL PRODUCTS' : `${activeCategory.toUpperCase()}'S GEAR`}
          </h2>
        </div>

        {/* Filter Toolbar */}
        <div className="border-y border-white/10 py-6 mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 border transition-all font-label-caps text-xs cursor-pointer ${
                activeCategory === 'ALL'
                  ? 'border-primary-container bg-primary-container text-black font-black'
                  : 'border-white/10 text-on-surface-variant hover:border-white/30'
              }`}
            >
              ALL GEAR
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setSearchQuery('');
                }}
                className={`px-5 py-2.5 border transition-all font-label-caps text-xs cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'border-primary-container bg-primary-container text-black font-black'
                    : 'border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
              >
                {cat.slug === 'men' || cat.slug === 'women'
                  ? `${cat.name.toUpperCase()}'S BOOTS`
                  : cat.slug === 'kit'
                    ? 'KITS & EQUIPMENT'
                    : `${cat.name.toUpperCase()} GEAR`}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full lg:max-w-sm">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="SEARCH CATALOG OR COLORWAYS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border border-white/10 pl-11 pr-4 py-3 font-label-caps text-xs tracking-widest text-primary placeholder-on-surface-variant/40 w-full focus:outline-none focus:border-primary-container transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="font-label-caps text-xs text-on-surface-variant tracking-widest animate-pulse">
              SYNCING WITH APEX DATA CORE...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="border border-dashed border-white/10 py-24 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4">inventory_2</span>
            <p className="font-headline-md text-xl uppercase italic text-on-surface-variant mb-2">No matching items found</p>
            <p className="text-xs text-on-surface-variant/60 font-body-md max-w-md px-4">
              Your telemetry coordinates did not return matching catalog profiles. Clear filters or search queries to retry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
