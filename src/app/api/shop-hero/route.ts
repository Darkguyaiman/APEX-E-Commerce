import { NextResponse } from 'next/server';
import { getShopHeroProductId, setShopHeroProductId } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

export async function GET() {
  try {
    const productId = await getShopHeroProductId();
    return NextResponse.json({ productId });
  } catch (error: unknown) {
    console.error('Error fetching shop hero setting:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json() as { productId?: unknown };
    const productId = Number(payload.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error('A valid product id is required.');
    }

    const updatedProductId = await setShopHeroProductId(productId);
    return NextResponse.json({ productId: updatedProductId });
  } catch (error: unknown) {
    console.error('Error updating shop hero setting:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
