import Image from 'next/image';
import Link from 'next/link';
import { getOrdersForCustomer } from '@/lib/db';
import { requireCustomerSession } from '@/lib/customerAuth';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(value));
}

export default async function OrdersPage() {
  const customer = await requireCustomerSession('/orders');
  const orders = await getOrdersForCustomer(customer.id);

  return (
    <main className="relative min-h-[80vh] px-margin-mobile md:px-margin-desktop py-16 bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-[0.28em] font-bold">
              Customer Orders
            </p>
            <h1 className="font-headline-lg-mobile text-5xl md:text-7xl uppercase italic tracking-wide leading-none text-primary">
              My Orders
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant/80 max-w-xl leading-relaxed">
              Review your Apex checkout history and order contents.
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-wider text-primary-container hover:underline"
          >
            <span className="material-symbols-outlined text-base">account_circle</span>
            Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <section className="border border-white/10 bg-surface-container-low p-10 text-center space-y-5">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
              inventory_2
            </span>
            <div className="space-y-2">
              <h2 className="font-headline-md text-3xl uppercase italic text-primary">
                No Orders Yet
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant/75 max-w-md mx-auto">
                Your completed purchases will appear here after checkout.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary-container text-black font-headline-md text-lg uppercase italic font-black px-6 py-4"
            >
              Start Shopping
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="border border-white/10 bg-surface-container-low overflow-hidden">
                <div className="p-5 md:p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-wider">
                      Order AX-{order.id}
                    </p>
                    <Link href={`/orders/${order.id}`} className="block hover:underline mt-2">
                      <h2 className="font-headline-md text-3xl uppercase italic text-primary leading-none">
                        {formatDate(order.created_at)}
                      </h2>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="border border-white/10 px-3 py-2 font-label-caps text-[10px] uppercase text-on-surface-variant">
                      {order.status}
                    </span>
                    <span className="border border-primary-container/30 px-3 py-2 font-label-caps text-[10px] uppercase text-primary-container">
                      RM {order.total.toFixed(2)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-surface-container-highest border border-white/10 px-4 py-2 font-label-caps text-[10px] text-primary hover:bg-white hover:text-black transition-colors uppercase cursor-pointer"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.product_id}-${item.size}`} className="p-5 md:p-6 flex gap-4">
                      <div className="w-20 h-20 bg-surface-container-high/50 border border-white/5 relative overflow-hidden shrink-0">
                        <Image
                          src={item.product_image_url}
                          alt={item.product_name}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-headline-md text-xl uppercase italic text-primary leading-tight">
                            {item.product_name}
                          </h3>
                          <p className="font-label-caps text-[9px] text-on-surface-variant/65 uppercase mt-1">
                            US {item.size} / QTY: {String(item.qty).padStart(2, '0')}
                          </p>
                        </div>
                        <p className="font-stats-value text-xl text-primary-container shrink-0">
                          RM {(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 md:p-6 bg-surface-container-lowest/60 grid grid-cols-1 sm:grid-cols-5 gap-3 font-label-caps text-[10px] uppercase">
                  <div className="text-on-surface-variant">
                    Subtotal <span className="text-primary">RM {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="text-on-surface-variant">
                    Discount <span className="text-secondary">{order.discount && order.discount > 0 ? `-RM ${order.discount.toFixed(2)}` : '—'}</span>
                  </div>
                  <div className="text-on-surface-variant">
                    Tax <span className="text-primary">RM {order.tax.toFixed(2)}</span>
                  </div>
                  <div className="text-on-surface-variant">
                    Total <span className="text-primary-container">RM {order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-on-surface-variant">
                    Ship To <span className="text-primary">{order.city}, {order.zip_code}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
