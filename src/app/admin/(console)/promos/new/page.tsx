import React from 'react';
import PromoCodeForm from '@/components/PromoCodeForm';

export default function AdminNewPromoPage() {
  return (
    <div className="px-margin-mobile py-10 md:px-10 space-y-8">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-4xl uppercase italic tracking-tight leading-none text-primary">
          NEW PROMO CODE
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant/80 mt-2">
          Configure a new discount code rule, minimum spend, or reward item.
        </p>
      </div>

      <PromoCodeForm />
    </div>
  );
}
