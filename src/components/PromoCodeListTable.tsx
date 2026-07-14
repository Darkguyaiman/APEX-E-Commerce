'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PromoCode } from '@/lib/db';

interface PromoCodeListTableProps {
  initialPromos: PromoCode[];
}

export default function PromoCodeListTable({ initialPromos }: PromoCodeListTableProps) {
  const [promos, setPromos] = useState(initialPromos);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeletePromo = async (id: number, code: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the promo code "${code}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/promos/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete promo code');
      }

      setPromos(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Could not delete promo code');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/admin/promos/new"
          className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 select-none whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Promo Code
        </Link>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-surface-container-low">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Promo Code</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Discount Value</th>
              <th className="px-6 py-4">Min Spend</th>
              <th className="px-6 py-4">Applies To</th>
              <th className="px-6 py-4">Target Product IDs</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {promos.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant">
                  No promo codes found.
                </td>
              </tr>
            ) : (
              promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/50">
                    {promo.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                      {promo.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {promo.type === 'percent' && 'Percent Discount'}
                    {promo.type === 'fixed' && 'Fixed Amount'}
                    {promo.type === 'free_item' && 'Free Item'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-container">
                    {promo.type === 'percent' && `${promo.value}%`}
                    {promo.type === 'fixed' && `RM ${promo.value}`}
                    {promo.type === 'free_item' && 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                    RM {promo.min_spend}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {promo.applies_to === 'all' ? 'All Items' : 'Specific Items'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-container max-w-[150px] truncate">
                    {promo.product_ids || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      disabled={deletingId === promo.id}
                      onClick={() => handleDeletePromo(promo.id, promo.code)}
                      className="inline-flex items-center justify-center border border-secondary-container p-2 text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-50 cursor-pointer"
                      title={deletingId === promo.id ? 'Deleting...' : 'Delete Promo Code'}
                    >
                      <span className="material-symbols-outlined text-sm block">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
