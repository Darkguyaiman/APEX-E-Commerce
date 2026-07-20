import ProductListTable from '@/components/ProductListTable';
import { getProducts, getShopHeroProductId } from '@/lib/db';

export default async function AdminProductsPage() {
  const [products, shopHeroProductId] = await Promise.all([
    getProducts(),
    getShopHeroProductId()
  ]);

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">PRODUCTS</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Product Manager
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Add catalog items, edit product specs, and choose the product featured in the shop hero.
        </p>
      </div>
      <ProductListTable initialProducts={products} initialShopHeroProductId={shopHeroProductId} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
