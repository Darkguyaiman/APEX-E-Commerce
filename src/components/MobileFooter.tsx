'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

const MobileFooter: React.FC = () => {
  const pathname = usePathname();
  const isTabActive = (paths: string[]) => paths.some(path => pathname === path);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already standalone (app installed and running)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // 2. Check if dismissed before
    const isDismissed = localStorage.getItem('apex-install-dismissed') === 'true';

    if (isStandalone) {
      return;
    }

    // 3. Handle beforeinstallprompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. For iOS devices, beforeinstallprompt won't fire, but we can still show the banner
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS && !isStandalone && !isDismissed) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        setShowIOSInstructions(true);
      } else {
        alert('To install Apex, please tap your browser menu (e.g. three dots or share) and select "Add to Home Screen" or "Install App".');
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('apex-install-dismissed', 'true');
    setShowBanner(false);
  };

  return (
    <>
      {/* Install App Banner (sits above bottom nav) */}
      {showBanner && (
        <div className="fixed bottom-[88px] left-4 right-4 z-40 md:hidden bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-fade-in transition-all duration-300">
          {/* Logo */}
          <img 
            src="/apex-logo.png" 
            alt="Apex Logo" 
            className="w-10 h-10 object-contain rounded-xl shadow-lg shrink-0"
          />
          
          {/* Content & Button Column */}
          <div className="flex-1 flex flex-col gap-2.5">
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Install Apex App</h4>
              <p className="text-[11px] text-on-surface-variant/80 font-medium">Get the elite football gear experience</p>
            </div>
            
            <button 
              onClick={handleInstallClick}
              className="bg-primary-container text-black font-label-caps text-[10px] font-bold px-3 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer text-center w-full"
            >
              INSTALL
            </button>
          </div>
          
          {/* Dismiss button */}
          <button 
            onClick={handleDismiss}
            className="text-on-surface-variant/60 hover:text-on-surface p-1 rounded-full active:scale-95 transition-all cursor-pointer self-start -mt-1 -mr-1"
            aria-label="Close install prompt"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>
      )}

      {/* iOS Instructions Sheet */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setShowIOSInstructions(false)}>
          <div 
            className="bg-surface border-t border-white/10 rounded-t-3xl w-full p-6 pb-10 space-y-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-on-surface font-headline-lg tracking-wide uppercase">Install on iOS</h3>
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="text-on-surface-variant/60 p-1 hover:bg-white/5 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant">Install Apex on your device to launch it as a full-screen application from your home screen.</p>
            <ol className="space-y-4 text-sm text-on-surface">
              <li className="flex items-start gap-3">
                <span className="bg-surface-variant text-on-surface-variant w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <span>Tap the <strong className="text-primary-container">Share</strong> button in the Safari toolbar at the bottom of the screen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-surface-variant text-on-surface-variant w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <span>Scroll down and select <strong className="text-primary-container">Add to Home Screen</strong>.</span>
              </li>
            </ol>
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="w-full bg-primary-container text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] font-label-caps text-xs cursor-pointer shadow-lg"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

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
            isTabActive(['/shop', '/shop/men', '/shop/women']) || (pathname && pathname.startsWith('/product/')) ? 'text-primary-container font-bold scale-110' : 'text-on-surface-variant/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">sports_soccer</span>
          <span className="font-label-caps text-label-caps mt-1">SHOP</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center transition-all active:scale-95 duration-100 ${
            pathname === '/profile' || pathname === '/orders' || pathname === '/login' || pathname === '/signup' ? 'text-primary-container font-bold scale-110' : 'text-on-surface-variant/60 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-caps text-label-caps mt-1">PROFILE</span>
        </Link>
        <ThemeToggle
          className="flex-col text-on-surface-variant/60 hover:text-primary"
        />
      </nav>
    </>
  );
};

export default MobileFooter;
