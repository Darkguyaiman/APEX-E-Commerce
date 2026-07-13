'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/lib/db';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(() => setTestimonials([]));
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  // Multiply items if list is short to fill width before duplicating for the infinite loop
  let list = [...testimonials];
  while (list.length > 0 && list.length < 8) {
    list = [...list, ...list];
  }

  // Create two distinct sequences for the two rows to avoid direct duplicates stacked vertically
  const list1 = list;
  const list2 = [...list].reverse();

  const renderCard = (testimonial: Testimonial, index: number, prefix: string) => (
    <article 
      key={`${prefix}-${testimonial.id}-${index}`} 
      className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 border border-white/10 bg-background p-6 flex flex-col justify-between hover:border-primary-container/30 transition-colors shadow-lg"
    >
      <div>
        {/* Star Rating Block */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-0.5 text-primary-container" aria-label={`${testimonial.rating} out of 5 rating`}>
            {Array.from({ length: 5 }).map((_, starIndex) => (
              starIndex < testimonial.rating ? (
                <svg key={starIndex} className="w-4 h-4 fill-primary-container" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ) : (
                <svg key={starIndex} className="w-4 h-4 fill-none stroke-primary-container" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              )
            ))}
          </div>
          <span className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-widest font-semibold">
            {testimonial.rating}/5
          </span>
        </div>

        {/* Testimonial Quote */}
        <p className="text-sm leading-relaxed text-on-surface-variant/90 min-h-[80px] italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Author Attributes */}
      <div className="border-t border-white/10 pt-4 mt-5">
        <cite className="not-italic font-headline-md text-base uppercase italic leading-none text-primary">
          {testimonial.customer_name}
        </cite>
        <p className="mt-1 font-label-caps text-[9px] text-primary-container tracking-wider font-semibold">
          {testimonial.role}
        </p>
      </div>
    </article>
  );

  return (
    <section className="py-section-gap bg-surface-container-low border-y border-white/5 relative overflow-hidden">
      {/* Premium Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/2 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between relative z-10">
        <div>
          <p className="font-label-caps text-xs text-primary-container tracking-widest">FIELD TESTED</p>
          <h3 className="mt-2 font-headline-lg text-4xl md:text-headline-lg uppercase italic text-primary leading-none">
            Player Reports
          </h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
          Feedback from players putting Apex gear through match pace, training load, and bad-weather sessions.
        </p>
      </div>

      {/* Conveyor Tracks Section Container */}
      <div className="space-y-4 relative z-10">
        
        {/* ROW 1: Scrolls Left (visible everywhere) */}
        <div className="w-full overflow-hidden mask-marquee py-2">
          <div className="animate-marquee flex gap-6">
            {list1.map((testimonial, idx) => renderCard(testimonial, idx, 'row1'))}
            {list1.map((testimonial, idx) => renderCard(testimonial, idx, 'row1-dup'))}
          </div>
        </div>

        {/* ROW 2: Scrolls Right (visible only on desktop / tablet - hidden on mobile) */}
        <div className="w-full overflow-hidden mask-marquee py-2 hidden md:block">
          <div className="animate-marquee-reverse flex gap-6">
            {list2.map((testimonial, idx) => renderCard(testimonial, idx, 'row2'))}
            {list2.map((testimonial, idx) => renderCard(testimonial, idx, 'row2-dup'))}
          </div>
        </div>

      </div>
    </section>
  );
}
