import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load static products for local fallback
export interface ProductImage {
  id?: number;
  product_id?: number;
  image_url: string;
  is_main: boolean;
}

export interface ProductVideo {
  id?: number;
  product_id?: number;
  title: string;
  video_url: string;
}

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
  images?: ProductImage[];
  faqs?: string | null;
  videos?: ProductVideo[];
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
  images?: ProductImage[];
  faqs?: string | null;
  videos?: ProductVideo[];
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

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

export interface MembershipApplication {
  id: number;
  name: string;
  email: string;
  size: string;
  position: string;
  member_id: string;
  created_at?: string;
}

export interface MembershipApplicationInput {
  name: string;
  email: string;
  size: string;
  position: string;
  member_id: string;
}

export interface PromoCode {
  id: number;
  code: string;
  type: 'percent' | 'fixed' | 'free_item';
  value: number;
  min_spend: number;
  applies_to: 'all' | 'specific';
  product_ids: string | null;
  created_at?: string;
}

export interface PromoCodeInput {
  code: string;
  type: 'percent' | 'fixed' | 'free_item';
  value: number;
  min_spend: number;
  applies_to: 'all' | 'specific';
  product_ids: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  provider: string;
  email_verified: boolean;
  created_at?: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  password_hash?: string | null;
  google_id?: string | null;
  provider: 'email' | 'google';
  email_verified: boolean;
}

export interface CustomerOrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  product_image_url: string;
  size: string;
  qty: number;
  price: number;
}

export interface CustomerOrder {
  id: number;
  customer_id?: number | null;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  zip_code: string;
  payment_method: string;
  subtotal: number;
  tax: number;
  total: number;
  coupon_code?: string | null;
  discount?: number | null;
  delivery_proof?: string | null;
  status: string;
  created_at: string;
  items: CustomerOrderItem[];
}

export interface AdminOrder extends CustomerOrder {
  customer_name: string | null;
  customer_email: string | null;
}

interface EmailVerificationToken {
  customer_id: number;
  token: string;
  expires_at: string;
}

interface FallbackOrder {
  id: number;
  customer_id?: number | null;
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
  coupon_code?: string | null;
  discount?: number | null;
  delivery_proof?: string | null;
  status?: string;
  items: Array<{ product_id: number; size: string; qty: number; price: number }>;
  created_at: string;
}

