'use client';

import { useActionState } from 'react';
import { loginAdmin, type LoginState } from '@/app/admin/actions';

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">SECURE ADMIN</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary">
          Sign In
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Access catalog, product, and testimonial controls.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
            Username
          </span>
          <input
            name="username"
            autoComplete="username"
            className="w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container"
            placeholder="admin"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container"
            placeholder="apex-admin"
            required
          />
        </label>
      </div>

      {state.error && (
        <p className="mt-4 border border-secondary-container/40 bg-secondary-container/10 px-4 py-3 text-sm text-secondary">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary-container px-6 py-3 font-label-caps text-xs font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-lg">{pending ? 'sync' : 'login'}</span>
        {pending ? 'Signing in' : 'Enter Admin'}
      </button>
    </form>
  );
}
