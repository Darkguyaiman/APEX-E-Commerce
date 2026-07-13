'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileFooter: React.FC = () => {
  const pathname = usePathname();
  const isTabActive = (paths: string[]) => paths.some(path => pathname === path);

  const handleAlert = (feature: string) => {
    alert(`${feature} grid interface synchronized in next update.`);
  };

  return (
    <>
      {/* Spacer for bottom navbar padding on mobile */}
      <div className="h-24 md:hidden"></div>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/85 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex justify-around items-center px-4 pb-6 pt-3 md:hidden">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-100 ${
            pathname === '/' ? 'text-primary-container font-bold scale-110' : 'text-on-surface-variant/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">HOME</span>
        </Link>
        <Link 
          href="/shop" 
          className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-100 ${
            isTabActive(['/shop', '/shop/men', '/shop/women']) ? 'text-primary-container font-bold scale-110' : 'text-on-surface-variant/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">sports_soccer</span>
          <span className="font-label-caps text-label-caps mt-1">SHOP</span>
        </Link>
        <button 
          onClick={() => handleAlert('FIT')}
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-all active:scale-95 duration-100 cursor-pointer"
        >
          <span className="material-symbols-outlined">straighten</span>
          <span className="font-label-caps text-label-caps mt-1">FIT</span>
        </button>
        <button 
          onClick={() => handleAlert('PROFILE')}
          className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-all active:scale-95 duration-100 cursor-pointer"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-caps text-label-caps mt-1">PROFILE</span>
        </button>
      </nav>
    </>
  );
};

export default MobileFooter;
