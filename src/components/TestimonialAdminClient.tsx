'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/lib/db';

type TestimonialFormState = {
  customer_name: string;
  role: string;
  quote: string;
  rating: string;
};

const emptyTestimonialForm: TestimonialFormState = {
  customer_name: '',
  role: '',
  quote: '',
  rating: '5'
};

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function TestimonialAdminClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(emptyTestimonialForm);
  const [testimonialStatus, setTestimonialStatus] = useState('');
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  async function saveTestimonial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingTestimonial(true);
    setTestimonialStatus('');

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testimonialForm,
          rating: Number(testimonialForm.rating)
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save testimonial');
      }

      setTestimonials((currentTestimonials) => [data, ...currentTestimonials]);
      setTestimonialForm(emptyTestimonialForm);
      setTestimonialStatus('Testimonial added.');
    } catch (error: unknown) {
      setTestimonialStatus(getErrorMessage(error, 'Could not save testimonial.'));
    } finally {
      setIsSavingTestimonial(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={saveTestimonial} className="border border-white/10 bg-surface-container-low p-5 md:p-6">
        <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
          Add Testimonial
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Publish player feedback to the homepage testimonial section.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className={labelClass}>Customer</span>
            <input className={fieldClass} value={testimonialForm.customer_name} onChange={(event) => setTestimonialForm({ ...testimonialForm, customer_name: event.target.value })} required />
          </label>
          <label className="block space-y-2">
            <span className={labelClass}>Role</span>
            <input className={fieldClass} value={testimonialForm.role} onChange={(event) => setTestimonialForm({ ...testimonialForm, role: event.target.value })} required />
          </label>
          <label className="block space-y-2">
            <span className={labelClass}>Rating</span>
            <select className={fieldClass} value={testimonialForm.rating} onChange={(event) => setTestimonialForm({ ...testimonialForm, rating: event.target.value })}>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className={labelClass}>Quote</span>
            <textarea className={`${fieldClass} min-h-32 resize-y`} value={testimonialForm.quote} onChange={(event) => setTestimonialForm({ ...testimonialForm, quote: event.target.value })} required />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="submit"
            disabled={isSavingTestimonial}
            className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">{isSavingTestimonial ? 'sync' : 'rate_review'}</span>
            {isSavingTestimonial ? 'Saving' : 'Publish Testimonial'}
          </button>
          <p className="min-h-5 text-sm text-on-surface-variant">{testimonialStatus}</p>
        </div>
      </form>

      <section className="border border-white/10 bg-surface-container-low p-5 md:p-6">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
              Published Testimonials
            </h2>
            <p className="mt-1 font-label-caps text-[10px] text-on-surface-variant">{testimonials.length} TOTAL</p>
          </div>
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="border border-white/10 bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-headline-md text-2xl uppercase italic leading-none text-primary">
                    {testimonial.customer_name}
                  </p>
                  <p className="mt-1 font-label-caps text-[10px] text-on-surface-variant">
                    {testimonial.role}
                  </p>
                </div>
                <p className="font-label-caps text-[10px] text-primary-container">{testimonial.rating}/5</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                {testimonial.quote}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
