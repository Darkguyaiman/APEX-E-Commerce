import OrderAdminClient from '@/components/OrderAdminClient';
import { getAdminOrders } from '@/lib/db';

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="px-margin-mobile py-10 md:px-10">
      <div className="mb-8 border-b border-white/10 pb-8">
        <p className="font-label-caps text-xs text-primary-container tracking-widest">ORDERS</p>
        <h1 className="mt-2 font-headline-lg text-5xl uppercase italic leading-none text-primary md:text-6xl">
          Order Control
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Review incoming checkout orders and update fulfillment status for customers.
        </p>
      </div>
      <OrderAdminClient initialOrders={orders} />
    </div>
  );
}
