'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopAppBar from '@/components/TopAppBar';
import Footer from '@/components/Footer';
import MobileFooter from '@/components/MobileFooter';
import CartDrawer from '@/components/CartDrawer';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  
  // Check if the current route is part of the admin panel
  const isAdmin = pathname ? pathname.startsWith('/admin') : false;

  if (isAdmin) {
    return (
      <main className="flex-1 w-full relative">
        {children}
      </main>
    );
  }

  return (
    <>
      <TopAppBar />
      <CartDrawer />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
      <MobileFooter />
    </>
  );
}
