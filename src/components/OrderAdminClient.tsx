'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { AdminOrder } from '@/lib/db';

const orderStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const fieldClass = 'w-full bg-surface-container border border-white/10 px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/70 focus:border-primary-container';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export default function OrderAdminClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return orders;

    return orders.filter((order) => {
      return [
        `AX-${order.id}`,
        order.status,
        order.first_name,
        order.last_name,
        order.customer_name || '',
        order.customer_email || '',
        order.city,
        order.zip_code
      ].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [orders, query]);

  async function handleStatusChange(orderId: number, status: string) {
    const previousOrders = orders;
    setUpdatingId(orderId);
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not update order status');
      }
    } catch (error) {
      setOrders(previousOrders);
      alert(error instanceof Error ? error.message : 'Could not update order status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleUploadProof(orderId: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUpdatingId(orderId);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 1. Upload proof file via existing image upload endpoint
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Failed to upload proof image');
      }
      
      const proofUrl = uploadData.url;
      
      // 2. Patch order with delivery_proof
      const patchRes = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered', delivery_proof: proofUrl })
      });
      const patchData = await patchRes.json();
      
      if (!patchRes.ok) {
        throw new Error(patchData.error || 'Failed to update order proof');
      }
      
      // 3. Update orders local state
      setOrders(current => current.map(o => o.id === orderId ? { ...o, delivery_proof: proofUrl, status: 'delivered' } : o));
    } catch (err: any) {
      alert(err.message || 'Error uploading delivery proof');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md">
        <label className="sr-only" htmlFor="order-search">Search orders</label>
        <div className="relative">
          <input
            id="order-search"
            className={`${fieldClass} pr-11`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order, customer, status, or city..."
          />
          <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant">search</span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="border border-white/10 bg-surface-container-low p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">receipt_long</span>
          <p className="mt-4 font-headline-md text-3xl uppercase italic text-primary">
            No Orders Found
          </p>
          <p className="mt-2 text-sm text-on-surface-variant">
            New checkout orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <article key={order.id} className="border border-white/10 bg-surface-container-low">
              <div className="grid gap-5 border-b border-white/10 p-5 lg:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-label-caps text-[10px] text-primary-container tracking-widest">
                      ORDER AX-{order.id}
                    </p>
                    <span className="border border-white/10 px-2.5 py-1 font-label-caps text-[10px] uppercase text-on-surface-variant">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                  <h2 className="mt-3 font-headline-md text-3xl uppercase italic leading-none text-primary">
                    {order.customer_name || `${order.first_name} ${order.last_name}`}
                  </h2>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {order.customer_email || 'Guest checkout record'} / {order.city}, {order.zip_code}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                      Status
                    </label>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                      className="w-full bg-surface-container border border-white/10 px-3 py-3 font-label-caps text-[11px] uppercase text-primary focus:border-primary-container disabled:opacity-50"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {order.status === 'delivered' && (
                    <div className="mt-3 space-y-2 border border-white/5 bg-surface-container-low/55 p-3">
                      <p className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/80 font-bold">
                        Delivery Proof
                      </p>
                      {order.delivery_proof ? (
                        <div className="space-y-2">
                          <a
                            href={order.delivery_proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block h-20 w-full overflow-hidden border border-white/10 hover:brightness-110 transition-all"
                            title="View delivery proof file"
                          >
                            <Image
                              src={order.delivery_proof}
                              alt="Delivery proof file"
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                          </a>
                          <label className="block text-center cursor-pointer font-label-caps text-[8px] text-primary-container hover:underline">
                            Change Proof
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleUploadProof(order.id, e.target.files)}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="block border border-dashed border-white/20 p-4 text-center cursor-pointer hover:border-primary-container hover:bg-white/[0.01] transition-all">
                          <span className="material-symbols-outlined text-lg text-primary-container">upload</span>
                          <span className="block font-label-caps text-[8px] mt-1 text-on-surface-variant">
                            Upload Proof
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUploadProof(order.id, e.target.files)}
                          />
                        </label>
                      )}
                    </div>
                  )}

                  <p className="font-stats-value text-3xl text-primary-container">
                    RM {order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.product_id}-${item.size}`} className="flex gap-4 p-5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/5 bg-surface-container-high/50">
                      <Image
                        src={item.product_image_url}
                        alt={item.product_name}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-headline-md text-xl uppercase italic leading-tight text-primary">
                        {item.product_name}
                      </p>
                      <p className="mt-1 font-label-caps text-[9px] uppercase text-on-surface-variant/70">
                        Product #{item.product_id} / US {item.size} / Qty {item.qty}
                      </p>
                    </div>
                    <p className="font-stats-value text-lg text-primary-container">
                      RM {(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 bg-surface-container-lowest/70 p-5 font-label-caps text-[10px] uppercase text-on-surface-variant sm:grid-cols-6">
                <span>Subtotal <strong className="text-primary">RM {order.subtotal.toFixed(2)}</strong></span>
                {order.discount && order.discount > 0 ? (
                  <span>Discount <strong className="text-secondary-container">-{order.coupon_code ? `${order.coupon_code} (-RM ${order.discount.toFixed(2)})` : `RM ${order.discount.toFixed(2)}`}</strong></span>
                ) : (
                  <span>Discount <strong className="text-on-surface-variant/40">—</strong></span>
                )}
                <span>Tax <strong className="text-primary">RM {order.tax.toFixed(2)}</strong></span>
                <span>Total <strong className="text-primary-container">RM {order.total.toFixed(2)}</strong></span>
                <span>Payment <strong className="text-primary">{order.payment_method}</strong></span>
                <span>Ship <strong className="text-primary">{order.address}</strong></span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
