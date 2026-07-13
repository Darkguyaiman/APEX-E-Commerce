import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }
  
  const kitProducts = await getProducts('kit');
  
  return <ProductDetailClient product={product} kitProducts={kitProducts} />;
}
