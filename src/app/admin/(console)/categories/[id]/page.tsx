import React from 'react';
import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/db';
import CategoryForm from '@/components/CategoryForm';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <CategoryForm initialCategory={category} />
    </div>
  );
}
