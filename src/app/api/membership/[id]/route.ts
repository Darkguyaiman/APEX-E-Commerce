import { NextResponse } from 'next/server';
import { deleteMembershipApplication } from '@/lib/db';
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
    const appId = parseInt(id, 10);
    if (isNaN(appId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    await deleteMembershipApplication(appId);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Error deleting membership application:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
