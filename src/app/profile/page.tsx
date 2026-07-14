import Link from 'next/link';
import { requireCustomerSession } from '@/lib/customerAuth';

export default async function ProfilePage() {
  const customer = await requireCustomerSession('/profile');

  return (
    <main className="relative min-h-[80vh] px-margin-mobile md:px-margin-desktop py-16 bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-[0.28em] font-bold">
            Customer Profile
          </p>
          <h1 className="font-headline-lg-mobile text-5xl md:text-7xl uppercase italic tracking-wide leading-none text-primary">
            My Account
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant/80 max-w-xl leading-relaxed">
            Manage your Apex customer access and review your order history.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 border border-white/10 bg-surface-container-low p-6 md:p-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-primary-container text-black flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-4xl">account_circle</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                  Signed in as
                </p>
                <h2 className="font-headline-md text-3xl uppercase italic text-primary leading-none mt-2">
                  {customer.name}
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant/80 mt-2 break-all">
                  {customer.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-surface-container-low p-6 md:p-8 space-y-4">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                Provider
              </p>
              <p className="font-headline-md text-2xl uppercase italic text-primary mt-1">
                {customer.provider}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                Email Status
              </p>
              <p className="font-label-caps text-[10px] uppercase text-primary-container mt-2">
                {customer.email_verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="border border-white/10 bg-surface-container-low p-6 hover:border-primary-container/50 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-wider">
                  Orders
                </p>
                <h3 className="font-headline-md text-3xl uppercase italic text-primary leading-none mt-2">
                  My Orders
                </h3>
              </div>
              <span className="material-symbols-outlined text-primary-container group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </Link>

          <Link
            href="/shop"
            className="border border-white/10 bg-surface-container-low p-6 hover:border-primary-container/50 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-wider">
                  Shop
                </p>
                <h3 className="font-headline-md text-3xl uppercase italic text-primary leading-none mt-2">
                  Continue Shopping
                </h3>
              </div>
              <span className="material-symbols-outlined text-primary-container group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
