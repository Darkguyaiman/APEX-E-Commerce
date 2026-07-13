import { NextResponse } from 'next/server';
import { checkConnection } from '@/lib/db';

export async function GET() {
  try {
    const status = await checkConnection();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({
      connected: false,
      message: e.message || 'Error checking connection'
    });
  }
}
export const dynamic = 'force-dynamic';