const STATIC_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Nike Air Zoom Mercurial Vapor 15 Elite FG',
    slug: 'nike-air-zoom-mercurial-vapor-15-elite-fg',
    price: 1149.00,
    original_price: 1249.00,
    category: 'men',
    image_url: '/images/product/vapor.png',
    colorway: 'BRIGHT CRIMSON / VOLT METALLIC',
    weight_grams: '185g',
    traction_type: 'FG',
    description: 'Engineered with a football-specific 3/4 Zoom Air unit under the sole plate, providing explosive propulsion and snappy feedback.',
    type_chip: 'ELITE SPEED',
    tags: 'ZOOM AIR,VAPORPOSITE',
    images: [
      { image_url: '/images/product/vapor.png', is_main: true },
      { image_url: '/images/product/vapor-sole.png', is_main: false },
      { image_url: '/images/product/vapor-heel.png', is_main: false }
    ]
  },
  {
    id: 2,
    name: 'Adidas Predator Elite Fold-Over Tongue FG',
    slug: 'adidas-predator-elite-fold-over-tongue-fg',
    price: 1299.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product/predator-elite.png',
    colorway: 'CORE BLACK / SOLAR RED',
    weight_grams: '210g',
    traction_type: 'FG',
    description: 'Featuring the return of the iconic fold-over tongue and Strikeskin grip fins for lethal control and execution in key striking zones.',
    type_chip: 'LETHAL TOUCH',
    tags: 'STRIKESKIN,LEGEND TONGUE'
  },
  {
    id: 3,
    name: 'Puma Future Ultimate FG/AG',
    slug: 'puma-future-ultimate-fg-ag',
    price: 999.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product/future.png',
    colorway: 'BLUE GLIMMER / WHITE',
    weight_grams: '190g',
    traction_type: 'FG/AG',
    description: 'Designed with FUZIONFIT360 dual mesh upper and PWRTAPE reinforcement for adaptive support and lock-down agility.',
    type_chip: 'AGILITY CORE',
    tags: 'FUZIONFIT,PWRTAPE'
  },
  {
    id: 4,
    name: 'Nike Phantom GX II Elite FG',
    slug: 'nike-phantom-gx-ii-elite-fg',
    price: 1099.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product/ghost.png',
    colorway: 'VOLT / WOLF GREY',
    weight_grams: '195g',
    traction_type: 'FG',
    description: 'Equipped with revolutionary Gripknit touch skins and the Cyclone 360 traction plate for surgical precision and pivot agility.',
    type_chip: 'CONTROL PRO',
    tags: 'GRIPKNIT,CYCLONE 360'
  },
  {
    id: 5,
    name: 'Mizuno Morelia Neo IV Beta Japan FG',
    slug: 'mizuno-morelia-neo-iv-beta-japan-fg',
    price: 1399.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product/mizuno.png',
    colorway: 'PURA WHITE / GOLD',
    weight_grams: '175g',
    traction_type: 'FG',
    description: 'Handcrafted in Japan with premium K-Leather for a barefoot feel and ultimate structural precision. The pinnacle of craftsmanship.',
    type_chip: 'HANDCRAFTED',
    tags: 'K-LEATHER,MADE IN JAPAN'
  },
  {
    id: 6,
    name: 'Nike Zoom Mercurial Superfly 9 Academy TF',
    slug: 'nike-zoom-mercurial-superfly-9-academy-tf',
    price: 379.00,
    original_price: null,
    category: 'men',
    image_url: '/images/product/stealth.png',
    colorway: 'METALLIC COPPER',
    weight_grams: '220g',
    traction_type: 'TF',
    description: 'Artificial turf soccer shoe featuring a low-profile rubber outsole, sock-like collar lock-down, and a springy Zoom Air heel unit.',
    type_chip: 'BEST SELLER',
    tags: 'ZOOM AIR,TURF TRACK'
  },
  {
    id: 7,
    name: 'Nike Women\'s Phantom Luna II Elite FG',
    slug: 'nike-womens-phantom-luna-ii-elite-fg',
    price: 1149.00,
    original_price: null,
    category: 'women',
    image_url: '/images/product/crimson-vapor.png',
    colorway: 'SUNSET CRIMSON / VOLT',
    weight_grams: '180g',
    traction_type: 'FG',
    description: 'Specifically engineered for female athletes, featuring the Cyclone 360 stud layout for rotational traction and high-cuff lock-down collar.',
    type_chip: 'ELITE AGILITY',
    tags: 'CYCLONE 360,FIT-GRID'
  },
  {
    id: 8,
    name: 'Puma Women\'s Ultra Ultimate FG/AG',
    slug: 'puma-womens-ultra-ultimate-fg-ag',
    price: 999.00,
    original_price: null,
    category: 'women',
    image_url: '/images/product/ghost-phantom.png',
    colorway: 'FIERY CORAL / GOLD',
    weight_grams: '155g',
    traction_type: 'FG/AG',
    description: 'Featherweight speed cleat with ULTRAWEAVE upper material and speedplate sole for blistering pace and rapid transitions.',
    type_chip: 'LIGHTEST YET',
    tags: 'ULTRAWEAVE,SPEEDPLATE'
  },
  {
    id: 9,
    name: 'Adidas Women\'s Copa Pure 2.1 FG',
    slug: 'adidas-womens-copa-pure-21-fg',
    price: 899.00,
    original_price: null,
    category: 'women',
    image_url: '/images/product/velocity-react.png',
    colorway: 'PURA WHITE / SILENT BLUE',
    weight_grams: '195g',
    traction_type: 'FG',
    description: 'Ultra-comfortable leather boot featuring a Fusionskin leather forefoot for pillow-soft touch and stable heel counter fit.',
    type_chip: 'PURE TOUCH',
    tags: 'FUSIONSKIN,COPA LAST'
  },
  {
    id: 10,
    name: 'Nike Women\'s Tiempo Legend 10 Elite FG',
    slug: 'nike-womens-tiempo-legend-10-elite-fg',
    price: 1049.00,
    original_price: null,
    category: 'women',
    image_url: '/images/product/merc-alpha.png',
    colorway: 'MATTE PLATINUM / PINK',
    weight_grams: '185g',
    traction_type: 'FG',
    description: 'Engineered with FlyTouch Plus leather alternative for superior touch control without water absorption. A masterclass in comfort.',
    type_chip: 'LEGEND FIT',
    tags: 'FLYTOUCH PLUS,MICRO-DOTS'
  },
  {
    id: 11,
    name: 'Puma Future Match Women\'s Turf',
    slug: 'puma-future-match-womens-turf',
    price: 399.00,
    original_price: null,
    category: 'women',
    image_url: '/images/product/crimson-vapor.png',
    colorway: 'CRIMSON / ELECTRIC LIME',
    weight_grams: '210g',
    traction_type: 'TF',
    description: 'Turf execution of the Future franchise, carrying an adaptable mid-cut collar and multi-studded rubber outsole for high grip.',
    type_chip: 'RESTOCKED',
    tags: 'TURF STUD,FUZIONFIT'
  },
  {
    id: 12,
    name: 'Nike Strike Luminous Ball Size 5',
    slug: 'nike-strike-luminous-ball-size-5',
    price: 129.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/product/hero-gold-elite.jpg',
    colorway: 'VOLT / REFLECTIVE GREY',
    weight_grams: '420g',
    traction_type: 'ALL-WEATHER',
    description: 'Engineered with Aerowsculpt textured grooves for stable flight and high-contrast visuals to track easily in bad light.',
    type_chip: 'TRAINING',
    tags: 'AEROWSCULPT,SIZE 5'
  },
  {
    id: 13,
    name: 'Adidas Creator Compression Shin Guards',
    slug: 'adidas-creator-compression-shin-guards',
    price: 179.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/product/kit-shields.jpg',
    colorway: 'CARBON BLACK',
    weight_grams: '65g',
    traction_type: 'IMPACT COMPRESSION',
    description: 'Equipped with carbon-infused hard shields and premium compression sleeve pockets for secure slippage prevention.',
    type_chip: 'PROTECTION',
    tags: 'HARD SHIELD,SLEEVE POCKET'
  },
  {
    id: 14,
    name: 'Grip Sox Pro Tech Grip Socks',
    slug: 'grip-sox-pro-tech-grip-socks',
    price: 69.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/product/kit-socks.jpg',
    colorway: 'TRIPLE BLACK',
    weight_grams: '50g',
    traction_type: 'IN-BOOT GRIP',
    description: 'Premium soccer grip socks featuring silicone pads on both interior and exterior surfaces to eliminate in-boot foot slippage.',
    type_chip: 'PERFORMANCE ESSENTIAL',
    tags: 'ANTI-SLIP,SILICONE GRIP'
  },
  {
    id: 15,
    name: 'Nike Academy Team Duffel Bag Medium',
    slug: 'nike-academy-team-duffel-bag-medium',
    price: 189.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/product/kit-duffel.jpg',
    colorway: 'MATTE BLACK',
    weight_grams: '650g',
    traction_type: 'WATERPROOF BASE',
    description: 'Heavy-duty polyester duffel featuring dedicated wet/dry storage compartments, waterproof bottom panel, and ventilated boot pockets.',
    type_chip: 'GEAR BAG',
    tags: 'WET-DRY SEPARATION,BOOT POCKET'
  },
  {
    id: 16,
    name: 'Under Armour HeatGear Compression Top',
    slug: 'under-armour-heatgear-compression-top',
    price: 139.00,
    original_price: null,
    category: 'kit',
    image_url: '/images/product/kit-top.jpg',
    colorway: 'CHARCOAL BLACK / GOLD',
    weight_grams: '110g',
    traction_type: 'COMPRESSION',
    description: 'Ultra-tight second-skin compression top with moisture-wicking technology and mesh underarm panels for cooling comfort.',
    type_chip: 'BASE LAYER',
    tags: 'HEATGEAR,MOISTURE-WICKING'
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
const settingsFallbackPath = path.join(process.cwd(), '.settings_fallback.json');
const messagesFallbackPath = path.join(process.cwd(), '.messages_fallback.json');
const categoriesFallbackPath = path.join(process.cwd(), '.categories_fallback.json');
const membershipsFallbackPath = path.join(process.cwd(), '.memberships_fallback.json');
const customersFallbackPath = path.join(process.cwd(), '.customers_fallback.json');
const emailVerificationFallbackPath = path.join(process.cwd(), '.email_verifications_fallback.json');
const ordersFallbackPath = path.join(process.cwd(), '.orders_fallback.json');
const promocodesFallbackPath = path.join(process.cwd(), '.promocodes_fallback.json');
const SHOP_HERO_PRODUCT_ID_KEY = 'shop_hero_product_id';

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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
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

function readFallbackSettings(): Record<string, string> {
  return readJsonFile<Record<string, string>>(settingsFallbackPath, {
    [SHOP_HERO_PRODUCT_ID_KEY]: '1'
  });
}

function writeFallbackSettings(settings: Record<string, string>) {
  writeJsonFile(settingsFallbackPath, settings);
}

function readFallbackMessages(): ContactMessage[] {
  return readJsonFile<ContactMessage[]>(messagesFallbackPath, []);
}

function writeFallbackMessages(messages: ContactMessage[]) {
  writeJsonFile(messagesFallbackPath, messages);
}

const STATIC_CATEGORIES: Category[] = [
  { id: 1, name: 'Men', slug: 'men' },
  { id: 2, name: 'Women', slug: 'women' },
  { id: 3, name: 'Kit', slug: 'kit' }
];

function readFallbackCategories(): Category[] {
  return readJsonFile<Category[]>(categoriesFallbackPath, STATIC_CATEGORIES);
}

function writeFallbackCategories(categories: Category[]) {
  writeJsonFile(categoriesFallbackPath, categories);
}

const STATIC_MEMBERSHIPS: MembershipApplication[] = [
  { id: 1, name: 'Marcus Alisson', email: 'marcus@pitch.com', size: '10.5', position: 'Midfielder', member_id: 'APX-9821', created_at: '2026-07-01T10:00:00.000Z' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@apex.com', size: '8.5', position: 'Forward', member_id: 'APX-4102', created_at: '2026-07-02T10:00:00.000Z' },
  { id: 3, name: 'Kenji Sato', email: 'sato@football.jp', size: '9.5', position: 'Defender', member_id: 'APX-1289', created_at: '2026-07-03T10:00:00.000Z' }
];

function readFallbackMemberships(): MembershipApplication[] {
  return readJsonFile<MembershipApplication[]>(membershipsFallbackPath, STATIC_MEMBERSHIPS);
}

function writeFallbackMemberships(memberships: MembershipApplication[]) {
  writeJsonFile(membershipsFallbackPath, memberships);
}

function readFallbackCustomers(): Customer[] {
  return readJsonFile<Customer[]>(customersFallbackPath, []);
}

function writeFallbackCustomers(customers: Customer[]) {
  writeJsonFile(customersFallbackPath, customers);
}

function readFallbackEmailVerifications(): EmailVerificationToken[] {
  return readJsonFile<EmailVerificationToken[]>(emailVerificationFallbackPath, []);
}

function writeFallbackEmailVerifications(tokens: EmailVerificationToken[]) {
  writeJsonFile(emailVerificationFallbackPath, tokens);
}

function readFallbackOrders(): FallbackOrder[] {
  return readJsonFile<FallbackOrder[]>(ordersFallbackPath, []);
}

function writeFallbackOrders(orders: FallbackOrder[]) {
  writeJsonFile(ordersFallbackPath, orders);
}

const STATIC_PROMO_CODES: PromoCode[] = [
  { id: 1, code: 'APEX20', type: 'percent', value: 20.00, min_spend: 0.00, applies_to: 'all', product_ids: null, created_at: '2026-07-01T10:00:00.000Z' },
  { id: 2, code: 'RM50OVER300', type: 'fixed', value: 50.00, min_spend: 300.00, applies_to: 'all', product_ids: null, created_at: '2026-07-02T10:00:00.000Z' },
  { id: 3, code: 'FREEBALL', type: 'free_item', value: 0.00, min_spend: 500.00, applies_to: 'all', product_ids: '12', created_at: '2026-07-03T10:00:00.000Z' }
];

function readFallbackPromoCodes(): PromoCode[] {
  return readJsonFile<PromoCode[]>(promocodesFallbackPath, STATIC_PROMO_CODES);
}

function writeFallbackPromoCodes(promos: PromoCode[]) {
  writeJsonFile(promocodesFallbackPath, promos);
}

function nextLocalId(items: Array<{ id: number }>) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function getPool() {
  if (isMockDb) return null;
  if (!pool) {
    try {
      pool = mysql.createPool(poolConfig);
    } catch {
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
  } catch (e: unknown) {
    const message = getErrorMessage(e);
    console.warn(`MySQL connection error: ${message}. Using Local Mock Database fallback.`);
    isMockDb = true;
    return { connected: false, message: `Disconnected: ${message} (Using local mock data)` };
  }
}

type QueryParam = string | number | boolean | null;

export async function rawQuery<T>(sql: string, params?: QueryParam[]): Promise<T> {
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
    const params: QueryParam[] = [];
    if (category) {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    return await rawQuery<Product[]>(sql, params);
  } catch {
    // Local static fallback
    const fallbackProducts = readFallbackProducts();
    if (category) {
      return fallbackProducts.filter(p => p.category === category);
    }
    return fallbackProducts;
  }
}

async function ensureSettingsTable() {
  await rawQuery(
    `CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

export async function getShopHeroProductId(): Promise<number | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    await ensureSettingsTable();

    const rows = await rawQuery<Array<{ setting_value: string }>>(
      'SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1',
      [SHOP_HERO_PRODUCT_ID_KEY]
    );
    const productId = Number(rows[0]?.setting_value);
    return Number.isInteger(productId) && productId > 0 ? productId : null;
  } catch {
    const productId = Number(readFallbackSettings()[SHOP_HERO_PRODUCT_ID_KEY]);
    return Number.isInteger(productId) && productId > 0 ? productId : 1;
  }
}

export async function setShopHeroProductId(productId: number): Promise<number> {
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('Product not found.');
  }

  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureSettingsTable();

    await rawQuery(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [SHOP_HERO_PRODUCT_ID_KEY, String(productId)]
    );
  } catch {
    writeFallbackSettings({
      ...readFallbackSettings(),
      [SHOP_HERO_PRODUCT_ID_KEY]: String(productId)
    });
  }

  return productId;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE slug = ?', [slug]);
    if (rows.length > 0) {
      const product = rows[0];
      const [images, videos] = await Promise.all([
        rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [product.id]),
        rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [product.id])
      ]);
      product.images = images;
      product.videos = videos;
      return product;
    }
    return null;
  } catch {
    const product = readFallbackProducts().find(p => p.slug === slug) || null;
    if (product) {
      if (!product.images) {
        product.images = [{ image_url: product.image_url, is_main: true }];
      }
      if (!product.videos) {
        product.videos = [];
      }
    }
    return product;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length > 0) {
      const product = rows[0];
      const [images, videos] = await Promise.all([
        rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [product.id]),
        rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [product.id])
      ]);
      product.images = images;
      product.videos = videos;
      return product;
    }
    return null;
  } catch {
    const product = readFallbackProducts().find(p => p.id === id) || null;
    if (product) {
      if (!product.images) {
        product.images = [{ image_url: product.image_url, is_main: true }];
      }
      if (!product.videos) {
        product.videos = [];
      }
    }
    return product;
  }
}

export async function createProduct(product: ProductInput): Promise<Product> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    // Determine the main image
    let mainImageUrl = product.image_url;
    if (product.images && product.images.length > 0) {
      const mainImg = product.images.find(img => img.is_main) || product.images[0];
      mainImageUrl = mainImg.image_url;
    }

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO products
       (name, slug, price, original_price, category, image_url, colorway, weight_grams, traction_type, description, type_chip, tags, faqs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.slug,
        product.price,
        product.original_price,
        product.category,
        mainImageUrl,
        product.colorway,
        product.weight_grams,
        product.traction_type,
        product.description,
        product.type_chip,
        product.tags,
        product.faqs || null
      ]
    );

    const newProductId = result.insertId;

    // Save product images
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await rawQuery(
          'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
          [newProductId, img.image_url, img.is_main]
        );
      }
    } else {
      await rawQuery(
        'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, TRUE)',
        [newProductId, mainImageUrl]
      );
    }

    // Save product videos
    if (product.videos && product.videos.length > 0) {
      for (const vid of product.videos) {
        await rawQuery(
          'INSERT INTO product_videos (product_id, title, video_url) VALUES (?, ?, ?)',
          [newProductId, vid.title, vid.video_url]
        );
      }
    }

    const createdProduct = { ...product, id: newProductId, image_url: mainImageUrl };
    const [images, videos] = await Promise.all([
      rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [newProductId]),
      rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [newProductId])
    ]);
    createdProduct.images = images;
    createdProduct.videos = videos;
    return createdProduct;
  } catch {
    const products = readFallbackProducts();
    if (products.some((item) => item.slug === product.slug)) {
      throw new Error('A product with this slug already exists.');
    }

    let mainImageUrl = product.image_url;
    let imagesList = product.images || [];
    if (imagesList.length > 0) {
      const mainImg = imagesList.find(img => img.is_main) || imagesList[0];
      mainImageUrl = mainImg.image_url;
    } else {
      imagesList = [{ image_url: mainImageUrl, is_main: true }];
    }

    const createdProduct = { 
      id: nextLocalId(products), 
      ...product, 
      image_url: mainImageUrl,
      images: imagesList,
      videos: product.videos || []
    };
    writeFallbackProducts([...products, createdProduct]);
    return createdProduct;
  }
}

export async function updateProduct(id: number, product: ProductInput): Promise<Product> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    // Determine the main image
    let mainImageUrl = product.image_url;
    if (product.images && product.images.length > 0) {
      const mainImg = product.images.find(img => img.is_main) || product.images[0];
      mainImageUrl = mainImg.image_url;
    }

    await rawQuery<ResultSetHeader>(
      `UPDATE products
       SET name = ?, slug = ?, price = ?, original_price = ?, category = ?, image_url = ?, colorway = ?,
           weight_grams = ?, traction_type = ?, description = ?, type_chip = ?, tags = ?, faqs = ?
       WHERE id = ?`,
      [
        product.name,
        product.slug,
        product.price,
        product.original_price,
        product.category,
        mainImageUrl,
        product.colorway,
        product.weight_grams,
        product.traction_type,
        product.description,
        product.type_chip,
        product.tags,
        product.faqs || null,
        id
      ]
    );

    // Update product images
    await rawQuery('DELETE FROM product_images WHERE product_id = ?', [id]);
    
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await rawQuery(
          'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
          [id, img.image_url, img.is_main]
        );
      }
    } else {
      await rawQuery(
        'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, TRUE)',
        [id, mainImageUrl]
      );
    }

    // Update product videos
    await rawQuery('DELETE FROM product_videos WHERE product_id = ?', [id]);
    if (product.videos && product.videos.length > 0) {
      for (const vid of product.videos) {
        await rawQuery(
          'INSERT INTO product_videos (product_id, title, video_url) VALUES (?, ?, ?)',
          [id, vid.title, vid.video_url]
        );
      }
    }

    const updatedProduct = { ...product, id, image_url: mainImageUrl };
    const [images, videos] = await Promise.all([
      rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [id]),
      rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [id])
    ]);
    updatedProduct.images = images;
    updatedProduct.videos = videos;
    return updatedProduct;
  } catch {
    const products = readFallbackProducts();
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found.');
    }
    if (products.some((item) => item.id !== id && item.slug === product.slug)) {
      throw new Error('A product with this slug already exists.');
    }

    let mainImageUrl = product.image_url;
    let imagesList = product.images || [];
    if (imagesList.length > 0) {
      const mainImg = imagesList.find(img => img.is_main) || imagesList[0];
      mainImageUrl = mainImg.image_url;
    } else {
      imagesList = [{ image_url: mainImageUrl, is_main: true }];
    }

    const updatedProduct = { 
      id, 
      ...product, 
      image_url: mainImageUrl,
      images: imagesList,
      videos: product.videos || []
    };
    const nextProducts = [...products];
    nextProducts[productIndex] = updatedProduct;
    writeFallbackProducts(nextProducts);
    return updatedProduct;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery('DELETE FROM products WHERE id = ?', [id]);
  } catch {
    const products = readFallbackProducts();
    const nextProducts = products.filter(p => p.id !== id);
    writeFallbackProducts(nextProducts);
  }
}

// ==================== Customers ====================

async function ensureCustomerTables() {
  await rawQuery(
    `CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NULL,
      google_id VARCHAR(255) NULL UNIQUE,
      provider VARCHAR(50) NOT NULL,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  await rawQuery(
    `CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

export async function findCustomerById(id: number): Promise<Customer | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  } catch {
    return readFallbackCustomers().find((customer) => customer.id === id) || null;
  }
}

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE email = ? LIMIT 1', [normalizedEmail]);
    return rows[0] || null;
  } catch {
    return readFallbackCustomers().find((customer) => customer.email.toLowerCase() === normalizedEmail) || null;
  }
}

export async function findCustomerByGoogleId(googleId: string): Promise<Customer | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE google_id = ? LIMIT 1', [googleId]);
    return rows[0] || null;
  } catch {
    return readFallbackCustomers().find((customer) => customer.google_id === googleId) || null;
  }
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const normalizedEmail = input.email.trim().toLowerCase();
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO customers (name, email, password_hash, google_id, provider, email_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.name,
        normalizedEmail,
        input.password_hash || null,
        input.google_id || null,
        input.provider,
        input.email_verified
      ]
    );

    return {
      id: result.insertId,
      name: input.name,
      email: normalizedEmail,
      password_hash: input.password_hash || null,
      google_id: input.google_id || null,
      provider: input.provider,
      email_verified: input.email_verified,
      created_at: new Date().toISOString()
    };
  } catch {
    const customers = readFallbackCustomers();
    if (customers.some((customer) => customer.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account already exists for this email.');
    }
    const customer: Customer = {
      id: nextLocalId(customers),
      name: input.name,
      email: normalizedEmail,
      password_hash: input.password_hash || null,
      google_id: input.google_id || null,
      provider: input.provider,
      email_verified: input.email_verified,
      created_at: new Date().toISOString()
    };
    writeFallbackCustomers([...customers, customer]);
    return customer;
  }
}

export async function createEmailVerificationToken(customerId: number, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    await rawQuery('DELETE FROM email_verification_tokens WHERE customer_id = ?', [customerId]);
    await rawQuery(
      'INSERT INTO email_verification_tokens (customer_id, token, expires_at) VALUES (?, ?, ?)',
      [customerId, token, expiresAt.slice(0, 19).replace('T', ' ')]
    );
  } catch {
    const tokens = readFallbackEmailVerifications()
      .filter((item) => item.customer_id !== customerId && item.token !== token);
    writeFallbackEmailVerifications([...tokens, { customer_id: customerId, token, expires_at: expiresAt }]);
  }
}

export async function verifyCustomerByToken(token: string): Promise<Customer | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    const rows = await rawQuery<Array<{ customer_id: number; expires_at: string }>>(
      'SELECT customer_id, expires_at FROM email_verification_tokens WHERE token = ? LIMIT 1',
      [token]
    );
    const match = rows[0];
    if (!match || new Date(match.expires_at).getTime() < Date.now()) return null;

    await verifyCustomerEmail(match.customer_id);
    await rawQuery('DELETE FROM email_verification_tokens WHERE token = ?', [token]);
    return findCustomerById(match.customer_id);
  } catch {
    const tokens = readFallbackEmailVerifications();
    const match = tokens.find((item) => item.token === token);
    if (!match || new Date(match.expires_at).getTime() < Date.now()) return null;

    await verifyCustomerEmail(match.customer_id);
    writeFallbackEmailVerifications(tokens.filter((item) => item.token !== token));
    return findCustomerById(match.customer_id);
  }
}

export async function verifyCustomerEmail(customerId: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();

    await rawQuery('UPDATE customers SET email_verified = TRUE WHERE id = ?', [customerId]);
  } catch {
    const customers = readFallbackCustomers();
    const index = customers.findIndex((customer) => customer.id === customerId);
    if (index !== -1) {
      customers[index] = { ...customers[index], email_verified: true };
      writeFallbackCustomers(customers);
    }
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<Testimonial[]>(
      'SELECT * FROM testimonials ORDER BY created_at DESC, id DESC'
    );
  } catch {
    return readFallbackTestimonials().sort((a, b) => b.id - a.id);
  }
}

export async function createTestimonial(testimonial: TestimonialInput): Promise<Testimonial> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<ResultSetHeader>(
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
  } catch {
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

export async function getTestimonialById(id: number): Promise<Testimonial | null> {
  try {
    if (isMockDb) throw new Error('Local fallback triggered');
    const rows = await rawQuery<Testimonial[]>('SELECT * FROM testimonials WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return readFallbackTestimonials().find(t => t.id === id) || null;
  }
}

export async function updateTestimonial(id: number, testimonial: TestimonialInput): Promise<Testimonial> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      `UPDATE testimonials
       SET customer_name = ?, role = ?, quote = ?, rating = ?
       WHERE id = ?`,
      [
        testimonial.customer_name,
        testimonial.role,
        testimonial.quote,
        testimonial.rating,
        id
      ]
    );

    return { id, ...testimonial };
  } catch {
    const testimonials = readFallbackTestimonials();
    const testimonialIndex = testimonials.findIndex((t) => t.id === id);
    if (testimonialIndex === -1) {
      throw new Error('Testimonial not found.');
    }

    const updatedTestimonial = { id, ...testimonial };
    const nextTestimonials = [...testimonials];
    nextTestimonials[testimonialIndex] = updatedTestimonial;
    writeFallbackTestimonials(nextTestimonials);
    return updatedTestimonial;
  }
}

export async function deleteTestimonial(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery('DELETE FROM testimonials WHERE id = ?', [id]);
  } catch {
    const testimonials = readFallbackTestimonials();
    const nextTestimonials = testimonials.filter(t => t.id !== id);
    writeFallbackTestimonials(nextTestimonials);
  }
}

async function ensureOrderCustomerColumn() {
  try {
    await rawQuery('ALTER TABLE orders ADD COLUMN customer_id INT NULL AFTER id');
  } catch {
    // Column may already exist or the local fallback may be active.
  }

  try {
    await rawQuery(
      'ALTER TABLE orders ADD CONSTRAINT fk_orders_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL'
    );
  } catch {
    // Constraint may already exist.
  }

  // Setup discount and delivery proof columns
  await ensureOrderDiscountAndProofColumns();
}

async function ensureOrderDiscountAndProofColumns() {
  try {
    await rawQuery('ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(100) NULL AFTER total');
  } catch {}
  try {
    await rawQuery('ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER coupon_code');
  } catch {}
  try {
    await rawQuery('ALTER TABLE orders ADD COLUMN delivery_proof VARCHAR(255) NULL AFTER status');
  } catch {}
}

// Create Order logic
export async function createOrder(
  order: {
    customer_id?: number | null;
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
    coupon_code?: string | null;
    discount?: number | null;
  },
  items: Array<{ product_id: number; size: string; qty: number; price: number }>
): Promise<number> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const p = getPool();
    if (!p) throw new Error('No pool available');
    await ensureCustomerTables();
    await ensureOrderCustomerColumn();

    // Run order insert in transaction
    const conn = await p.getConnection();
    try {
      await conn.beginTransaction();

      const [res] = await conn.execute(
        `INSERT INTO orders (customer_id, first_name, last_name, address, city, zip_code, payment_method, card_number, subtotal, tax, total, coupon_code, discount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.customer_id || null,
          order.first_name,
          order.last_name,
          order.address,
          order.city,
          order.zip_code,
          order.payment_method,
          order.card_number || null,
          order.subtotal,
          order.tax,
          order.total,
          order.coupon_code || null,
          order.discount || 0
        ]
      );

      const orderId = (res as ResultSetHeader).insertId;

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
  } catch {
    // Write orders to a local fallback file
    const ordersList = readFallbackOrders();
    
    const mockOrderId = Math.floor(Math.random() * 90000) + 10000;
    const fallbackOrder = {
      id: mockOrderId,
      ...order,
      items,
      created_at: new Date().toISOString()
    };
    
    ordersList.push(fallbackOrder);
    writeFallbackOrders(ordersList);
    
    console.log(`MySQL Disconnected. Order logged locally to: ${ordersFallbackPath}`);
    return mockOrderId;
  }
}

export async function getOrdersForCustomer(customerId: number): Promise<CustomerOrder[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();
    await ensureOrderCustomerColumn();

    const orders = await rawQuery<Array<Omit<CustomerOrder, 'items'>>>(
      `SELECT id, customer_id, first_name, last_name, address, city, zip_code,
              payment_method, subtotal, tax, total, coupon_code, discount, status, delivery_proof, created_at
       FROM orders
       WHERE customer_id = ?
       ORDER BY created_at DESC, id DESC`,
      [customerId]
    );

    if (orders.length === 0) return [];

    const orderIds = orders.map((order) => order.id);
    const placeholders = orderIds.map(() => '?').join(',');
    const items = await rawQuery<Array<CustomerOrderItem & { order_id: number }>>(
      `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
              p.image_url AS product_image_url, oi.size, oi.qty, oi.price
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${placeholders})
       ORDER BY oi.id ASC`,
      orderIds
    );

    return orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      discount: order.discount ? Number(order.discount) : 0,
      coupon_code: order.coupon_code || null,
      delivery_proof: order.delivery_proof || null,
      items: items
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name || `Product #${item.product_id}`,
          product_image_url: item.product_image_url || '/apex-logo.png',
          size: item.size,
          qty: Number(item.qty),
          price: Number(item.price)
        }))
    }));
  } catch {
    const fallbackOrders = readFallbackOrders()
      .filter((order) => order.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const products = readFallbackProducts();
    return fallbackOrders.map((order) => ({
      id: order.id,
      customer_id: order.customer_id || null,
      first_name: order.first_name,
      last_name: order.last_name,
      address: order.address,
      city: order.city,
      zip_code: order.zip_code,
      payment_method: order.payment_method,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      status: order.status || 'confirmed',
      coupon_code: order.coupon_code || null,
      discount: order.discount ? Number(order.discount) : 0,
      delivery_proof: order.delivery_proof || null,
      created_at: order.created_at,
      items: order.items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.product_id);
        return {
          product_id: item.product_id,
          product_name: product?.name || `Product #${item.product_id}`,
          product_image_url: product?.image_url || '/apex-logo.png',
          size: item.size,
          qty: Number(item.qty),
          price: Number(item.price)
        };
      })
    }));
  }
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();
    await ensureOrderCustomerColumn();

    const orders = await rawQuery<Array<Omit<AdminOrder, 'items'>>>(
      `SELECT o.id, o.customer_id, o.first_name, o.last_name, o.address, o.city, o.zip_code,
              o.payment_method, o.subtotal, o.tax, o.total, o.coupon_code, o.discount, o.status, o.delivery_proof, o.created_at,
              c.name AS customer_name, c.email AS customer_email
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC, o.id DESC`
    );

    if (orders.length === 0) return [];

    const orderIds = orders.map((order) => order.id);
    const placeholders = orderIds.map(() => '?').join(',');
    const items = await rawQuery<Array<CustomerOrderItem & { order_id: number }>>(
      `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
              p.image_url AS product_image_url, oi.size, oi.qty, oi.price
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (${placeholders})
       ORDER BY oi.id ASC`,
      orderIds
    );

    return orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      discount: order.discount ? Number(order.discount) : 0,
      coupon_code: order.coupon_code || null,
      delivery_proof: order.delivery_proof || null,
      items: items
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name || `Product #${item.product_id}`,
          product_image_url: item.product_image_url || '/apex-logo.png',
          size: item.size,
          qty: Number(item.qty),
          price: Number(item.price)
        }))
    }));
  } catch {
    const products = readFallbackProducts();
    const customers = readFallbackCustomers();

    return readFallbackOrders()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((order) => {
        const customer = customers.find((candidate) => candidate.id === order.customer_id);
        return {
          id: order.id,
          customer_id: order.customer_id || null,
          customer_name: customer?.name || null,
          customer_email: customer?.email || null,
          first_name: order.first_name,
          last_name: order.last_name,
          address: order.address,
          city: order.city,
          zip_code: order.zip_code,
          payment_method: order.payment_method,
          subtotal: Number(order.subtotal),
          tax: Number(order.tax),
          total: Number(order.total),
          status: order.status || 'confirmed',
          coupon_code: order.coupon_code || null,
          discount: order.discount ? Number(order.discount) : 0,
          delivery_proof: order.delivery_proof || null,
          created_at: order.created_at,
          items: order.items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.product_id);
            return {
              product_id: item.product_id,
              product_name: product?.name || `Product #${item.product_id}`,
              product_image_url: product?.image_url || '/apex-logo.png',
              size: item.size,
              qty: Number(item.qty),
              price: Number(item.price)
            };
          })
        };
      });
  }
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await updateOrderStatusAndProof(orderId, status);
}

