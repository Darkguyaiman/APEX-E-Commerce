'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Mode = 'login' | 'signup';

export default function CustomerAuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/shop';
  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setFormError('');
    setMessage('');

    const formData = new FormData(form);
    const response = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      })
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setFormError(data.error || 'Authentication failed.');
      return;
    }

    if (isSignup) {
      setMessage(data.message || 'Account created. Verify your email before logging in.');
      form.reset();
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm space-y-8 mx-auto">
      <div className="space-y-3">
        <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-[0.28em] font-bold">
          Apex Customer Access
        </p>
        <h1 className="font-headline-lg-mobile text-5xl uppercase italic tracking-wide leading-none text-primary">
          {isSignup ? 'Create Account' : 'Sign In'}
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
          {isSignup
            ? 'Use email verification before checkout, or continue instantly with Google.'
            : 'Sign in to unlock secure checkout and keep your order tied to your profile.'}
        </p>
      </div>

      {verified === '1' && (
        <div className="border border-primary-container/30 bg-primary-container/10 px-4 py-3 font-label-caps text-[10px] uppercase text-primary-container">
          Email verified. You can sign in now.
        </div>
      )}
      {verified === '0' && (
        <div className="border border-secondary-container/40 bg-secondary-container/10 px-4 py-3 font-label-caps text-[10px] uppercase text-secondary-container">
          Verification link is invalid or expired.
        </div>
      )}
      {error === 'google_config' && (
        <div className="border border-secondary-container/40 bg-secondary-container/10 px-4 py-3 font-label-caps text-[10px] uppercase text-secondary-container">
          Google OAuth is not configured yet.
        </div>
      )}
      {error === 'google' && (
        <div className="border border-secondary-container/40 bg-secondary-container/10 px-4 py-3 font-label-caps text-[10px] uppercase text-secondary-container">
          Google sign in failed. Try again.
        </div>
      )}

      <a
        href={`/api/auth/google?next=${encodeURIComponent(next)}`}
        className="w-full h-14 bg-primary text-black font-headline-md text-xl uppercase italic font-black flex items-center justify-center gap-3 hover:bg-primary-container transition-colors"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </a>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="font-label-caps text-[9px] text-on-surface-variant/50 uppercase">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div className="space-y-2">
            <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
              Name
            </label>
            <input
              required
              name="name"
              type="text"
              className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Alex Morgan"
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
            Email
          </label>
          <input
            required
            name="email"
            type="email"
            className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="font-label-caps text-[10px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
            Password
          </label>
          <input
            required
            minLength={8}
            name="password"
            type="password"
            className="w-full bg-surface-container border border-white/10 rounded-none p-4 text-primary font-bold focus:ring-1 focus:ring-primary-container transition-all"
            placeholder="Minimum 8 characters"
          />
        </div>

        {formError && <p className="font-label-caps text-[10px] uppercase text-secondary-container">{formError}</p>}
        {message && <p className="font-label-caps text-[10px] uppercase text-primary-container">{message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary-container disabled:bg-surface-container-highest disabled:text-on-surface-variant/45 text-black font-headline-md text-lg py-5 flex justify-center items-center gap-3 active:scale-[0.98] transition-all cursor-pointer font-bold text-center"
        >
          <span className="uppercase font-black">{pending ? 'Processing' : isSignup ? 'Sign Up' : 'Sign In'}</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </form>

      <p className="font-body-md text-sm text-on-surface-variant/70">
        {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link
          href={`${isSignup ? '/login' : '/signup'}?next=${encodeURIComponent(next)}`}
          className="text-primary-container font-bold hover:underline"
        >
          {isSignup ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </div>
  );
}
