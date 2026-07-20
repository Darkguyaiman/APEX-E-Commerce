'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="hidden md:block py-20 px-margin-desktop border-t border-primary/5 bg-surface-container-lowest select-none">
      <div className="max-w-container-max mx-auto grid grid-cols-4 gap-gutter">
        <div className="col-span-1">
          <div className="flex items-center gap-2.5 mb-6">
            <Image
              src="/apex-logo.png"
              alt="Apex Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-contain shadow-md"
            />
            <span className="font-headline-lg-mobile text-3xl md:text-4xl italic font-black text-primary tracking-tighter leading-none">
              APEX
            </span>
          </div>
          <p className="text-on-surface-variant/80 font-body-md leading-relaxed mb-6">
            Building the future of athletic performance through precision engineering and data-driven design.
          </p>
          <div className="flex gap-4 items-center">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant/65 hover:text-primary transition-colors cursor-pointer"
              title="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant/65 hover:text-primary transition-colors cursor-pointer"
              title="X (Twitter)"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant/65 hover:text-primary transition-colors cursor-pointer"
              title="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a 
              href="https://wa.me/601121194948" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant/65 hover:text-primary transition-colors cursor-pointer"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-primary mb-6">PRODUCTS</h5>
          <ul className="space-y-4 text-on-surface-variant font-body-md">
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop?category=men">
                Men&apos;s Elite
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop?category=women">
                Women&apos;s Pro
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop?category=kit">
                Kits &amp; Equipment
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-primary mb-6">SUPPORT</h5>
          <ul className="space-y-4 text-on-surface-variant font-body-md">
            <li>
              <Link className="hover:text-primary-container transition-colors cursor-pointer" href="/shipping-returns">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors cursor-pointer" href="/size-guide">
                Size Guide
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors cursor-pointer" href="/contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors cursor-pointer" href="/retailers">
                Retailers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-primary mb-6">JOIN THE LAB</h5>
          <p className="text-on-surface-variant/80 font-body-md mb-4">
            Get early access to tech drops and inventory cycles.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="bg-surface-container-low border border-primary/10 text-primary placeholder:text-on-surface-variant/50 px-4 py-2 font-label-caps text-label-caps w-full focus:outline-none focus:border-primary-container transition-all"
              placeholder="EMAIL ADDRESS"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-background p-2 hover:bg-primary-container hover:text-background transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined">{subscribed ? 'check' : 'send'}</span>
            </button>
          </form>
          {subscribed && (
            <p className="font-label-caps text-[10px] text-primary-container mt-2">
              GRID ACCESS CONFIRMED.
            </p>
          )}
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-primary/10 flex justify-between items-center text-on-surface-variant font-bold font-label-caps text-[10px]">
        <span>© {new Date().getFullYear()} APEX PERFORMANCE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8">
          <Link href="/privacy-policy" className="hover:text-primary cursor-pointer transition-colors">PRIVACY POLICY</Link>
          <Link href="/terms-of-service" className="hover:text-primary cursor-pointer transition-colors">TERMS OF SERVICE</Link>
          <Link href="/cookies" className="hover:text-primary cursor-pointer transition-colors">COOKIES</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
