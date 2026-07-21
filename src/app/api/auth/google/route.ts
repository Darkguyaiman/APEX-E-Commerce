import { NextResponse } from 'next/server';
import { getPublicUrl } from '@/lib/publicUrl';

function getRedirectUri(request: Request) {
  return process.env.GOOGLE_REDIRECT_URI || new URL('/api/auth/google/callback', request.url).toString();
}

function configured(value: string | undefined) {
  return Boolean(value && !value.startsWith('replace_with'));
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!configured(clientId)) {
    return NextResponse.redirect(getPublicUrl('/login?error=google_config', request));
  }

  const url = new URL(request.url);
  const next = url.searchParams.get('next') || '/shop';
  const state = Buffer.from(JSON.stringify({ next })).toString('base64url');
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  googleUrl.searchParams.set('client_id', clientId!);
  googleUrl.searchParams.set('redirect_uri', getRedirectUri(request));
  googleUrl.searchParams.set('response_type', 'code');
  googleUrl.searchParams.set('scope', 'openid email profile');
  googleUrl.searchParams.set('state', state);
  googleUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleUrl);
}
