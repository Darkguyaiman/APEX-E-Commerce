'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/db';

interface ProductListTableProps {
  initialProducts: Product[];
  initialShopHeroProductId: number | null;
}

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';

export default function ProductListTable({ initialProducts, initialShopHeroProductId }: ProductListTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [shopHeroProductId, setShopHeroProductId] = useState(initialShopHeroProductId);
  const [settingHeroId, setSettingHeroId] = useState<number | null>(null);
  const [heroStatus, setHeroStatus] = useState('');

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete product');
      }

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetShopHero = async (product: Product) => {
    setSettingHeroId(product.id);
    setHeroStatus('');

    try {
      const response = await fetch('/api/shop-hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not update shop hero');
      }

      setShopHeroProductId(product.id);
      setHeroStatus(`${product.name} is now the shop hero.`);
    } catch (err: unknown) {
      setHeroStatus(err instanceof Error ? err.message : 'Could not update shop hero.');
    } finally {
      setSettingHeroId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) => {
      return [product.name, product.slug, product.category, product.colorway]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [products, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <div className="relative">
            <input
              id="product-search"
              className={`${fieldClass} pr-11`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products by name, category, or colorway..."
            />
            <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant">search</span>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 select-none whitespace-nowrap self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Product
        </Link>
      </div>

      <div className="border border-white/10 bg-surface-container-low px-4 py-3">
        <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
          Shop hero product
        </p>
        <p className="mt-1 text-sm text-primary">
          {products.find((product) => product.id === shopHeroProductId)?.name || 'No hero product selected.'}
        </p>
        {heroStatus && (
          <p className="mt-1 text-xs text-on-surface-variant">{heroStatus}</p>
        )}
      </div>

      <div className="overflow-x-auto border border-white/10 bg-surface-container-low">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Hero</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Traction</th>
              <th className="px-6 py-4">Weight</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                      {product.name}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant font-medium">
                      {product.colorway}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {shopHeroProductId === product.id ? (
                      <span className="inline-flex items-center gap-1.5 bg-primary-container px-2.5 py-1 font-label-caps text-[10px] font-bold uppercase text-black">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={settingHeroId === product.id}
                        onClick={() => handleSetShopHero(product)}
                        className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1 font-label-caps text-[10px] uppercase text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {settingHeroId === product.id ? 'sync' : 'bolt'}
                        </span>
                        {settingHeroId === product.id ? 'Setting' : 'Set hero'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {product.traction_type}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {product.weight_grams}
                  </td>
                  <td className="px-6 py-4 font-stats-value text-lg text-primary-container">
                    RM {Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2 justify-end">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center justify-center border border-white/15 p-2 text-primary transition-colors hover:bg-white/10"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-sm block">edit</span>
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === product.id}
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="inline-flex items-center justify-center border border-secondary-container p-2 text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-50 cursor-pointer"
                        title={deletingId === product.id ? 'Deleting...' : 'Delete Product'}
                      >
                        <span className="material-symbols-outlined text-sm block">
                          {deletingId === product.id ? 'sync' : 'delete'}
                        </span>
                      </button>
                    </div>
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
