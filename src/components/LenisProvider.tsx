'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();

  // Exclude the checkout page from the smooth scroll behavior
  const isCheckout = pathname ? pathname.startsWith('/checkout') : false;

  if (isCheckout) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
