import Link from 'next/link';
import { getProducts, getTestimonials } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [products, testimonials] = await Promise.all([
    getProducts(),
    getTestimonials()
  ]);

  const menProducts = products.filter((product) => product.category === 'men').length;
  const womenProducts = products.filter((product) => product.category === 'women').length;
  const kitProducts = products.filter((product) => product.category === 'kit').length;
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Products', products.length, 'inventory_2'],
          ['Testimonials', testimonials.length, 'rate_review'],
          ['Kit Items', kitProducts, 'sports_soccer'],
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
            {[
              ['Men', menProducts],
              ['Women', womenProducts],
              ['Kit', kitProducts]
            ].map(([label, count]) => {
              const width = products.length ? (Number(count) / products.length) * 100 : 0;

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
