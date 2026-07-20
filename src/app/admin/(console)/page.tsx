import Link from 'next/link';
import { getProducts, getTestimonials, getContactMessages, getMembershipApplications, getAdminOrders, getPromoCodes, getCategories } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [products, testimonials, messages, memberships, orders, promos, categories] = await Promise.all([
    getProducts(),
    getTestimonials(),
    getContactMessages(),
    getMembershipApplications(),
    getAdminOrders(),
    getPromoCodes(),
    getCategories()
  ]);

  const productCountByCategory = products.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const catalogMixRows = [
    ...categories.map((category) => ({
      label: category.name,
      count: productCountByCategory[category.slug] || 0
    })),
    ...Object.entries(productCountByCategory)
      .filter(([slug]) => !categorySlugs.has(slug))
      .map(([slug, count]) => ({
        label: slug,
        count
      }))
  ];
  const avgRating = testimonials.length
    ? testimonials.reduce((sum, testimonial) => sum + Number(testimonial.rating), 0) / testimonials.length
    : 0;

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label-caps text-xs text-primary-container tracking-widest">ADMIN DASHBOARD</p>
          <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
            Store Overview
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Monitor catalog coverage and jump into the two main publishing workflows.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        {[
          ['Orders', orders.length, 'receipt_long'],
          ['Products', products.length, 'inventory_2'],
          ['Testimonials', testimonials.length, 'rate_review'],
          ['Messages', messages.length, 'inbox'],
          ['Club Members', memberships.length, 'badge'],
          ['Promo Codes', promos.length, 'local_offer'],
          ['Avg Rating', avgRating ? avgRating.toFixed(1) : '0.0', 'star']
        ].map(([label, value, icon]) => (
          <div key={label} className="border border-white/10 bg-surface-container-low p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">{label}</p>
              <span className="material-symbols-outlined text-primary-container">{icon}</span>
            </div>
            <p className="font-stats-value text-4xl text-primary-container">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="border border-white/10 bg-surface-container-low p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
              Catalog Mix
            </h2>
            <Link href="/admin/products" className="font-label-caps text-[10px] text-primary-container hover:text-primary">
              MANAGE PRODUCTS
            </Link>
          </div>

          <div className="space-y-4">
            {catalogMixRows.map(({ label, count }) => {
              const width = products.length ? (count / products.length) * 100 : 0;

              return (
                <div key={label}>
                  <div className="mb-2 flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                    <span>{label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-3 bg-surface-container">
                    <div className="h-full bg-primary-container" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-white/10 bg-surface-container-low p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
              Latest Reviews
            </h2>
            <Link href="/admin/testimonials" className="font-label-caps text-[10px] text-primary-container hover:text-primary">
              MANAGE
            </Link>
          </div>

          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial) => (
              <article key={testimonial.id} className="border-t border-white/10 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-headline-md text-xl uppercase italic leading-none text-primary">
                      {testimonial.customer_name}
                    </p>
                    <p className="mt-1 font-label-caps text-[9px] text-on-surface-variant">
                      {testimonial.role}
                    </p>
                  </div>
                  <p className="font-label-caps text-[10px] text-primary-container">{testimonial.rating}/5</p>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                  {testimonial.quote}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
