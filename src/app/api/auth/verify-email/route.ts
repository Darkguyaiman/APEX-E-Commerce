import { NextResponse } from 'next/server';
import { verifyCustomerByToken } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';

  if (!token) {
    return NextResponse.redirect(new URL('/login?verified=0', request.url));
  }

  const customer = await verifyCustomerByToken(token);
  const status = customer ? '1' : '0';
  return NextResponse.redirect(new URL(`/login?verified=${status}`, request.url));
}
