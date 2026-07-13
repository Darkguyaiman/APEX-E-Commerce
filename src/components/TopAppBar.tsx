'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const TopAppBar: React.FC = () => {
  const { getCartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking database grid...'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check connection status from our API
    fetch('/api/db-status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => setDbStatus({ connected: false, message: 'Local Mock Database Fallback' }));
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-surface/60 dark:bg-surface/60 backdrop-blur-xl text-primary dark:text-primary docked full-width top-0 sticky border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 z-50 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="material-symbols-outlined hover:opacity-80 transition-opacity active:scale-95 duration-150 md:hidden"
        >
          menu
        </button>
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
      <nav className="hidden md:flex gap-8 items-center">
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/"
        >
          HOME
        </Link>
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/shop/men') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/shop/men"
        >
          SHOP MEN
        </Link>
        <Link
          className={`font-label-caps text-label-caps tracking-widest transition-all ${isActive('/shop/women') ? 'text-primary border-b border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary'
            }`}
          href="/shop/women"
        >
          SHOP WOMEN
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

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 flex flex-col p-8 gap-6 md:hidden border-t border-white/5 animate-fade-in">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className={`font-headline-md text-headline-md uppercase italic ${isActive('/') ? 'text-primary-container' : 'text-primary'}`}
            href="/"
          >
            HOME
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className={`font-headline-md text-headline-md uppercase italic ${isActive('/shop/men') ? 'text-primary-container' : 'text-primary'}`}
            href="/shop/men"
          >
            MEN'S COLLECTION
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className={`font-headline-md text-headline-md uppercase italic ${isActive('/shop/women') ? 'text-primary-container' : 'text-primary'}`}
            href="/shop/women"
          >
            WOMEN'S COLLECTION
          </Link>

          {/* Mobile db status indicator */}
          <div className="mt-auto flex items-center gap-2 bg-surface-container py-3 px-4 border border-white/5">
            <span className={`w-2.5 h-2.5 rounded-full ${dbStatus.connected ? 'bg-primary-container animate-pulse' : 'bg-secondary-container'}`}></span>
            <span className="font-label-caps text-[10px] text-on-surface">
              {dbStatus.message}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
