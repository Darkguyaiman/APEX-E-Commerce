'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/lib/db';

type CategoryFormState = {
  id?: number;
  name: string;
  slug: string;
};

const emptyCategoryForm: CategoryFormState = {
  name: '',
  slug: ''
};

function categoryToForm(cat: Category): CategoryFormState {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  };
}

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container focus:outline-none';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

interface CategoryFormProps {
  initialCategory?: Category;
}

export default function CategoryForm({ initialCategory }: CategoryFormProps) {
  const router = useRouter();
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(
    initialCategory ? categoryToForm(initialCategory) : emptyCategoryForm
  );
  const [categoryStatus, setCategoryStatus] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  function updateCategoryField(field: keyof CategoryFormState, value: string) {
    setCategoryForm((currentForm) => {
      if (field === 'name' && !currentForm.id) {
        const generatedSlug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        return { ...currentForm, name: value, slug: generatedSlug };
      }
      return { ...currentForm, [field]: value };
    });
  }

  async function handleDeleteCategory() {
    const name = categoryForm.name;
    const defaultCats = ['men', 'women', 'kit'];
    const isDefault = defaultCats.includes(name.toLowerCase());
    
    let confirmMsg = `Are you absolutely sure you want to delete this category? This action cannot be undone.`;
    if (isDefault) {
      confirmMsg += `\n\nWARNING: "${name}" is a default system category. Products linked to it may no longer filter properly in the shop page.`;
    }

    if (!confirm(confirmMsg)) return;
    
    setIsDeletingCategory(true);
    setCategoryStatus('');

    try {
      const response = await fetch(`/api/categories/${categoryForm.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete category');
      }

      setCategoryStatus('Category deleted.');
      
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setCategoryStatus(error instanceof Error ? error.message : 'Could not delete category.');
    } finally {
      setIsDeletingCategory(false);
    }
  }

  async function saveCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingCategory(true);
    setCategoryStatus('');

    try {
      const isEditing = Boolean(categoryForm.id);
      const endpoint = isEditing ? `/api/categories/${categoryForm.id}` : '/api/categories';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save category');
      }

      setCategoryStatus(isEditing ? 'Category updated.' : 'Category created.');
      
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setCategoryStatus(error instanceof Error ? error.message : 'Could not save category.');
    } finally {
      setIsSavingCategory(false);
    }
  }

  const isEditing = Boolean(categoryForm.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="font-label-caps text-xs text-primary-container tracking-widest">
            {isEditing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
          </p>
          <h1 className="mt-2 font-headline-lg text-4xl uppercase italic leading-none text-primary md:text-5xl">
            {isEditing ? `Edit: ${initialCategory?.name}` : 'Create Category'}
          </h1>
        </div>

        {isEditing && (
          <button
            type="button"
            disabled={isDeletingCategory || isSavingCategory}
            onClick={handleDeleteCategory}
            className="flex items-center gap-2 border border-secondary-container px-4 py-2.5 font-label-caps text-[10px] font-bold text-secondary transition-all hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Delete Category
          </button>
        )}
      </div>

      <form onSubmit={saveCategory} className="grid gap-6 md:grid-cols-2 border border-white/10 bg-surface-container-low p-6 md:p-10">
        <label className="space-y-2">
          <span className={labelClass}>Category Name</span>
          <input 
            className={fieldClass} 
            value={categoryForm.name} 
            onChange={(event) => updateCategoryField('name', event.target.value)} 
            required 
            placeholder="e.g. Kids"
          />
        </label>
        
        <label className="space-y-2">
          <span className={labelClass}>Slug</span>
          <input 
            className={fieldClass} 
            value={categoryForm.slug} 
            onChange={(event) => updateCategoryField('slug', event.target.value.toLowerCase().replace(/\s+/g, '-'))} 
            required 
            placeholder="e.g. kids"
          />
        </label>

        <div className="flex flex-col gap-4 pt-4 md:col-span-2">
          {categoryStatus && (
            <p className="border border-white/10 bg-surface-container-highest/20 px-4 py-3 text-sm text-primary">
              {categoryStatus}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSavingCategory || isDeletingCategory}
              className="inline-flex items-center justify-center gap-2 bg-primary-container px-8 py-3.5 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {isSavingCategory ? 'sync' : 'save'}
              </span>
              {isSavingCategory ? 'Saving...' : isEditing ? 'Update Category' : 'Publish Category'}
            </button>

            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center gap-2 border border-white/15 px-8 py-3.5 font-label-caps text-xs font-bold text-primary transition-all hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
