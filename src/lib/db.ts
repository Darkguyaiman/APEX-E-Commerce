import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load static products for local fallback
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  colorway: string;
  weight_grams: string;
  traction_type: string;
  description: string;
  type_chip: string | null;
  tags: string | null;
}

export interface ProductInput {
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  colorway: string;
  weight_grams: string;
  traction_type: string;
  description: string;
  type_chip: string | null;
  tags: string | null;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  role: string;
  quote: string;
  rating: number;
  created_at?: string;
}

export interface TestimonialInput {
  customer_name: string;
  role: string;
  quote: string;
  rating: number;
}

const STATIC_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Velocity Elite Neon',
    slug: 'velocity-elite-neon',
    price: 275.00,
    original_price: null,
    category: 'men',
    image_url: '/images/collection-speedlab.jpg',
    colorway: 'ELITE PERFORMANCE / NEON',
    weight_grams: '185g',
    traction_type: 'FG',
    description: 'Engineered for explosive acceleration. The future of speed is here with our lightest, most responsive carbon-fiber chassis ever designed for the elite professional.',
    type_chip: 'ELITE',
    tags: 'CARBON SOLE,FEATHERWEIGHT'
  },
  {
    id: 2,
    name: 'Apex Predator Carbon',
    slug: 'apex-predator-carbon',
    price: 240.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product-predator.png',
    colorway: 'FIRM GROUND / VOLT SILVER',
    weight_grams: '195g',
    traction_type: 'FG',
    description: 'Our signature firm ground predator cleat, equipped with carbon fiber plates for optimal traction and stability.',
    type_chip: 'ELITE',
    tags: 'STABILITY CLAW,CARBON SOLE'
  },
  {
    id: 3,
    name: 'Midnight Stealth X',
    slug: 'midnight-stealth-x',
    price: 290.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product-stealth.png',
    colorway: 'ARTIFICIAL TURF / TRIPLE BLACK',
    weight_grams: '205g',
    traction_type: 'TF',
    description: 'An aggressive football boot design in deep jet black with electric lime detailing on the sole plate.',
    type_chip: 'LIMITED DROP',
    tags: 'GRIP-SKIN,PRO-FIT'
  },
  {
    id: 4,
    name: 'Titan SG Reinforced',
    slug: 'titan-sg-reinforced',
    price: 215.00,
    original_price: 260.00,
    category: 'men',
    image_url: '/images/product-titan.png',
    colorway: 'SOFT GROUND / SLATE NEON',
    weight_grams: '220g',
    traction_type: 'SG',
    description: 'A football boot optimized for soft ground conditions, featuring long metal studs for maximum grip.',
    type_chip: 'NEW ARRIVAL',
    tags: 'METAL STUDS,ARMOR WEAVE'
  },
  {
    id: 5,
    name: 'Ghost Pro White',
    slug: 'ghost-pro-white',
    price: 195.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product-ghost.png',
    colorway: 'FIRM GROUND / PURE WHITE',
    weight_grams: '180g',
    traction_type: 'FG',
    description: 'Professional grade football boot in a pristine white colorway with geometric carbon-fiber textures.',
    type_chip: null,
    tags: 'TRANSLUCENT UPPER,FEATHERWEIGHT'
  },
  {
    id: 6,
    name: 'Crimson Agility',
    slug: 'crimson-agility',
    price: 265.00,
    original_price: null,
    category: 'women',
    image_url: '/images/collection-womens.jpg',
    colorway: "WOMEN'S ELITE / CRIMSON",
    weight_grams: '170g',
    traction_type: 'FG',
    description: 'The Crimson Agility collection redefines the game. Engineered with women-specific bio-mechanics for lethal speed and surgical precision.',
    type_chip: 'ELITE',
    tags: 'REACT CUSHIONING,360 FIT'
  },
  {
    id: 7,
    name: 'Crimson Vapor Elite',
    slug: 'crimson-vapor-elite',
    price: 249.99,
    original_price: 299.99,
    category: 'women',
    image_url: '/images/product-crimson-vapor.png',
    colorway: 'FIRM GROUND / CRIMSON RED',
    weight_grams: '160g',
    traction_type: 'FG',
    description: "A sleek crimson red and white women's football boot with a white carbon fiber texture and lightweight fit.",
    type_chip: 'ELITE',
    tags: 'LIGHTWEIGHT,FIRM GROUND'
  },
  {
    id: 8,
    name: 'Apex Ghost Phantom',
    slug: 'apex-ghost-phantom',
    price: 274.99,
    original_price: null,
    category: 'women',
    image_url: '/images/product-ghost-phantom.png',
    colorway: 'ALL CONDITIONS / WHITE & LIME',
    weight_grams: '175g',
    traction_type: 'AG/FG',
    description: 'Dynamic side profile cleat focusing on the intricate texture of the knit upper and anatomical mapping.',
    type_chip: 'LIMITED RELEASE',
    tags: '360 FIT,ALL CONDITIONS'
  },
  {
    id: 9,
    name: 'Velocity React Pro',
    slug: 'velocity-react-pro',
    price: 219.99,
    original_price: null,
    category: 'women',
    image_url: '/images/product-velocity-react.png',
    colorway: 'ELITE / DEEP CRIMSON RED',
    weight_grams: '180g',
    traction_type: 'FG',
    description: 'A high-tech soccer boot for women featuring a deep crimson red colorway with shimmering black carbon fiber accents.',
    type_chip: 'NEW',
    tags: 'PRECISION,ELITE'
  },
  {
    id: 10,
    name: 'Merc Alpha X',
    slug: 'merc-alpha-x',
    price: 199.99,
    original_price: null,
    category: 'women',
    image_url: '/images/product-merc-alpha.png',
    colorway: 'STREET / CRIMSON & SILVER',
    weight_grams: '165g',
    traction_type: 'STREET',
    description: 'Professional cleat designed specifically for female athletes, featuring unique anatomical fit and styling.',
    type_chip: 'RESTOCKING SOON',
    tags: 'SPEED CORE,STREET'
  },
  {
    id: 11,
    name: 'Apex Gold Elite',
    slug: 'apex-gold-elite',
    price: 249.99,
    original_price: null,
    category: 'men',
    image_url: '/images/hero-gold-elite.jpg',
    colorway: 'CARBON / VOLT GOLD',
    weight_grams: '165g',
    traction_type: 'SG/FG HYBRID',
    description: 'Engineered for the decisive moment. The Apex Gold Elite features our proprietary Grip Control Pro skin and a reinforced carbon-fiber plate for maximum energy return.',
    type_chip: 'ELITE LEVEL',
    tags: 'GRIP CONTROL,CARBON CORE'
  },
  {
    id: 12,
    name: 'Core Compression Socks',
    slug: 'core-compression-socks',
    price: 24.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/kit-socks.jpg',
    colorway: 'MATTE BLACK',
    weight_grams: '45g',
    traction_type: 'ALL-WEATHER',
    description: 'High-performance compression soccer socks with arch support.',
    type_chip: null,
    tags: 'COMPRESSION,ARCH SUPPORT'
  },
  {
    id: 13,
    name: 'Pro Carbon Shields',
    slug: 'pro-carbon-shields',
    price: 65.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/kit-shields.jpg',
    colorway: 'CARBON HIVE',
    weight_grams: '75g',
    traction_type: 'IMPACT',
    description: 'Aerodynamic lightweight carbon fiber shin guards with honeycomb shock absorbing pads.',
    type_chip: null,
    tags: 'CARBON FIBER,SHIELD'
  },
  {
    id: 14,
    name: 'Apex Match Day Duffel',
    slug: 'apex-match-day-duffel',
    price: 85.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/kit-duffel.jpg',
    colorway: 'MATTE BLACK',
    weight_grams: '850g',
    traction_type: 'WATERPROOF',
    description: 'A matte black performance duffel bag with waterproof zippers and shoe ventilation.',
    type_chip: null,
    tags: 'WATERPROOF,VENTILATED'
  },
  {
    id: 15,
    name: 'Tech Dri-Fit Top',
    slug: 'tech-dri-fit-top',
    price: 45.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/kit-top.jpg',
    colorway: 'GOLD HEAT-PRESS',
    weight_grams: '120g',
    traction_type: 'BREATHABLE',
    description: 'High-quality black training jersey with gold heat-pressed logo and moisture wicking.',
    type_chip: null,
    tags: 'DRI-FIT,BREATHABLE'
  }
];

const poolConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'apex_pitch',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  connectTimeout: 5000,
};

const productsFallbackPath = path.join(process.cwd(), '.products_fallback.json');
const testimonialsFallbackPath = path.join(process.cwd(), '.testimonials_fallback.json');

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    customer_name: 'Marcus Diallo',
    role: 'Semi-pro winger',
    quote: 'The first boot that feels locked in at full sprint. Touch stayed sharp even on wet turf.',
    rating: 5,
    created_at: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 2,
    customer_name: 'Lena Park',
    role: 'Academy midfielder',
    quote: 'Lightweight without feeling fragile. The fit is narrow where I need control and flexible through the forefoot.',
    rating: 5,
    created_at: '2026-07-02T10:00:00.000Z'
  },
  {
    id: 3,
    customer_name: 'Tom Reyes',
    role: 'Sunday league captain',
    quote: 'The carbon plate has real snap. I came back for the shields and socks after one match.',
    rating: 4,
    created_at: '2026-07-03T10:00:00.000Z'
  }
];

let pool: mysql.Pool | null = null;
let isMockDb = false;

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (err) {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readFallbackProducts(): Product[] {
  return readJsonFile<Product[]>(productsFallbackPath, STATIC_PRODUCTS);
}

function writeFallbackProducts(products: Product[]) {
  writeJsonFile(productsFallbackPath, products);
}

function readFallbackTestimonials(): Testimonial[] {
  return readJsonFile<Testimonial[]>(testimonialsFallbackPath, STATIC_TESTIMONIALS);
}

function writeFallbackTestimonials(testimonials: Testimonial[]) {
  writeJsonFile(testimonialsFallbackPath, testimonials);
}

function nextLocalId(items: Array<{ id: number }>) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function getPool() {
  if (isMockDb) return null;
  if (!pool) {
    try {
      pool = mysql.createPool(poolConfig);
    } catch (e) {
      console.warn('Could not create MySQL connection pool. Falling back to local static JSON data.');
      isMockDb = true;
    }
  }
  return pool;
}

export async function checkConnection(): Promise<{ connected: boolean; message: string }> {
  const p = getPool();
  if (!p) {
    return { connected: false, message: 'Local Mock Database Fallback (No Connection Pool)' };
  }
  try {
    const conn = await p.getConnection();
    conn.release();
    return { connected: true, message: `Connected to MySQL: ${poolConfig.database}@${poolConfig.host}` };
  } catch (e: any) {
    console.warn(`MySQL connection error: ${e.message}. Using Local Mock Database fallback.`);
    isMockDb = true;
    return { connected: false, message: `Disconnected: ${e.message} (Using local mock data)` };
  }
}

export async function rawQuery<T>(sql: string, params?: any[]): Promise<T> {
  const { connected } = await checkConnection();
  if (!connected || isMockDb) {
    throw new Error('MySQL disconnected, using local fallback handler');
  }
  const [rows] = await pool!.execute(sql, params);
  return rows as T;
}

// Interface for fetching products
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    
    let sql = 'SELECT * FROM products';
    const params: any[] = [];
    if (category) {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    return await rawQuery<Product[]>(sql, params);
  } catch (e) {
    // Local static fallback
    const fallbackProducts = readFallbackProducts();
    if (category) {
      return fallbackProducts.filter(p => p.category === category);
    }
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE slug = ?', [slug]);
    return rows.length > 0 ? rows[0] : null;
  } catch (e) {
    return readFallbackProducts().find(p => p.slug === slug) || null;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (e) {
    return readFallbackProducts().find(p => p.id === id) || null;
  }
}

export async function createProduct(product: ProductInput): Promise<Product> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<mysql.ResultSetHeader>(
      `INSERT INTO products
       (name, slug, price, original_price, category, image_url, colorway, weight_grams, traction_type, description, type_chip, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.slug,
        product.price,
        product.original_price,
        product.category,
        product.image_url,
        product.colorway,
        product.weight_grams,
        product.traction_type,
        product.description,
        product.type_chip,
        product.tags
      ]
    );

    return { id: result.insertId, ...product };
  } catch (e) {
    const products = readFallbackProducts();
    if (products.some((item) => item.slug === product.slug)) {
      throw new Error('A product with this slug already exists.');
    }

    const createdProduct = { id: nextLocalId(products), ...product };
    writeFallbackProducts([...products, createdProduct]);
    return createdProduct;
  }
}

export async function updateProduct(id: number, product: ProductInput): Promise<Product> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<mysql.ResultSetHeader>(
      `UPDATE products
       SET name = ?, slug = ?, price = ?, original_price = ?, category = ?, image_url = ?, colorway = ?,
           weight_grams = ?, traction_type = ?, description = ?, type_chip = ?, tags = ?
       WHERE id = ?`,
      [
        product.name,
        product.slug,
        product.price,
        product.original_price,
        product.category,
        product.image_url,
        product.colorway,
        product.weight_grams,
        product.traction_type,
        product.description,
        product.type_chip,
        product.tags,
        id
      ]
    );

    return { id, ...product };
  } catch (e) {
    const products = readFallbackProducts();
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found.');
    }
    if (products.some((item) => item.id !== id && item.slug === product.slug)) {
      throw new Error('A product with this slug already exists.');
    }

    const updatedProduct = { id, ...product };
    const nextProducts = [...products];
    nextProducts[productIndex] = updatedProduct;
    writeFallbackProducts(nextProducts);
    return updatedProduct;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<Testimonial[]>(
      'SELECT * FROM testimonials ORDER BY created_at DESC, id DESC'
    );
  } catch (e) {
    return readFallbackTestimonials().sort((a, b) => b.id - a.id);
  }
}

export async function createTestimonial(testimonial: TestimonialInput): Promise<Testimonial> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<mysql.ResultSetHeader>(
      `INSERT INTO testimonials (customer_name, role, quote, rating)
       VALUES (?, ?, ?, ?)`,
      [
        testimonial.customer_name,
        testimonial.role,
        testimonial.quote,
        testimonial.rating
      ]
    );

    return {
      id: result.insertId,
      ...testimonial,
      created_at: new Date().toISOString()
    };
  } catch (e) {
    const testimonials = readFallbackTestimonials();
    const createdTestimonial = {
      id: nextLocalId(testimonials),
      ...testimonial,
      created_at: new Date().toISOString()
    };
    writeFallbackTestimonials([...testimonials, createdTestimonial]);
    return createdTestimonial;
  }
}

// Create Order logic
export async function createOrder(
  order: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    zip_code: string;
    payment_method: string;
    card_number?: string;
    subtotal: number;
    tax: number;
    total: number;
  },
  items: Array<{ product_id: number; size: string; qty: number; price: number }>
): Promise<number> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const p = getPool();
    if (!p) throw new Error('No pool available');

    // Run order insert in transaction
    const conn = await p.getConnection();
    try {
      await conn.beginTransaction();

      const [res] = await conn.execute(
        `INSERT INTO orders (first_name, last_name, address, city, zip_code, payment_method, card_number, subtotal, tax, total) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.first_name,
          order.last_name,
          order.address,
          order.city,
          order.zip_code,
          order.payment_method,
          order.card_number || null,
          order.subtotal,
          order.tax,
          order.total
        ]
      );

      const orderId = (res as any).insertId;

      for (const item of items) {
        await conn.execute(
          `INSERT INTO order_items (order_id, product_id, size, qty, price) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.size, item.qty, item.price]
        );
      }

      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (e) {
    // Write orders to a local fallback file
    const fallbackPath = path.join(process.cwd(), '.orders_fallback.json');
    let ordersList: any[] = [];
    if (fs.existsSync(fallbackPath)) {
      try {
        ordersList = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      } catch (err) {
        ordersList = [];
      }
    }
    
    const mockOrderId = Math.floor(Math.random() * 90000) + 10000;
    const fallbackOrder = {
      id: mockOrderId,
      ...order,
      items,
      created_at: new Date().toISOString()
    };
    
    ordersList.push(fallbackOrder);
    fs.writeFileSync(fallbackPath, JSON.stringify(ordersList, null, 2), 'utf8');
    
    console.log(`MySQL Disconnected. Order logged locally to: ${fallbackPath}`);
    return mockOrderId;
  }
}
