'use client';

import React, { useMemo, useState } from 'react';
import { Product } from '@/lib/db';

type ProductFormState = {
  id?: number;
  name: string;
  slug: string;
  price: string;
  original_price: string;
  category: string;
  image_url: string;
  colorway: string;
  weight_grams: string;
  traction_type: string;
  description: string;
  type_chip: string;
  tags: string;
};

const emptyProductForm: ProductFormState = {
  name: '',
  slug: '',
  price: '',
  original_price: '',
  category: 'men',
  image_url: '/images/product-ghost.png',
  colorway: '',
  weight_grams: '',
  traction_type: 'FG',
  description: '',
  type_chip: '',
  tags: ''
};

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: String(product.price),
    original_price: product.original_price ? String(product.original_price) : '',
    category: product.category,
    image_url: product.image_url,
    colorway: product.colorway,
    weight_grams: product.weight_grams,
    traction_type: product.traction_type,
    description: product.description,
    type_chip: product.type_chip || '',
    tags: product.tags || ''
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

export default function ProductAdminClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
  const [productStatus, setProductStatus] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [query, setQuery] = useState('');

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

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProduct(true);
    setProductStatus('');

    try {
      const isEditing = Boolean(productForm.id);
      const endpoint = isEditing ? `/api/products/${productForm.id}` : '/api/products';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          original_price: productForm.original_price ? Number(productForm.original_price) : null
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save product');
      }

      setProducts((currentProducts) => {
        if (isEditing) {
          return currentProducts.map((product) => product.id === data.id ? data : product);
        }
        return [...currentProducts, data];
      });
      setProductForm(productToForm(data));
      setProductStatus(isEditing ? 'Product changes saved.' : 'Product added to the catalog.');
    } catch (error: unknown) {
      setProductStatus(getErrorMessage(error, 'Could not save product.'));
    } finally {
      setIsSavingProduct(false);
    }
  }

  function updateProductField(field: keyof ProductFormState, value: string) {
    setProductForm((currentForm) => {
      if (field === 'name' && !currentForm.id) {
        return { ...currentForm, name: value, slug: slugify(value) };
      }
      return { ...currentForm, [field]: value };
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <aside className="space-y-4">
        <div className="border border-white/10 bg-surface-container-low p-4">
          <label className={labelClass} htmlFor="product-search">Search products</label>
          <div className="relative mt-2">
            <input
              id="product-search"
              className={`${fieldClass} pr-11`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, slug, category"
            />
            <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant">search</span>
          </div>
        </div>

        <div className="max-h-[720px] overflow-auto border border-white/10 bg-surface-container-low">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                setProductForm(productToForm(product));
                setProductStatus('');
              }}
              className={`flex w-full items-start justify-between gap-4 border-b border-white/5 px-4 py-4 text-left transition-colors hover:bg-white/5 ${
                productForm.id === product.id ? 'bg-primary-container/10' : ''
              }`}
            >
              <span>
                <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                  {product.name}
                </span>
                <span className="mt-1 block font-label-caps text-[10px] text-on-surface-variant">
                  {product.category} / {product.traction_type}
                </span>
              </span>
              <span className="font-stats-value text-lg text-primary-container">
                RM {Number(product.price).toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <form onSubmit={saveProduct} className="border border-white/10 bg-surface-container-low p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
              {productForm.id ? 'Edit Product' : 'Add Product'}
            </h2>
            <p className="mt-1 font-label-caps text-[10px] text-on-surface-variant">
              {productForm.id ? `ID ${productForm.id}` : 'NEW CATALOG RECORD'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setProductForm(emptyProductForm);
              setProductStatus('');
            }}
            className="inline-flex items-center justify-center gap-2 border border-white/15 px-4 py-2 font-label-caps text-[10px] text-primary transition-colors hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Product
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClass}>Name</span>
            <input className={fieldClass} value={productForm.name} onChange={(event) => updateProductField('name', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Slug</span>
            <input className={fieldClass} value={productForm.slug} onChange={(event) => updateProductField('slug', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Price</span>
            <input className={fieldClass} type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => updateProductField('price', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Original Price</span>
            <input className={fieldClass} type="number" min="0" step="0.01" value={productForm.original_price} onChange={(event) => updateProductField('original_price', event.target.value)} placeholder="Optional" />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Category</span>
            <select className={fieldClass} value={productForm.category} onChange={(event) => updateProductField('category', event.target.value)}>
              <option value="men">men</option>
              <option value="women">women</option>
              <option value="kit">kit</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Traction Type</span>
            <input className={fieldClass} value={productForm.traction_type} onChange={(event) => updateProductField('traction_type', event.target.value)} required />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className={labelClass}>Image URL</span>
            <input className={fieldClass} value={productForm.image_url} onChange={(event) => updateProductField('image_url', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Colorway</span>
            <input className={fieldClass} value={productForm.colorway} onChange={(event) => updateProductField('colorway', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Weight</span>
            <input className={fieldClass} value={productForm.weight_grams} onChange={(event) => updateProductField('weight_grams', event.target.value)} required />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Type Chip</span>
            <input className={fieldClass} value={productForm.type_chip} onChange={(event) => updateProductField('type_chip', event.target.value)} placeholder="Optional" />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Tags</span>
            <input className={fieldClass} value={productForm.tags} onChange={(event) => updateProductField('tags', event.target.value)} placeholder="CARBON SOLE,FG" />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className={labelClass}>Description</span>
            <textarea className={`${fieldClass} min-h-32 resize-y`} value={productForm.description} onChange={(event) => updateProductField('description', event.target.value)} required />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-h-5 text-sm text-on-surface-variant">{productStatus}</p>
          <button
            type="submit"
            disabled={isSavingProduct}
            className="inline-flex items-center justify-center gap-2 bg-primary-container px-6 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">{isSavingProduct ? 'sync' : 'save'}</span>
            {isSavingProduct ? 'Saving' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
