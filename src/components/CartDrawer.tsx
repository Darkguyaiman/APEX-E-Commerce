'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, getCartSubtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md h-full bg-surface-container-low border-l border-white/10 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
        <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center relative">
          <div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase italic tracking-tighter">
              BATTLE KIT CART
            </h3>
            <p className="font-label-caps text-[10px] text-on-surface-variant/70">
              PREPARED FOR DEPLOYMENT
            </p>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-90 p-2 cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                shopping_cart
              </span>
              <p className="font-headline-md text-headline-md uppercase italic text-on-surface-variant/80">
                CART IS EMPTY
              </p>
              <p className="font-body-md text-sm text-on-surface-variant/50 max-w-[200px]">
                Deploy items to your locker from the Men's or Women's collection.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="bg-primary text-background font-label-caps text-label-caps px-6 py-3 uppercase hover:bg-primary-container hover:text-background transition-colors mt-2 cursor-pointer"
              >
                RETURN TO SHOP
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="flex gap-4 p-4 glass-panel relative overflow-hidden group"
              >
                <div className="w-20 h-20 bg-surface-container-high/50 border border-white/5 flex-shrink-0 relative overflow-hidden">
                  <Image 
                    src={item.image_url} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline-md text-base leading-tight uppercase italic text-primary">
                        {item.name}
                      </h4>
                      <p className="font-label-caps text-[9px] text-on-surface-variant/60 mt-1 uppercase">
                        Size: {item.size} | {item.colorway || item.category}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="material-symbols-outlined text-on-surface-variant/40 hover:text-secondary-container transition-colors text-lg cursor-pointer"
                    >
                      delete
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    {/* Qty selectors */}
                    <div className="flex items-center bg-surface border border-white/10">
                      <button 
                        onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                        className="px-2.5 py-1 text-on-surface-variant/60 hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-label-caps text-xs text-primary font-bold">
                        {String(item.qty).padStart(2, '0')}
                      </span>
                      <button 
                        onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                        className="px-2.5 py-1 text-on-surface-variant/60 hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-stats-value text-stats-value text-primary-container">
                      RM {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer/Checkout Commitment */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-surface-container-lowest/80 relative">
            <div className="flex justify-between items-baseline mb-6 font-label-caps text-label-caps">
              <span className="text-on-surface-variant/70">TOTAL COMMITMENT</span>
              <span className="font-stats-value text-xl text-primary-container">
                RM {getCartSubtotal().toFixed(2)}
              </span>
            </div>

            <Link 
              href="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-primary-container text-on-primary-container h-14 flex items-center justify-between px-6 font-headline-md text-headline-md hover:brightness-110 active:scale-[0.98] transition-all group"
            >
              <span className="uppercase font-black">SECURE CHECKOUT</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                  chevron_right
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
