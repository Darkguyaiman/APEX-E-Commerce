import { NextResponse } from 'next/server';
import { deletePromoCode } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const promoId = parseInt(id, 10);
    if (isNaN(promoId)) {
      return NextResponse.json({ error: 'Invalid promo ID' }, { status: 400 });
    }

    await deletePromoCode(promoId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error deleting promo API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
