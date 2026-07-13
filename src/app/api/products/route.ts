import { NextResponse } from 'next/server';
import { createProduct, getProducts, ProductInput } from '@/lib/db';

function parseProductPayload(payload: any): ProductInput {
  const requiredFields = [
    'name',
    'slug',
    'price',
    'category',
    'image_url',
    'colorway',
    'weight_grams',
    'traction_type',
    'description'
  ];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
      throw new Error(`${field} is required`);
    }
  }

  const price = Number(payload.price);
  const originalPrice = payload.original_price === '' || payload.original_price === null || payload.original_price === undefined
    ? null
    : Number(payload.original_price);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('price must be a positive number');
  }
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice <= 0)) {
    throw new Error('original_price must be empty or a positive number');
  }

  return {
    name: String(payload.name).trim(),
    slug: String(payload.slug).trim().toLowerCase(),
    price,
    original_price: originalPrice,
    category: String(payload.category).trim(),
    image_url: String(payload.image_url).trim(),
    colorway: String(payload.colorway).trim(),
    weight_grams: String(payload.weight_grams).trim(),
    traction_type: String(payload.traction_type).trim(),
    description: String(payload.description).trim(),
    type_chip: payload.type_chip ? String(payload.type_chip).trim() : null,
    tags: payload.tags ? String(payload.tags).trim() : null
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    
    const products = await getProducts(category);
    return NextResponse.json(products);
  } catch (e: any) {
    console.error('Error fetching products API:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const product = parseProductPayload(payload);
    const createdProduct = await createProduct(product);

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (e: any) {
    console.error('Error creating product API:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
