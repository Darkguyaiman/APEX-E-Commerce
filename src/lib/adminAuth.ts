import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE = 'apex_admin_session';
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'apex-admin';

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.MYSQL_PASSWORD || 'apex-local-admin-secret';
}

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USER;
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function createSessionToken(username: string) {
  return createHmac('sha256', getSecret()).update(`admin:${username}`).digest('hex');
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(username: string, password: string) {
  return username === getAdminUsername() && password === getAdminPassword();
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return Boolean(token && safeCompare(token, createSessionToken(getAdminUsername())));
}

export async function requireAdminSession() {
  const isAuthenticated = await isAdminSession();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionCookie = cookieHeader
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${ADMIN_COOKIE}=`));

  const token = sessionCookie?.split('=')[1];
  return Boolean(token && safeCompare(token, createSessionToken(getAdminUsername())));
}
