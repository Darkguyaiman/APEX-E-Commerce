import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customerAuth';

export async function GET() {
  const customer = await getCustomerSession();
  return NextResponse.json({ customer });
}
