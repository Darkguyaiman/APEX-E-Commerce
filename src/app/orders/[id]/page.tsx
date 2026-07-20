import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrderById } from '@/lib/db';
import { requireCustomerSession } from '@/lib/customerAuth';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const customer = await requireCustomerSession('/orders');
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    redirect('/orders');
  }

  const order = await getOrderById(orderId);
  
  // Verify the order exists and belongs to this customer
  if (!order || order.customer_id !== customer.id) {
    redirect('/orders');
  }

  return (
    <main className="relative min-h-[90vh] px-margin-mobile md:px-margin-desktop py-16 bg-background overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="carbon-pattern absolute inset-0 opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-wider text-primary-container hover:underline"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            Back to Orders
          </Link>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <p className="font-label-caps text-[10px] text-primary-container uppercase tracking-wider">
              ORDER TRANSACTION ID: AX-{order.id}
            </p>
            <h1 className="font-headline-lg-mobile text-4xl md:text-5xl uppercase italic tracking-wide leading-none text-primary">
              ORDER DETAILS
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant/80 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="border border-white/10 px-4 py-2 font-label-caps text-xs uppercase text-on-surface-variant bg-surface-container-low font-bold">
              STATUS: {order.status}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cleat Items list */}
          <section className="lg:col-span-8 border border-white/10 bg-surface-container-low divide-y divide-white/10">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.product_id}-${item.size}`} className="p-6 flex gap-4">
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
          </section>

          {/* Checkout DNA summaries */}
          <section className="lg:col-span-4 space-y-6">
            {/* Address DNA */}
            <div className="border border-white/10 bg-surface-container-low p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-base">local_shipping</span>
                <h2 className="font-headline-md text-lg uppercase italic text-primary">SHIPPING DNA</h2>
              </div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 space-y-2 leading-relaxed">
                <p>NAME: <strong className="text-primary">{order.first_name} {order.last_name}</strong></p>
                <p>ADDRESS: <strong className="text-primary">{order.address}</strong></p>
                <p>CITY: <strong className="text-primary">{order.city}</strong></p>
                <p>ZIP CODE: <strong className="text-primary">{order.zip_code}</strong></p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border border-white/10 bg-surface-container-low p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-base">payments</span>
                <h2 className="font-headline-md text-lg uppercase italic text-primary">BILLING SUMMARY</h2>
              </div>
              <div className="font-label-caps text-[10px] text-on-surface-variant/80 space-y-3 leading-relaxed">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-primary font-bold">RM {order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount && order.discount > 0 ? (
                  <div className="flex justify-between text-secondary">
                    <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                    <span className="font-bold">-RM {order.discount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="text-primary font-bold">RM {order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
                  <span>Total</span>
                  <span className="text-primary-container font-stats-value">RM {order.total.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p>PAYMENT METHOD: <strong className="text-primary">{order.payment_method}</strong></p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Delivery Proof segment */}
        {order.status === 'delivered' && (
          <div className="border border-white/10 bg-surface-container-low p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-xl">verified</span>
              <h2 className="font-headline-lg-mobile text-2xl uppercase tracking-wide italic text-primary leading-none">
                DELIVERY PROOF
              </h2>
            </div>
            
            {order.delivery_proof ? (
              <div className="space-y-4">
                <p className="font-body-md text-xs text-on-surface-variant/80">
                  Your package has been successfully dropped. Review the proof image verified by the courier:
                </p>
                <div className="relative max-w-md border border-white/10 overflow-hidden bg-black/20">
                  <a
                    href={order.delivery_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-zoom-in"
                  >
                    <Image
                      src={order.delivery_proof}
                      alt="Delivery proof verification screenshot"
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain max-h-[350px] hover:scale-[1.01] transition-transform"
                      unoptimized
                    />
                  </a>
                </div>
              </div>
            ) : (
              <p className="font-label-caps text-xs text-secondary tracking-wider">
                DELIVERY PROOF FILE PENDING COURIER UPLOAD
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
