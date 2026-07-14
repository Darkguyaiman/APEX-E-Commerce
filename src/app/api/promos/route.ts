import { NextResponse } from 'next/server';
import { getPromoCodes, getPromoCodeByCode, createPromoCode, type PromoCodeInput } from '@/lib/db';
import { isAdminRequest } from '@/lib/adminAuth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal server error';
}

function parsePromoPayload(payload: any): PromoCodeInput {
  if (!payload.code || !String(payload.code).trim()) {
    throw new Error('Code is required');
  }
  if (!payload.type || !['percent', 'fixed', 'free_item'].includes(payload.type)) {
    throw new Error('Type must be percent, fixed, or free_item');
  }
  if (payload.applies_to && !['all', 'specific'].includes(payload.applies_to)) {
    throw new Error('Applies to must be all or specific');
  }

  const value = parseFloat(payload.value || '0');
  const min_spend = parseFloat(payload.min_spend || '0');

  if (isNaN(value) || value < 0) {
    throw new Error('Invalid discount value');
  }
  if (isNaN(min_spend) || min_spend < 0) {
    throw new Error('Invalid minimum spend');
  }

  return {
    code: String(payload.code).trim().toUpperCase(),
    type: payload.type,
    value,
    min_spend,
    applies_to: payload.applies_to || 'all',
    product_ids: payload.product_ids ? String(payload.product_ids).trim() : null
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // Public validation query
    if (code) {
      const promo = await getPromoCodeByCode(code);
      if (!promo) {
        return NextResponse.json({ error: 'Invalid promo code' }, { status: 404 });
      }
      return NextResponse.json(promo);
    }

    // Admin authorization to list all
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const promos = await getPromoCodes();
    return NextResponse.json(promos);
  } catch (e: unknown) {
    console.error('Error fetching promos API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = parsePromoPayload(payload);
    
    // Check if code already exists
    const existing = await getPromoCodeByCode(parsed.code);
    if (existing) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
    }

    const created = await createPromoCode(parsed);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.error('Error creating promo API:', e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
