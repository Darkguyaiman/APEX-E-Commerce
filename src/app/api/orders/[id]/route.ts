import { NextResponse } from 'next/server';
import { updateOrderStatusAndProof } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const { status, delivery_proof } = await request.json();
    if (!status || typeof status !== 'string') {
      return NextResponse.json({ error: 'Order status is required' }, { status: 400 });
    }

    await updateOrderStatusAndProof(orderId, status, delivery_proof);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error updating order:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
