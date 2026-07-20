'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductImage, ProductVideo } from '@/lib/db';

type ProductFormState = {
  id?: number;
  name: string;
  slug: string;
  price: string;
  original_price: string;
  category: string;
  colorway: string;
  weight_grams: string;
  traction_type: string;
  description: string;
  type_chip: string;
  tags: string;
  requires_size: boolean;
  size_options: string;
};

const emptyProductForm: ProductFormState = {
  name: '',
  slug: '',
  price: '',
  original_price: '',
  category: 'men',
  colorway: '',
  weight_grams: '',
  traction_type: 'FG',
  description: '',
  type_chip: '',
  tags: '',
  requires_size: true,
  size_options: ''
};

function productToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: String(product.price),
    original_price: product.original_price ? String(product.original_price) : '',
    category: product.category,
    colorway: product.colorway,
    weight_grams: product.weight_grams,
    traction_type: product.traction_type,
    description: product.description,
    type_chip: product.type_chip || '',
    tags: product.tags || '',
    requires_size: product.requires_size === undefined || product.requires_size === null ? true : Boolean(product.requires_size),
    size_options: product.size_options || ''
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

interface ProductFormProps {
  initialProduct?: Product;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [productForm, setProductForm] = useState<ProductFormState>(
    initialProduct ? productToForm(initialProduct) : emptyProductForm
  );
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          // If creating new product and data has items, default category to first category slug
          if (!initialProduct && data.length > 0) {
            setProductForm(prev => ({ ...prev, category: data[0].slug }));
          }
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, [initialProduct]);
  
  // Track images list state
  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || (initialProduct?.image_url ? [{ image_url: initialProduct.image_url, is_main: true }] : [])
  );
  
  const [faqs, setFaqs] = useState<{ title: string; description: string; badges?: string[] }[]>(() => {
    try {
      return initialProduct?.faqs ? JSON.parse(initialProduct.faqs) : [];
    } catch {
      return [];
    }
  });

  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { title: '', description: '', badges: [] }]);
  };

  const handleFaqChange = (index: number, key: 'title' | 'description' | 'badges', value: string) => {
    setFaqs(prev => {
      const updated = [...prev];
      if (key === 'badges') {
        updated[index] = { ...updated[index], badges: value.split(',').map((s: string) => s.trim()).filter(Boolean) };
      } else {
        updated[index] = { ...updated[index], [key]: value };
      }
      return updated;
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };
  
  const [videos, setVideos] = useState<ProductVideo[]>(
    initialProduct?.videos || []
  );

  const handleAddVideo = () => {
    setVideos(prev => [...prev, { title: '', video_url: '' }]);
  };

  const handleVideoChange = (index: number, key: 'title' | 'video_url', value: string) => {
    setVideos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };
  
  const [productStatus, setProductStatus] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  async function handleDeleteProduct() {
    if (!confirm('Are you absolutely sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    setIsDeletingProduct(true);
    setProductStatus('');

    try {
      const response = await fetch(`/api/products/${productForm.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete product');
      }

      setProductStatus('Product deleted.');
      
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setProductStatus(error instanceof Error ? error.message : 'Could not delete product.');
    } finally {
      setIsDeletingProduct(false);
    }
  }

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError('');
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      await handleFilesUpload(files);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFilesUpload(files);
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setUploadError('Please select valid image files.');
      return;
    }

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setImages(prev => {
          // If this is the first image, mark it as main by default
          const isMain = prev.length === 0;
          return [...prev, { image_url: data.url, is_main: isMain }];
        });
      } catch (err: unknown) {
        setUploadError(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Upload failed'}`);
      }
    }
  };

  const setMainImage = (index: number) => {
    setImages(prev =>
      prev.map((img, i) => ({
        ...img,
        is_main: i === index
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].is_main && newImages.length > 0) {
        newImages[0].is_main = true;
      }
      return newImages;
    });
  };

  function updateProductField(field: keyof ProductFormState, value: string) {
    setProductForm((currentForm) => {
      if (field === 'name' && !currentForm.id) {
        return { ...currentForm, name: value, slug: slugify(value) };
      }
      return { ...currentForm, [field]: value };
    });
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (images.length === 0) {
      setProductStatus('At least one product image is required.');
      return;
    }
    
    // Check if main image is selected
    const hasMain = images.some(img => img.is_main);
    const finalImages = [...images];
    if (!hasMain && finalImages.length > 0) {
      finalImages[0].is_main = true;
    }

    setIsSavingProduct(true);
    setProductStatus('');

    try {
      const isEditing = Boolean(productForm.id);
      const endpoint = isEditing ? `/api/products/${productForm.id}` : '/api/products';
      
      const mainImg = finalImages.find(img => img.is_main) || finalImages[0];
      const mainImageUrl = mainImg ? mainImg.image_url : '/images/product-ghost.png';

      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          image_url: mainImageUrl,
          price: Number(productForm.price),
          original_price: productForm.original_price ? Number(productForm.original_price) : null,
          requires_size: productForm.requires_size,
          size_options: productForm.size_options ? productForm.size_options : null,
          images: finalImages,
          faqs: JSON.stringify(faqs),
          videos: videos
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save product');
      }

      setProductStatus(isEditing ? 'Product changes saved.' : 'Product added to the catalog.');
      
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setProductStatus(error instanceof Error ? error.message : 'Could not save product.');
    } finally {
      setIsSavingProduct(false);
    }
  }

  return (
    <form onSubmit={saveProduct} className="border border-white/10 bg-surface-container-low p-5 md:p-6 w-full shadow-xl">
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
            {productForm.id ? 'Edit Product' : 'Add Product'}
          </h2>
          <p className="mt-1 font-label-caps text-[10px] text-on-surface-variant">
            {productForm.id ? `ID ${productForm.id}` : 'NEW CATALOG RECORD'}
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center gap-2 border border-white/15 px-4 py-2 font-label-caps text-[10px] text-primary transition-colors hover:bg-white/10 select-none"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Cancel & Back
        </Link>
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Traction Type</span>
          <input className={fieldClass} value={productForm.traction_type} onChange={(event) => updateProductField('traction_type', event.target.value)} required />
        </label>
        
        {/* Dropzone & Image List Manager */}
        <div className="space-y-2 md:col-span-2">
          <span className={labelClass}>Product Gallery (Drag & Drop or Click to Upload)</span>
          
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-none p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer ${
              isDragging 
                ? 'border-primary-container bg-primary-container/5' 
                : 'border-white/10 hover:border-white/20 bg-surface-container/35'
            }`}
            onClick={() => document.getElementById('image-upload-input')?.click()}
          >
            <input
              id="image-upload-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">cloud_upload</span>
            <p className="text-xs text-primary font-bold">Drag and drop images here, or click to browse</p>
            <p className="text-[10px] text-on-surface-variant/70 mt-1 uppercase font-label-caps">Supports PNG, JPG, GIF, WebP</p>
          </div>
          
          {uploadError && (
            <p className="text-xs text-secondary-container font-medium">{uploadError}</p>
          )}

          {/* Images preview list */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative group border border-white/10 bg-surface-container p-2 flex flex-col justify-between">
                  <div className="relative aspect-square w-full bg-black overflow-hidden">
                    <Image
                      src={img.image_url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className={`px-2 py-1.5 text-[9px] font-label-caps font-bold transition-all border flex-1 ${
                        img.is_main
                          ? 'bg-primary-container border-primary-container text-black'
                          : 'bg-transparent border-white/10 text-on-surface-variant hover:text-primary hover:border-white/20'
                      }`}
                    >
                      {img.is_main ? 'Main' : 'Set Main'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1.5 border border-white/10 text-on-surface-variant hover:text-secondary-container hover:border-secondary-container transition-colors flex items-center justify-center"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-sm block">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
        <label className="flex items-start gap-3 border border-white/10 bg-surface-container/30 p-4 md:col-span-2">
          <input
            type="checkbox"
            checked={productForm.requires_size}
            onChange={(event) => setProductForm((currentForm) => ({ ...currentForm, requires_size: event.target.checked }))}
            className="mt-1 h-4 w-4 accent-primary-container"
          />
          <span>
            <span className={labelClass}>Requires size selection</span>
            <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant/75">
              Keep this on for boots and footwear. Turn it off for one-size products so customers can add them directly from the shop.
            </span>
          </span>
        </label>
        {productForm.requires_size && (
          <label className="space-y-2 md:col-span-2">
            <span className={labelClass}>Size Options</span>
            <input
              className={fieldClass}
              value={productForm.size_options}
              onChange={(event) => updateProductField('size_options', event.target.value)}
              placeholder="Leave blank for boot sizes, or enter XS,S,M,L,XL"
            />
            <span className="block text-xs leading-relaxed text-on-surface-variant/70">
              Use comma-separated values. Example for shirts: XS,S,M,L,XL.
            </span>
          </label>
        )}
        {/* FAQs / Tech Fold Accordion Editor */}
        <div className="space-y-4 md:col-span-2 border-t border-white/10 pt-6 mt-4">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Custom Product details folds (Tech Details / FAQs)</span>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 border border-primary-container px-3 py-1.5 font-label-caps text-[10px] text-primary-container hover:bg-primary-container/10 transition-colors cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              ADD DETAILS FOLD
            </button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-xs text-on-surface-variant/60 font-body-md py-4 text-center border border-dashed border-white/10">
              No custom detail folds configured. Falls back to default performance folds.
            </p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-white/10 bg-surface-container/20 p-4 space-y-4 relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-label-caps text-[10px] text-primary-container font-black">FOLD #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="text-on-surface-variant hover:text-secondary-container transition-colors flex items-center justify-center p-1 border border-white/10 hover:border-secondary-container cursor-pointer"
                      title="Remove fold"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5 block">
                      <span className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase">Fold Title</span>
                      <input
                        type="text"
                        className={fieldClass}
                        value={faq.title}
                        onChange={(e) => handleFaqChange(index, 'title', e.target.value)}
                        placeholder="e.g. Carbon Soleplate Snap"
                        required
                      />
                    </label>
                    
                    <label className="space-y-1.5 block">
                      <span className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase">Badges (Comma separated)</span>
                      <input
                        type="text"
                        className={fieldClass}
                        value={faq.badges ? faq.badges.join(', ') : ''}
                        onChange={(e) => handleFaqChange(index, 'badges', e.target.value)}
                        placeholder="e.g. LIGHTWEIGHT, DURABLE"
                      />
                    </label>
                  </div>

                  <label className="space-y-1.5 block">
                    <span className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase">Fold Description / Content</span>
                    <textarea
                      className={`${fieldClass} min-h-20 resize-y`}
                      value={faq.description}
                      onChange={(e) => handleFaqChange(index, 'description', e.target.value)}
                      placeholder="Enter the detailed copy of the fold item..."
                      required
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Videos Editor */}
        <div className="space-y-4 md:col-span-2 border-t border-white/10 pt-6 mt-4">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Product Showcase Videos (Optional YouTube Links)</span>
            <button
              type="button"
              onClick={handleAddVideo}
              className="inline-flex items-center gap-1.5 border border-primary-container px-3 py-1.5 font-label-caps text-[10px] text-primary-container hover:bg-primary-container/10 transition-colors cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              ADD VIDEO
            </button>
          </div>

          {videos.length === 0 ? (
            <p className="text-xs text-on-surface-variant/60 font-body-md py-4 text-center border border-dashed border-white/10">
              No product videos configured. Add video links to showcase review/action footage.
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((vid, index) => (
                <div key={index} className="border border-white/10 bg-surface-container/20 p-4 space-y-4 relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-label-caps text-[10px] text-primary-container font-black">VIDEO #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="text-on-surface-variant hover:text-secondary-container transition-colors flex items-center justify-center p-1 border border-white/10 hover:border-secondary-container cursor-pointer"
                      title="Remove video"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5 block">
                      <span className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase">Video Title</span>
                      <input
                        type="text"
                        className={fieldClass}
                        value={vid.title}
                        onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                        placeholder="e.g. Nike Vapor 15 On-Feet Review"
                        required
                      />
                    </label>
                    
                    <label className="space-y-1.5 block">
                      <span className="font-label-caps text-[9px] text-on-surface-variant/70 uppercase">YouTube Link / URL</span>
                      <input
                        type="url"
                        className={fieldClass}
                        value={vid.video_url}
                        onChange={(e) => handleVideoChange(index, 'video_url', e.target.value)}
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        required
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="space-y-2 md:col-span-2">
          <span className={labelClass}>Description</span>
          <textarea className={`${fieldClass} min-h-32 resize-y`} value={productForm.description} onChange={(event) => updateProductField('description', event.target.value)} required />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-5 text-sm text-on-surface-variant font-medium">{productStatus}</p>
        <div className="flex flex-wrap gap-3">
          {productForm.id && (
            <button
              type="button"
              disabled={isDeletingProduct || isSavingProduct}
              onClick={handleDeleteProduct}
              className="inline-flex items-center justify-center gap-2 border border-secondary-container px-6 py-3 font-label-caps text-xs font-bold text-secondary transition-all hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">{isDeletingProduct ? 'sync' : 'delete'}</span>
              {isDeletingProduct ? 'Deleting' : 'Delete Product'}
            </button>
          )}
          <button
            type="submit"
            disabled={isSavingProduct || isDeletingProduct}
            className="inline-flex items-center justify-center gap-2 bg-primary-container px-6 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">{isSavingProduct ? 'sync' : 'save'}</span>
            {isSavingProduct ? 'Saving' : 'Save Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
