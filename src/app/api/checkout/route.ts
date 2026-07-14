import { NextResponse } from 'next/server';
import { createOrder, getProductById, getPromoCodeByCode } from '@/lib/db';
import { getCustomerSession } from '@/lib/customerAuth';

export async function POST(request: Request) {
  try {
    const customer = await getCustomerSession();
    if (!customer) {
      return NextResponse.json({ error: 'Sign in before checkout.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      first_name,
      last_name,
      address,
      city,
      zip_code,
      payment_method,
      card_number,
      coupon_code,
      items
    } = body;

    // Validate inputs
    if (!first_name || !last_name || !address || !city || !zip_code || !payment_method) {
      return NextResponse.json({ error: 'Missing required shipping or payment fields' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Process and calculate totals from backend products to prevent user tampering
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const product = await getProductById(cartItem.id);
      if (!product) {
        return NextResponse.json({ error: `Product ID ${cartItem.id} not found` }, { status: 404 });
      }

      const price = Number(product.price);
      const qty = Number(cartItem.qty || 1);
      subtotal += price * qty;

      orderItems.push({
        product_id: product.id,
        size: cartItem.size,
        qty: qty,
        price: price
      });
    }

    // Backend validation of promo code
    let discount = 0;
    if (coupon_code) {
      const promo = await getPromoCodeByCode(coupon_code);
      if (promo) {
        // Validate min spend
        if (subtotal < Number(promo.min_spend)) {
          return NextResponse.json({ error: `Minimum spend of RM ${Number(promo.min_spend).toFixed(2)} is required for this code.` }, { status: 400 });
        }

        if (promo.type === 'percent') {
          const pct = Number(promo.value) / 100;
          if (promo.applies_to === 'all') {
            discount = Number((subtotal * pct).toFixed(2));
          } else {
            const targetIds = (promo.product_ids || '').split(',').map(id => id.trim());
            const eligibleSubtotal = orderItems
              .filter(item => targetIds.includes(String(item.product_id)))
              .reduce((sum, item) => sum + item.price * item.qty, 0);
            discount = Number((eligibleSubtotal * pct).toFixed(2));
          }
        } else if (promo.type === 'fixed') {
          const amt = Number(promo.value);
          if (promo.applies_to === 'all') {
            discount = Math.min(amt, subtotal);
          } else {
            const targetIds = (promo.product_ids || '').split(',').map(id => id.trim());
            const eligibleSubtotal = orderItems
              .filter(item => targetIds.includes(String(item.product_id)))
              .reduce((sum, item) => sum + item.price * item.qty, 0);
            discount = Math.min(amt, eligibleSubtotal);
          }
        } else if (promo.type === 'free_item') {
          const targetFreeProductId = (promo.product_ids || '').trim();
          let freeItem = orderItems.find(item => String(item.product_id) === targetFreeProductId);
          if (!freeItem) {
            const pid = parseInt(targetFreeProductId, 10);
            const freeProduct = await getProductById(pid);
            if (freeProduct) {
              const defaultSize = orderItems.length > 0 ? orderItems[0].size : '9';
              const pPrice = Number(freeProduct.price);
              orderItems.push({
                product_id: freeProduct.id,
                size: defaultSize,
                qty: 1,
                price: pPrice
              });
              subtotal += pPrice;
              freeItem = {
                product_id: freeProduct.id,
                size: defaultSize,
                qty: 1,
                price: pPrice
              };
            } else {
              return NextResponse.json({ error: `Promotional free product ID ${targetFreeProductId} not found` }, { status: 404 });
            }
          }
          discount = freeItem.price;
        }
      }
    }

    const tax = Number((subtotal * 0.08).toFixed(2)); // Projected 8% tax
    const total = Number((subtotal + tax - discount).toFixed(2));

    const orderId = await createOrder({
      customer_id: customer.id,
      first_name,
      last_name,
      address,
      city,
      zip_code,
      payment_method,
      card_number,
      subtotal,
      tax,
      total,
      coupon_code: coupon_code || null,
      discount: discount
    }, orderItems);

    return NextResponse.json({
      success: true,
      orderId,
      subtotal,
      tax,
      discount,
      total
    });
  } catch (e: unknown) {
    console.error('Error processing checkout API:', e);
    const message = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
