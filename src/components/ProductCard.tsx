'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
}

const SIZES = ['7.5', '8.5', '9.5', '10.5', '11.5'];

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);

  const handleSelectSize = (size: string) => {
    addToCart(product, size);
    setShowSizes(false);
  };

  return (
    <div 
      className="glass-card group relative flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:electric-glow h-full min-h-[460px]"
      onMouseLeave={() => setShowSizes(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View ${product.name}`}
      />
      <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>

      {/* Product Image Area */}
      <div className="relative h-80 overflow-hidden bg-surface-container-low p-8 flex items-center justify-center select-none">
        <div className="w-full h-full relative block pointer-events-none">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>

        {/* Dynamic Category Badge */}
        {product.type_chip && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-surface-container/85 backdrop-blur px-3 py-1 border-l-2 border-primary-container">
              <span className="font-label-caps text-[9px] tracking-widest text-primary font-bold uppercase">
                {product.type_chip}
              </span>
            </div>
          </div>
        )}

        {/* Quick Size Picker Overlay */}
        {showSizes ? (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-md p-6 flex flex-col justify-center items-center z-20 animate-fade-in">
            <h4 className="font-label-caps text-[10px] text-primary-container mb-3 tracking-widest uppercase">
              SELECT PERFORMANCE SIZE
            </h4>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSelectSize(size)}
                  className="relative z-30 h-10 border border-white/10 font-label-caps text-xs text-primary hover:bg-primary-container hover:text-black transition-colors cursor-pointer"
                >
                  US {size}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSizes(false)}
              className="relative z-30 mt-4 font-label-caps text-[10px] text-on-surface-variant underline hover:text-white cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSizes(true)}
            className="absolute bottom-4 right-4 bg-primary-container w-10 h-10 flex items-center justify-center text-on-background active:scale-90 hover:brightness-110 transition-all cursor-pointer z-30"
            title="Add cleat to cart"
          >
            <span className="material-symbols-outlined text-black font-bold">add</span>
          </button>
        )}
      </div>

      {/* Info Description */}
      <div className="p-6 flex-1 flex flex-col justify-between relative bg-surface-container-low/20">
        <div>
          <div className="flex justify-between items-start mb-2 gap-4">
            <div className="transition-colors group-hover:text-primary-container">
              <h3 className="font-headline-md text-xl uppercase italic tracking-tight leading-none">
                {product.name}
              </h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-stats-value text-stats-value text-primary-container leading-none">
                RM {Number(product.price).toFixed(2).replace(/\.00$/, '')}
              </span>
              {product.original_price && (
                <span className="text-[10px] text-on-surface-variant line-through mt-1">
                  RM {Number(product.original_price).toFixed(2).replace(/\.00$/, '')}
                </span>
              )}
            </div>
          </div>
          <p className="font-label-caps text-[10px] text-on-surface-variant/70 mb-4 uppercase">
            {product.traction_type} / {product.colorway}
          </p>
        </div>

        {/* Feature Tags list */}
        {product.tags && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {product.tags.split(',').map((tag) => (
              <span key={tag} className="text-[9px] bg-white/5 px-2 py-0.5 font-label-caps text-on-surface-variant">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
