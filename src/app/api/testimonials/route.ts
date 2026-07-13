import { NextResponse } from 'next/server';
import { createTestimonial, getTestimonials, type TestimonialInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

type TestimonialPayload = Record<string, unknown>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

function parseTestimonialPayload(payload: TestimonialPayload): TestimonialInput {
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
  } catch (e: unknown) {
    console.error('Error fetching testimonials API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json() as TestimonialPayload;
    const testimonial = parseTestimonialPayload(payload);
    const createdTestimonial = await createTestimonial(testimonial);

    return NextResponse.json(createdTestimonial, { status: 201 });
  } catch (e: unknown) {
    console.error('Error creating testimonial API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
