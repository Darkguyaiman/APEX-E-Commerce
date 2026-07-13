import { NextResponse } from 'next/server';
import { createTestimonial, getTestimonials, TestimonialInput } from '@/lib/db';

function parseTestimonialPayload(payload: any): TestimonialInput {
  const requiredFields = ['customer_name', 'role', 'quote', 'rating'];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
      throw new Error(`${field} is required`);
    }
  }

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('rating must be an integer between 1 and 5');
  }

  return {
    customer_name: String(payload.customer_name).trim(),
    role: String(payload.role).trim(),
    quote: String(payload.quote).trim(),
    rating
  };
}

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (e: any) {
    console.error('Error fetching testimonials API:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const testimonial = parseTestimonialPayload(payload);
    const createdTestimonial = await createTestimonial(testimonial);

    return NextResponse.json(createdTestimonial, { status: 201 });
  } catch (e: any) {
    console.error('Error creating testimonial API:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