export async function updateOrderStatusAndProof(orderId: number, status: string, deliveryProof?: string | null): Promise<void> {
  const allowedStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid order status.');
  }

  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    if (deliveryProof !== undefined) {
      await rawQuery<ResultSetHeader>(
        'UPDATE orders SET status = ?, delivery_proof = ? WHERE id = ?',
        [status, deliveryProof, orderId]
      );
    } else {
      await rawQuery<ResultSetHeader>(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );
    }
  } catch {
    const orders = readFallbackOrders();
    const index = orders.findIndex((order) => order.id === orderId);
    if (index === -1) {
      throw new Error('Order not found.');
    }

    orders[index] = { 
      ...orders[index], 
      status,
      ...(deliveryProof !== undefined ? { delivery_proof: deliveryProof } : {})
    };
    writeFallbackOrders(orders);
  }
}

export async function getOrderById(orderId: number): Promise<AdminOrder | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');
    await ensureCustomerTables();
    await ensureOrderCustomerColumn();

    const rows = await rawQuery<Array<Omit<AdminOrder, 'items'>>>(
      `SELECT o.id, o.customer_id, o.first_name, o.last_name, o.address, o.city, o.zip_code,
              o.payment_method, o.subtotal, o.tax, o.total, o.coupon_code, o.discount, o.status, o.delivery_proof, o.created_at,
              c.name AS customer_name, c.email AS customer_email
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.id = ?`,
      [orderId]
    );

    if (rows.length === 0) return null;
    const order = rows[0];

    const items = await rawQuery<Array<CustomerOrderItem & { order_id: number }>>(
      `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
              p.image_url AS product_image_url, oi.size, oi.qty, oi.price
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [orderId]
    );

    return {
      ...order,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      discount: order.discount ? Number(order.discount) : 0,
      coupon_code: order.coupon_code || null,
      delivery_proof: order.delivery_proof || null,
      items: items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name || `Product #${item.product_id}`,
        product_image_url: item.product_image_url || '/apex-logo.png',
        size: item.size,
        qty: Number(item.qty),
        price: Number(item.price)
      }))
    };
  } catch {
    const all = await getAdminOrders();
    return all.find(o => o.id === orderId) || null;
  }
}

