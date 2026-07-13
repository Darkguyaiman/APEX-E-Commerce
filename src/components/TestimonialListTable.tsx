'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Testimonial } from '@/lib/db';

interface TestimonialListTableProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialListTable({ initialTestimonials }: TestimonialListTableProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteTestimonial = async (id: number, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the testimonial from "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete testimonial');
      }

      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Could not delete testimonial');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 bg-primary-container px-5 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 select-none whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Testimonial
        </Link>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-surface-container-low">
        <table className="w-full border-collapse text-left text-sm text-on-surface">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
              <th className="px-6 py-4">Player</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Quote</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                  No testimonials found.
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="block font-headline-md text-xl uppercase italic leading-none text-primary">
                      {testimonial.customer_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-on-surface-variant">
                    {testimonial.role}
                  </td>
                  <td className="px-6 py-4 font-label-caps text-[11px] text-primary-container">
                    {testimonial.rating}/5
                  </td>
                  <td className="px-6 py-4 text-sm leading-relaxed text-on-surface-variant max-w-md truncate md:whitespace-normal md:overflow-visible">
                    {testimonial.quote}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2 justify-end">
                      <Link
                        href={`/admin/testimonials/${testimonial.id}`}
                        className="inline-flex items-center justify-center border border-white/15 p-2 text-primary transition-colors hover:bg-white/10"
                        title="Edit Testimonial"
                      >
                        <span className="material-symbols-outlined text-sm block">edit</span>
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === testimonial.id}
                        onClick={() => handleDeleteTestimonial(testimonial.id, testimonial.customer_name)}
                        className="inline-flex items-center justify-center border border-secondary-container p-2 text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-50 cursor-pointer"
                        title={deletingId === testimonial.id ? 'Deleting...' : 'Delete Testimonial'}
                      >
                        <span className="material-symbols-outlined text-sm block">
                          {deletingId === testimonial.id ? 'sync' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
