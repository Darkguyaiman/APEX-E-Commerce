import { getTestimonialById } from '@/lib/db';
import TestimonialForm from '@/components/TestimonialForm';
import { notFound } from 'next/navigation';

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;
  const testimonialId = Number(id);
  if (isNaN(testimonialId)) {
    notFound();
  }

  const testimonial = await getTestimonialById(testimonialId);
  if (!testimonial) {
    notFound();
  }

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <TestimonialForm initialTestimonial={testimonial} />
    </div>
  );
}
