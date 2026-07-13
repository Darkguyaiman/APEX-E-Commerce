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
    <footer className="hidden md:block py-20 px-margin-desktop border-t border-white/5 bg-surface-container-lowest select-none">
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
          <p className="text-on-surface-variant/80 font-body-md leading-relaxed">
            Building the future of athletic performance through precision engineering and data-driven design.
          </p>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-primary mb-6">PRODUCTS</h5>
          <ul className="space-y-4 text-on-surface-variant font-body-md">
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop/men">
                Men's Elite
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop/women">
                Women's Pro
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/shop/men">
                Kids Gear
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary-container transition-colors" href="/product/apex-gold-elite">
                Limited Editions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-label-caps text-label-caps text-primary mb-6">SUPPORT</h5>
          <ul className="space-y-4 text-on-surface-variant font-body-md">
            <li>
              <a className="hover:text-primary-container transition-colors cursor-pointer" onClick={() => alert('Fast 48H deployment configured on orders.')}>
                Shipping & Returns
              </a>
            </li>
            <li>
              <a className="hover:text-primary-container transition-colors cursor-pointer" onClick={() => alert('Anatomical last dimensions match regular boots.')}>
                Size Guide
              </a>
            </li>
            <li>
              <a className="hover:text-primary-container transition-colors cursor-pointer" onClick={() => alert('Contact: grid-support@corex.performance')}>
                Contact Us
              </a>
            </li>
            <li>
              <a className="hover:text-primary-container transition-colors cursor-pointer" onClick={() => alert('Exclusive stockists available in London, Milan, Manchester.')}>
                Retailers
              </a>
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
              className="bg-surface border border-white/10 px-4 py-2 font-label-caps text-label-caps w-full focus:outline-none focus:border-primary-container transition-all"
              placeholder="EMAIL ADDRESS"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-black p-2 hover:bg-primary-container hover:text-black transition-colors flex items-center justify-center cursor-pointer"
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
      <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-on-surface-variant/40 font-label-caps text-[10px]">
        <span>© {new Date().getFullYear()} APEX PERFORMANCE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8">
          <a className="hover:text-primary cursor-pointer">PRIVACY POLICY</a>
          <a className="hover:text-primary cursor-pointer">TERMS OF SERVICE</a>
          <a className="hover:text-primary cursor-pointer">COOKIES</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
