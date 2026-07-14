import { NextResponse } from 'next/server';
import { registerEmailCustomer } from '@/lib/customerAuth';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const { token } = await registerEmailCustomer(String(name), String(email), String(password));
    let emailSent = false;
    let emailError = '';

    try {
      emailSent = await sendVerificationEmail(String(email), token);
    } catch (error) {
      emailError = error instanceof Error ? error.message : 'SMTP send failed.';
      console.error('Verification email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent
        ? 'Account created. Check your email to verify your account.'
        : emailError
          ? `Account created, but the verification email could not be sent: ${emailError}`
          : 'Account created. SMTP is not configured, so the verification URL was logged on the server.'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
