import { NextResponse } from 'next/server';
import { updateTestimonial, deleteTestimonial, type TestimonialInput } from '@/lib/db';
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

type RouteContext<T> = {
  params: Promise<T>;
};

export async function PUT(request: Request, ctx: RouteContext<{ id: string }>) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const testimonialId = Number(id);
    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const payload = await request.json() as TestimonialPayload;
    const testimonial = parseTestimonialPayload(payload);
    const updatedTestimonial = await updateTestimonial(testimonialId, testimonial);

    return NextResponse.json(updatedTestimonial);
  } catch (e: unknown) {
    console.error('Error updating testimonial API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext<{ id: string }>) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const testimonialId = Number(id);
    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await deleteTestimonial(testimonialId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error deleting testimonial API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
