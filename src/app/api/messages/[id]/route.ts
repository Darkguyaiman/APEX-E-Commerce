import { NextResponse } from 'next/server';
import { markMessageRead, deleteContactMessage } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

// Mark message as read
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    await markMessageRead(messageId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error marking message read:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

// Delete message
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const messageId = parseInt(id, 10);
    if (isNaN(messageId)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    await deleteContactMessage(messageId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error deleting contact message:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
