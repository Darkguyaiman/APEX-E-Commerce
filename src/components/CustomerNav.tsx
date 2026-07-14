'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Customer = {
  name: string;
  email: string;
};

export default function CustomerNav() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setCustomer(data.customer || null);
      })
      .catch(() => {
        if (mounted) setCustomer(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCustomer(null);
    setIsOpen(false);
    router.refresh();
  }

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      {!customer ? (
        <button
          onClick={toggleDropdown}
          className="material-symbols-outlined hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 cursor-pointer block text-primary"
          aria-label="Customer options"
          title="Sign in options"
        >
          person
        </button>
      ) : (
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-150 p-2 cursor-pointer text-primary"
          title={`Options for ${customer.email}`}
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="hidden xl:block font-label-caps text-[10px] uppercase max-w-28 truncate">
            {customer.name}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 border border-white/10 bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-2 z-50 animate-fade-in">
          {!customer ? (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:bg-white/5 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">login</span>
                LOG IN
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:bg-white/5 hover:text-primary transition-colors border-t border-white/5"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                SIGN UP
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:bg-white/5 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                PROFILE
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-label-caps text-[10px] tracking-wider text-on-surface-variant hover:bg-white/5 hover:text-primary transition-colors border-t border-white/5"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                MY ORDERS
              </Link>
              <button
                onClick={logout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 font-label-caps text-[10px] tracking-wider text-secondary hover:bg-secondary/15 transition-colors cursor-pointer border-t border-white/5"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                SIGN OUT
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
