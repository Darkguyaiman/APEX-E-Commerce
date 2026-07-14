import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  createCustomer,
  createEmailVerificationToken,
  findCustomerByEmail,
  findCustomerByGoogleId,
  findCustomerById,
  type Customer,
  verifyCustomerEmail
} from '@/lib/db';

const CUSTOMER_COOKIE = 'apex_customer_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export type PublicCustomer = {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  provider: string;
};

function getSecret() {
  return process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || 'apex-local-customer-secret';
}

function signPayload(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function toPublicCustomer(customer: Customer): PublicCustomer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    email_verified: Boolean(customer.email_verified),
    provider: customer.provider
  };
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString('hex');
  return safeCompare(candidate, hash);
}

export function createVerificationToken() {
  return randomBytes(32).toString('base64url');
}

export async function createCustomerSession(customer: Customer) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${customer.id}.${expiresAt}`;
  const token = `${payload}.${signPayload(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
}

export async function getCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [id, expiresAt, signature] = parts;
  const payload = `${id}.${expiresAt}`;
  if (!safeCompare(signature, signPayload(payload))) return null;
  if (Number(expiresAt) < Math.floor(Date.now() / 1000)) return null;

  const customer = await findCustomerById(Number(id));
  return customer ? toPublicCustomer(customer) : null;
}

export async function requireCustomerSession(next = '/checkout') {
  const customer = await getCustomerSession();
  if (!customer) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return customer;
}

export async function registerEmailCustomer(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findCustomerByEmail(normalizedEmail);

  if (existing) {
    if (existing.provider === 'email' && !existing.email_verified) {
      const token = createVerificationToken();
      await createEmailVerificationToken(existing.id, token);
      return { customer: existing, token };
    }

    throw new Error('An account already exists for this email.');
  }

  const customer = await createCustomer({
    name: name.trim(),
    email: normalizedEmail,
    password_hash: hashPassword(password),
    provider: 'email',
    email_verified: false
  });
  const token = createVerificationToken();
  await createEmailVerificationToken(customer.id, token);
  return { customer, token };
}

export async function loginEmailCustomer(email: string, password: string) {
  const customer = await findCustomerByEmail(email.trim().toLowerCase());
  if (!customer || customer.provider !== 'email' || !verifyPassword(password, customer.password_hash)) {
    throw new Error('Invalid email or password.');
  }
  if (!customer.email_verified) {
    throw new Error('Verify your email before logging in.');
  }
  await createCustomerSession(customer);
  return toPublicCustomer(customer);
}

export async function loginGoogleCustomer(profile: {
  googleId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}) {
  const email = profile.email.trim().toLowerCase();
  const byGoogleId = await findCustomerByGoogleId(profile.googleId);
  const customer = byGoogleId || await findCustomerByEmail(email) || await createCustomer({
    name: profile.name || email.split('@')[0],
    email,
    google_id: profile.googleId,
    provider: 'google',
    email_verified: profile.emailVerified
  });

  await verifyCustomerEmail(customer.id);
  const verifiedCustomer = await findCustomerById(customer.id);
  await createCustomerSession(verifiedCustomer || customer);
  return toPublicCustomer(verifiedCustomer || customer);
}
