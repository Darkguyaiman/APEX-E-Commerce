'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none"></div>

      {/* Glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <span className="font-label-caps text-xs text-primary-container tracking-widest border-l-2 border-primary-container pl-3 block mb-4 uppercase select-none">
          Get in Touch
        </span>
        <h1 className="font-headline-lg text-4xl md:text-6xl uppercase italic leading-none tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="max-w-xl font-body-md text-sm text-on-surface-variant/80 leading-relaxed mb-12">
          Have a question about a product, need sizing advice, or want to collaborate? Drop us a message and we&apos;ll get back to you within 24 hours.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Form */}
          <div className="border border-white/10 bg-surface-container-low/30 p-6 md:p-10">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-container/15 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary-container text-3xl">check_circle</span>
                </div>
                <h2 className="font-headline-md text-2xl uppercase italic text-primary mb-2">Message Sent</h2>
                <p className="font-body-md text-sm text-on-surface-variant/70 max-w-sm">
                  Thank you for reaching out. Our team will review your message and respond shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 font-label-caps text-xs text-primary-container hover:text-primary transition-colors cursor-pointer underline"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest block mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-surface border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:border-primary-container/50 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-surface border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:border-primary-container/50 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest block mb-2">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-surface border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:border-primary-container/50 focus:outline-none transition-colors"
                    placeholder="Product inquiry, sizing help, collaboration..."
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest block mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-surface border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:border-primary-container/50 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {status === 'error' && (
                  <p className="font-label-caps text-xs text-red-400">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center gap-2 bg-primary-container text-black px-8 py-4 font-label-caps text-xs font-bold transition-all hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      SENDING...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm font-bold">send</span>
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="border border-white/10 bg-surface-container-low/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-container text-xl">chat</span>
                <h3 className="font-headline-md text-lg uppercase italic text-primary">WhatsApp</h3>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant/70 mb-4">
                Need immediate help? Chat with us directly on WhatsApp.
              </p>
              <a
                href="https://wa.me/601121194948"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 px-5 py-3 font-label-caps text-[10px] text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                OPEN WHATSAPP
              </a>
            </div>

            <div className="border border-white/10 bg-surface-container-low/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-container text-xl">mail</span>
                <h3 className="font-headline-md text-lg uppercase italic text-primary">Email</h3>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant/70 mb-2">
                For detailed inquiries, email us at:
              </p>
              <p className="font-mono text-xs text-primary-container">
                support@apex.yourbackpack.tech
              </p>
            </div>

            <div className="border border-white/10 bg-surface-container-low/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-container text-xl">schedule</span>
                <h3 className="font-headline-md text-lg uppercase italic text-primary">Hours</h3>
              </div>
              <div className="space-y-2 font-body-md text-xs text-on-surface-variant/70">
                <div className="flex justify-between">
                  <span>Mon — Fri</span>
                  <span className="text-primary">9:00 — 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-primary">10:00 — 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-on-surface-variant/40">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-white/15 hover:bg-white/5 py-3 px-6 text-xs font-label-caps text-primary transition-all select-none"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
