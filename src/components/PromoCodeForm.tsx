'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PromoCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed' | 'free_item'>('percent');
  const [value, setValue] = useState('');
  const [minSpend, setMinSpend] = useState('0');
  const [appliesTo, setAppliesTo] = useState<'all' | 'specific'>('all');
  const [productIds, setProductIds] = useState('');

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError('');

    try {
      const response = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          value: type === 'free_item' ? 0 : parseFloat(value || '0'),
          min_spend: parseFloat(minSpend || '0'),
          applies_to: appliesTo,
          product_ids: productIds.trim() || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create promo code');
      }

      router.push('/admin/promos');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl border border-white/10 bg-surface-container-low p-8 space-y-6">
      {error && (
        <div className="border border-secondary-container bg-secondary-container/10 p-4 font-label-caps text-xs text-secondary uppercase">
          {error}
        </div>
      )}

      {/* Code */}
      <div className="space-y-2">
        <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
          Promo Code
        </label>
        <input
          required
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none uppercase placeholder:opacity-40"
          placeholder="e.g. APEX20"
        />
        <p className="text-[10px] text-on-surface-variant/50">
          The code code customers enter at checkout. Letters will automatically uppercase.
        </p>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
          Discount Type
        </label>
        <select
          value={type}
          onChange={(e) => {
            const val = e.target.value as any;
            setType(val);
            if (val === 'free_item') {
              setValue('0');
            }
          }}
          className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none"
        >
          <option value="percent">Percentage Discount (%)</option>
          <option value="fixed">Fixed Amount Discount (RM)</option>
          <option value="free_item">Free Item Reward</option>
        </select>
      </div>

      {/* Discount Value */}
      {type !== 'free_item' && (
        <div className="space-y-2">
          <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
            {type === 'percent' ? 'Discount Percentage (%)' : 'Discount Fixed Amount (RM)'}
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none placeholder:opacity-40"
            placeholder={type === 'percent' ? 'e.g. 20 for 20% off' : 'e.g. 50.00 for RM 50 off'}
          />
        </div>
      )}

      {/* Min Spend */}
      <div className="space-y-2">
        <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
          Minimum Spend Requirement (RM)
        </label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={minSpend}
          onChange={(e) => setMinSpend(e.target.value)}
          className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none placeholder:opacity-40"
          placeholder="0.00 for no requirement"
        />
        <p className="text-[10px] text-on-surface-variant/50">
          The minimum cart subtotal required to use this promo code.
        </p>
      </div>

      {/* Applies To */}
      <div className="space-y-2">
        <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
          Scope of Items
        </label>
        <select
          value={appliesTo}
          onChange={(e) => setAppliesTo(e.target.value as any)}
          className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none"
        >
          <option value="all">Apply to All Items / Cart Subtotal</option>
          <option value="specific">Only Apply to Specific Product IDs</option>
        </select>
      </div>

      {/* Product IDs List */}
      {(appliesTo === 'specific' || type === 'free_item') && (
        <div className="space-y-2">
          <label className="block font-label-caps text-[10px] text-on-surface-variant/75 uppercase tracking-wider font-bold">
            {type === 'free_item' ? 'Free Product ID' : 'Target Product IDs (comma-separated)'}
          </label>
          <input
            required
            type="text"
            value={productIds}
            onChange={(e) => setProductIds(e.target.value)}
            className="w-full bg-surface-container border border-white/10 p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all rounded-none placeholder:opacity-40"
            placeholder={type === 'free_item' ? 'e.g. 12' : 'e.g. 1, 2, 3'}
          />
          <p className="text-[10px] text-on-surface-variant/50">
            {type === 'free_item' 
              ? 'Input the ID of the product that will be given for free when using this code.' 
              : 'Enter comma-separated IDs of products that are eligible for this discount.'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex items-center justify-end gap-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => router.push('/admin/promos')}
          className="bg-transparent border border-white/10 px-6 py-4 font-label-caps text-xs text-on-surface hover:bg-white/5 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary-container text-black font-headline-md text-base px-8 py-4 font-bold hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          {pending ? 'Saving...' : 'Save Promo Code'}
        </button>
      </div>
    </form>
  );
}
