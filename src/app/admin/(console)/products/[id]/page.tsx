import { getProductById } from '@/lib/db';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);
  if (!product) {
    notFound();
  }

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <ProductForm initialProduct={product} />
    </div>
  );
}
