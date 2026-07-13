'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const TopAppBar: React.FC = () => {
  const { getCartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="hidden md:flex bg-surface/60 dark:bg-surface/60 backdrop-blur-xl text-primary dark:text-primary docked full-width top-0 sticky border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] justify-between items-center w-full px-margin-desktop h-16 z-50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 select-none">
          <Image
            src="/apex-logo.png"
            alt="Apex Logo"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg object-contain shadow-md"
            priority
          />
          <span className="font-headline-lg-mobile text-2xl md:text-3xl italic font-black text-primary tracking-tighter leading-none">
            APEX
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex gap-8 items-center">
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/"
        >
          HOME
        </Link>
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${pathname === '/shop' || pathname.startsWith('/shop/') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/shop"
        >
          SHOP
        </Link>
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/about') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/about"
        >
          ABOUT
        </Link>
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/membership') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/membership"
        >
          MEMBERSHIP
        </Link>
      </nav>

      {/* Cart Counter Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsCartOpen(true)}
          className="material-symbols-outlined relative hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 cursor-pointer"
        >
          shopping_cart
          {getCartCount() > 0 && (
            <span className="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[9px] font-bold font-label-caps rounded-full w-4.5 h-4.5 flex items-center justify-center animate-bounce shadow-md">
              {getCartCount()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopAppBar;
