'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/app/admin/actions';

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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-white/10 bg-surface-container-low lg:sticky lg:top-0 lg:h-screen">
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 border-b border-white/10 pb-5">
          <p className="font-label-caps text-[10px] text-primary-container tracking-widest">APEX ADMIN</p>
          <p className="mt-2 font-headline-md text-2xl uppercase italic leading-none text-primary">
            Control Room
          </p>
        </div>

        <nav className="grid gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 font-label-caps text-[11px] transition-colors ${active
                    ? 'bg-primary-container text-black'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={logoutAdmin} className="mt-auto pt-6">
          <button
            type="submit"
            className="flex w-full items-center gap-3 border border-white/10 px-3 py-3 font-label-caps text-[11px] text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
