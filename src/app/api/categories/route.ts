import { NextResponse } from 'next/server';
import { getCategories, createCategory, type CategoryInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

type CategoryPayload = Record<string, unknown>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

function parseCategoryPayload(payload: CategoryPayload): CategoryInput {
  if (payload.name === undefined || payload.name === null || String(payload.name).trim() === '') {
    throw new Error('name is required');
  }
  if (payload.slug === undefined || payload.slug === null || String(payload.slug).trim() === '') {
    throw new Error('slug is required');
  }

  // Format slug: lowercase, replacing spaces with dashes, removing special characters
  const rawSlug = String(payload.slug).trim().toLowerCase();
  const slug = rawSlug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  return {
    name: String(payload.name).trim(),
    slug,
    image_url:
      payload.image_url === undefined || payload.image_url === null || String(payload.image_url).trim() === ''
        ? null
        : String(payload.image_url).trim()
  };
}

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (e: unknown) {
    console.error('Error fetching categories API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json() as CategoryPayload;
    const cat = parseCategoryPayload(payload);
    const created = await createCategory(cat);

    revalidatePath('/admin/categories');
    revalidatePath('/');

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.error('Error creating category API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
