import CategoryListTable from '@/components/CategoryListTable';
import { getCategories } from '@/lib/db';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">CATEGORIES</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Category Manager
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Create, edit, and manage product categories. Linking a category dynamically reflects in shop filters and forms.
        </p>
      </div>
      <CategoryListTable initialCategories={categories} />
    </div>
  );
}