// ==================== Contact Messages ====================

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<ContactMessage[]>(
      'SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC'
    );
  } catch {
    return readFallbackMessages().sort((a, b) => b.id - a.id);
  }
}

export async function createContactMessage(msg: ContactMessageInput): Promise<ContactMessage> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [msg.name, msg.email, msg.subject, msg.message]
    );

    return {
      id: result.insertId,
      ...msg,
      is_read: false,
      created_at: new Date().toISOString()
    };
  } catch {
    const messages = readFallbackMessages();
    const created: ContactMessage = {
      id: nextLocalId(messages),
      ...msg,
      is_read: false,
      created_at: new Date().toISOString()
    };
    writeFallbackMessages([...messages, created]);
    return created;
  }
}

export async function markMessageRead(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );
  } catch {
    const messages = readFallbackMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].is_read = true;
      writeFallbackMessages(messages);
    }
  }
}

export async function deleteContactMessage(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );
  } catch {
    const messages = readFallbackMessages();
    writeFallbackMessages(messages.filter(m => m.id !== id));
  }
}

// ==================== Categories ====================

export async function getCategories(): Promise<Category[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<Category[]>(
      'SELECT * FROM categories ORDER BY id ASC'
    );
  } catch {
    return readFallbackCategories();
  }
}

export async function createCategory(cat: CategoryInput): Promise<Category> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO categories (name, slug) VALUES (?, ?)`,
      [cat.name, cat.slug]
    );

    return {
      id: result.insertId,
      ...cat
    };
  } catch {
    const categories = readFallbackCategories();
    const created: Category = {
      id: nextLocalId(categories),
      ...cat
    };
    writeFallbackCategories([...categories, created]);
    return created;
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
  } catch {
    const categories = readFallbackCategories();
    writeFallbackCategories(categories.filter(c => c.id !== id));
  }
}

export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const rows = await rawQuery<Category[]>('SELECT * FROM categories WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return readFallbackCategories().find(c => c.id === id) || null;
  }
}

export async function updateCategory(id: number, cat: CategoryInput): Promise<Category> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
      [cat.name, cat.slug, id]
    );

    return {
      id,
      ...cat
    };
  } catch {
    const categories = readFallbackCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { id, ...cat };
      writeFallbackCategories(categories);
    }
    return { id, ...cat };
  }
}

// ==================== Memberships ====================

export async function getMembershipApplications(): Promise<MembershipApplication[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<MembershipApplication[]>(
      'SELECT * FROM membership_applications ORDER BY created_at DESC, id DESC'
    );
  } catch {
    return readFallbackMemberships().sort((a, b) => b.id - a.id);
  }
}

export async function createMembershipApplication(app: MembershipApplicationInput): Promise<MembershipApplication> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO membership_applications (name, email, size, position, member_id) VALUES (?, ?, ?, ?, ?)`,
      [app.name, app.email, app.size, app.position, app.member_id]
    );

    return {
      id: result.insertId,
      ...app,
      created_at: new Date().toISOString()
    };
  } catch {
    const memberships = readFallbackMemberships();
    const created: MembershipApplication = {
      id: nextLocalId(memberships),
      ...app,
      created_at: new Date().toISOString()
    };
    writeFallbackMemberships([...memberships, created]);
    return created;
  }
}

