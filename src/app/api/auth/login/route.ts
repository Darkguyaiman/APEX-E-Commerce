import { NextResponse } from 'next/server';
import { loginEmailCustomer } from '@/lib/customerAuth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const customer = await loginEmailCustomer(String(email), String(password));
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not sign in.';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
