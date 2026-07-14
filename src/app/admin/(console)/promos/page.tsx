import React from 'react';
import { getPromoCodes } from '@/lib/db';
import PromoCodeListTable from '@/components/PromoCodeListTable';

export default async function AdminPromosPage() {
  const promos = await getPromoCodes();

  return (
    <div className="px-margin-mobile py-10 md:px-10 space-y-8">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-4xl uppercase italic tracking-tight leading-none text-primary">
          PROMO CODES
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant/80 mt-2">
          Create and manage discount codes, spend requirements, and reward rules.
        </p>
      </div>

      <PromoCodeListTable initialPromos={promos} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