export async function deleteMembershipApplication(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'DELETE FROM membership_applications WHERE id = ?',
      [id]
    );
  } catch {
    const memberships = readFallbackMemberships();
    writeFallbackMemberships(memberships.filter(m => m.id !== id));
  }
}

// ==================== Promo Codes ====================

export async function getPromoCodes(): Promise<PromoCode[]> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    return await rawQuery<PromoCode[]>(
      'SELECT * FROM promo_codes ORDER BY created_at DESC, id DESC'
    );
  } catch {
    return readFallbackPromoCodes().sort((a, b) => b.id - a.id);
  }
}

export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const rows = await rawQuery<PromoCode[]>(
      'SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?)',
      [code.trim()]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch {
    return readFallbackPromoCodes().find(p => p.code.toUpperCase() === code.trim().toUpperCase()) || null;
  }
}

export async function createPromoCode(promo: PromoCodeInput): Promise<PromoCode> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    const result = await rawQuery<ResultSetHeader>(
      `INSERT INTO promo_codes (code, type, value, min_spend, applies_to, product_ids) VALUES (?, ?, ?, ?, ?, ?)`,
      [promo.code.toUpperCase(), promo.type, promo.value, promo.min_spend, promo.applies_to, promo.product_ids]
    );

    return {
      id: result.insertId,
      ...promo,
      code: promo.code.toUpperCase(),
      created_at: new Date().toISOString()
    };
  } catch {
    const promos = readFallbackPromoCodes();
    const created: PromoCode = {
      id: nextLocalId(promos),
      ...promo,
      code: promo.code.toUpperCase(),
      created_at: new Date().toISOString()
    };
    writeFallbackPromoCodes([...promos, created]);
    return created;
  }
}

export async function deletePromoCode(id: number): Promise<void> {
  try {
    const { connected } = await checkConnection();
    if (!connected || isMockDb) throw new Error('Local fallback triggered');

    await rawQuery<ResultSetHeader>(
      'DELETE FROM promo_codes WHERE id = ?',
      [id]
    );
  } catch {
    const promos = readFallbackPromoCodes();
    writeFallbackPromoCodes(promos.filter(p => p.id !== id));
  }
}

