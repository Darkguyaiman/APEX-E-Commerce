import { NextResponse } from 'next/server';
import { createOrder, getProductById } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      address,
      city,
      zip_code,
      payment_method,
      card_number,
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

    const tax = Number((subtotal * 0.08).toFixed(2)); // Projected 8% tax
    const total = Number((subtotal + tax).toFixed(2));

    const orderId = await createOrder({
      first_name,
      last_name,
      address,
      city,
      zip_code,
      payment_method,
      card_number,
      subtotal,
      tax,
      total
    }, orderItems);

    return NextResponse.json({
      success: true,
      orderId,
      subtotal,
      tax,
      total
    });
  } catch (e: any) {
    console.error('Error processing checkout API:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
