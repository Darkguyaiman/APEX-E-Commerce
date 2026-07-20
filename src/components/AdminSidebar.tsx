'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/app/admin/actions';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { href: '/admin/categories', label: 'Categories', icon: 'category' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'rate_review' },
  { href: '/admin/messages', label: 'Messages', icon: 'inbox' },
  { href: '/admin/memberships', label: 'Memberships', icon: 'badge' },
  { href: '/admin/promos', label: 'Promo Codes', icon: 'local_offer' }
];

function isNavItemActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-6 border-b border-white/10 pb-5">
        <p className="font-label-caps text-[10px] text-primary-container tracking-widest">APEX ADMIN</p>
        <p className="mt-2 font-headline-md text-2xl uppercase italic leading-none text-primary">
          Control Room
        </p>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 font-label-caps text-[11px] transition-colors ${active
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <ThemeToggle
          label
          className="mb-3 flex w-full justify-start border border-white/10 px-3 py-3 font-label-caps text-[11px] text-on-surface-variant hover:bg-white/5 hover:text-primary"
        />
      </div>

      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 border border-white/10 px-3 py-3 font-label-caps text-[11px] text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </form>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-surface-container-low px-4 py-3 lg:hidden">
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-primary transition-colors hover:bg-white/5"
          aria-label={isOpen ? 'Close admin navigation' : 'Open admin navigation'}
          aria-expanded={isOpen}
          aria-controls="admin-mobile-sidebar"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
        <div>
          <p className="font-label-caps text-[10px] text-primary-container tracking-widest">APEX ADMIN</p>
          <p className="mt-1 font-headline-md text-xl uppercase italic leading-none text-primary">
            Control Room
          </p>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/45 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <aside
        id="admin-mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[min(320px,85vw)] overflow-y-auto overscroll-contain border-r border-white/10 bg-surface-container-low transition-transform duration-200 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-end border-b border-white/10 bg-surface-container-low px-4 py-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/10 text-primary transition-colors hover:bg-white/5"
              aria-label="Close admin navigation"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {sidebarContent}
        </div>
      </aside>

      <aside className="hidden border-r border-white/10 bg-surface-container-low lg:sticky lg:top-0 lg:block lg:h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
