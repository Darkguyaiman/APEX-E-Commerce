'use server';

import { clearAdminSession, createAdminSession, validateAdminCredentials } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export type LoginState = {
  error?: string;
};

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!username || !password) {
    return { error: 'Enter your admin username and password.' };
  }

  if (!validateAdminCredentials(username, password)) {
    return { error: 'Invalid admin credentials.' };
  }

  await createAdminSession(username);
  redirect('/admin');
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect('/admin/login');
}
