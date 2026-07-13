'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Testimonial } from '@/lib/db';

type TestimonialFormState = {
  id?: number;
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

function testimonialToForm(testimonial: Testimonial): TestimonialFormState {
  return {
    id: testimonial.id,
    customer_name: testimonial.customer_name,
    role: testimonial.role,
    quote: testimonial.quote,
    rating: String(testimonial.rating)
  };
}

const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';
const labelClass = 'font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase';

interface TestimonialFormProps {
  initialTestimonial?: Testimonial;
}

export default function TestimonialForm({ initialTestimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(
    initialTestimonial ? testimonialToForm(initialTestimonial) : emptyTestimonialForm
  );
  const [testimonialStatus, setTestimonialStatus] = useState('');
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);
  const [isDeletingTestimonial, setIsDeletingTestimonial] = useState(false);

  async function handleDeleteTestimonial() {
    if (!confirm('Are you absolutely sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }
    
    setIsDeletingTestimonial(true);
    setTestimonialStatus('');

    try {
      const response = await fetch(`/api/testimonials/${testimonialForm.id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete testimonial');
      }

      setTestimonialStatus('Testimonial deleted.');
      
      setTimeout(() => {
        router.push('/admin/testimonials');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setTestimonialStatus(error instanceof Error ? error.message : 'Could not delete testimonial.');
    } finally {
      setIsDeletingTestimonial(false);
    }
  }

  async function saveTestimonial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingTestimonial(true);
    setTestimonialStatus('');

    try {
      const isEditing = Boolean(testimonialForm.id);
      const endpoint = isEditing ? `/api/testimonials/${testimonialForm.id}` : '/api/testimonials';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
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

      setTestimonialStatus(isEditing ? 'Testimonial changes saved.' : 'Testimonial added.');
      
      setTimeout(() => {
        router.push('/admin/testimonials');
        router.refresh();
      }, 1000);
    } catch (error: unknown) {
      setTestimonialStatus(error instanceof Error ? error.message : 'Could not save testimonial.');
    } finally {
      setIsSavingTestimonial(false);
    }
  }

  return (
    <form onSubmit={saveTestimonial} className="border border-white/10 bg-surface-container-low p-5 md:p-6 w-full shadow-xl">
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-headline-md text-3xl uppercase italic leading-none text-primary">
            {testimonialForm.id ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {testimonialForm.id ? 'Modify existing player feedback details.' : 'Publish player feedback to the homepage testimonial section.'}
          </p>
        </div>
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center justify-center gap-2 border border-white/15 px-4 py-2 font-label-caps text-[10px] text-primary transition-colors hover:bg-white/10 select-none whitespace-nowrap self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Cancel & Back
        </Link>
      </div>

      <div className="space-y-4">
        <label className="block space-y-2">
          <span className={labelClass}>Customer Name</span>
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

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-5 text-sm text-on-surface-variant font-medium">{testimonialStatus}</p>
        <div className="flex flex-wrap gap-3">
          {testimonialForm.id && (
            <button
              type="button"
              disabled={isDeletingTestimonial || isSavingTestimonial}
              onClick={handleDeleteTestimonial}
              className="inline-flex items-center justify-center gap-2 border border-secondary-container px-5 py-3 font-label-caps text-xs font-bold text-secondary transition-all hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">{isDeletingTestimonial ? 'sync' : 'delete'}</span>
              {isDeletingTestimonial ? 'Deleting' : 'Delete Testimonial'}
            </button>
          )}
          <button
            type="submit"
            disabled={isSavingTestimonial || isDeletingTestimonial}
            className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">{isSavingTestimonial ? 'sync' : 'rate_review'}</span>
            {isSavingTestimonial ? 'Saving' : (testimonialForm.id ? 'Save Testimonial' : 'Publish Testimonial')}
          </button>
        </div>
      </div>
    </form>
  );
}
