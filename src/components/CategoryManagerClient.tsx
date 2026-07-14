'use client';

import React, { useState } from 'react';
import type { Category } from '@/lib/db';

export default function CategoryManagerClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Name and Slug are required.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      setCategories((prev) => [...prev, data]);
      setName('');
      setSlug('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, catName: string) => {
    const defaultCats = ['men', 'women', 'kit'];
    const isDefault = defaultCats.includes(catName.toLowerCase());
    
    let confirmMsg = `Are you sure you want to delete the "${catName}" category?`;
    if (isDefault) {
      confirmMsg += `\n\nWARNING: "${catName}" is a default system category. Products linked to this category may no longer filter properly in primary shop pages.`;
    }

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    setError('');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      {/* Categories Table / List */}
      <div className="border border-white/10 bg-surface-container-low/20 p-6 md:p-8">
        <h2 className="font-headline-md text-2xl uppercase italic text-primary mb-6">
          Active Categories
        </h2>

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 font-label-caps text-xs">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 px-4">Category Name</th>
                <th className="pb-3 px-4">Slug</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-white/5 font-body-md text-sm text-primary hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 pr-4 text-on-surface-variant/50 font-mono text-xs">{cat.id}</td>
                  <td className="py-4 px-4 font-bold text-primary">{cat.name}</td>
                  <td className="py-4 px-4 font-mono text-xs text-primary-container">{cat.slug}</td>
                  <td className="py-4 pl-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      className="font-label-caps text-[10px] text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === cat.id ? 'DELETING...' : 'DELETE'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="border border-white/10 bg-surface-container-low p-6 h-fit">
        <h2 className="font-headline-md text-xl uppercase italic text-primary mb-6">
          Add Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
              Category Name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              className="w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none transition-colors"
              placeholder="e.g. Kids"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
              Slug
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary font-mono placeholder:text-on-surface-variant/30 focus:border-primary-container focus:outline-none transition-colors"
              placeholder="e.g. kids"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary-container hover:brightness-110 text-black py-3 font-label-caps text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                CREATING...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                CREATE CATEGORY
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
