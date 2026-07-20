import TestimonialListTable from '@/components/TestimonialListTable';
import { getTestimonials } from '@/lib/db';

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">TESTIMONIALS</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Testimonial Manager
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Add player feedback and review quotes that publish to the storefront.
        </p>
      </div>
      <TestimonialListTable initialTestimonials={testimonials} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
