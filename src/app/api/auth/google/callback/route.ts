import { NextResponse } from 'next/server';
import { loginGoogleCustomer } from '@/lib/customerAuth';
import { getPublicUrl } from '@/lib/publicUrl';

function getRedirectUri(request: Request) {
  return process.env.GOOGLE_REDIRECT_URI || new URL('/api/auth/google/callback', request.url).toString();
}

function configured(value: string | undefined) {
  return Boolean(value && !value.startsWith('replace_with'));
}

function readNextFromState(state: string | null) {
  if (!state) return '/shop';
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as { next?: string };
    return parsed.next?.startsWith('/') ? parsed.next : '/shop';
  } catch {
    return '/shop';
  }
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = readNextFromState(url.searchParams.get('state'));

  if (!configured(clientId) || !configured(clientSecret) || !code) {
    return NextResponse.redirect(getPublicUrl('/login?error=google', request));
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: getRedirectUri(request)
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Google token exchange failed.');
    }

    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenData.access_token) {
      throw new Error('Google did not return an access token.');
    }

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!profileResponse.ok) {
      throw new Error('Could not load Google profile.');
    }

    const profile = await profileResponse.json() as {
      sub: string;
      email: string;
      name?: string;
      email_verified?: boolean;
    };

    await loginGoogleCustomer({
      googleId: profile.sub,
      email: profile.email,
      name: profile.name || profile.email,
      emailVerified: Boolean(profile.email_verified)
    });

    return NextResponse.redirect(getPublicUrl(next, request));
  } catch {
    return NextResponse.redirect(getPublicUrl('/login?error=google', request));
  }
}
