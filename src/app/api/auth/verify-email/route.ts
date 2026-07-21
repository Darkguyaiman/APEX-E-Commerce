import { NextResponse } from 'next/server';
import { verifyCustomerByToken } from '@/lib/db';
import { getPublicUrl } from '@/lib/publicUrl';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';

  if (!token) {
    return NextResponse.redirect(getPublicUrl('/login?verified=0', request));
  }

  const customer = await verifyCustomerByToken(token);
  const status = customer ? '1' : '0';
  return NextResponse.redirect(getPublicUrl(`/login?verified=${status}`, request));
}
