'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/db';

interface CategoryListTableProps {
  initialCategories: Category[];
}

export default function CategoryListTable({ initialCategories }: CategoryListTableProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteCategory = async (id: number, name: string) => {
    const defaultCats = ['men', 'women', 'kit'];
    const isDefault = defaultCats.includes(name.toLowerCase());
    
    let confirmMsg = `Are you absolutely sure you want to delete the category "${name}"? This action cannot be undone.`;
    if (isDefault) {
      confirmMsg += `\n\nWARNING: "${name}" is a default system category. Products linked to it may no longer filter properly in the shop page.`;
    }

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete category');
      }

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 select-none whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-surface-container-low">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/50">
                    {cat.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-12 overflow-hidden border border-white/10 bg-black">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={`${cat.name} category`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-on-surface-variant/40">
                          <span className="material-symbols-outlined text-base">image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-container">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2 justify-end">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="inline-flex items-center justify-center border border-white/15 p-2 text-primary transition-colors hover:bg-white/10"
                        title="Edit Category"
                      >
                        <span className="material-symbols-outlined text-sm block">edit</span>
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === cat.id}
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="inline-flex items-center justify-center border border-secondary-container p-2 text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-50 cursor-pointer"
                        title={deletingId === cat.id ? 'Deleting...' : 'Delete Category'}
                      >
                        <span className="material-symbols-outlined text-sm block">delete</span>
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
