import { NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory, type CategoryInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';
import { revalidatePath } from 'next/cache';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

type CategoryPayload = Record<string, unknown>;

function parseCategoryPayload(payload: CategoryPayload): CategoryInput {
  if (payload.name === undefined || payload.name === null || String(payload.name).trim() === '') {
    throw new Error('name is required');
  }
  if (payload.slug === undefined || payload.slug === null || String(payload.slug).trim() === '') {
    throw new Error('slug is required');
  }

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const category = await getCategoryById(catId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (e: unknown) {
    console.error('Error fetching category API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const payload = await request.json();
    const cat = parseCategoryPayload(payload);
    const updated = await updateCategory(catId, cat);

    revalidatePath('/admin/categories');
    revalidatePath('/');

    return NextResponse.json(updated);
  } catch (e: unknown) {
    console.error('Error updating category API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    await deleteCategory(catId);

    revalidatePath('/admin/categories');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error deleting category API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
