import mysql from 'mysql2/promise';
import type { Pool, ResultSetHeader } from 'mysql2/promise';

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
  requires_size?: boolean | number;
  size_options?: string | null;
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
  requires_size: boolean;
  size_options: string | null;
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
  image_url: string | null;
}

export interface CategoryInput {
  name: string;
  slug: string;
  image_url: string | null;
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

interface OrderItemRow extends CustomerOrderItem {
  order_id: number;
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

type QueryParam = string | number | boolean | null;

const poolConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'apex_pitch',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  connectTimeout: 5000,
};

const SHOP_HERO_PRODUCT_ID_KEY = 'shop_hero_product_id';
let pool: Pool | null = null;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }
  return pool;
}

export async function checkConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const conn = await getPool().getConnection();
    conn.release();
    return { connected: true, message: `Connected to MySQL: ${poolConfig.database}@${poolConfig.host}` };
  } catch (error: unknown) {
    return { connected: false, message: `Disconnected: ${getErrorMessage(error)}` };
  }
}

export async function rawQuery<T>(sql: string, params?: QueryParam[]): Promise<T> {
  const { connected, message } = await checkConnection();
  if (!connected) {
    throw new Error(`MySQL is not connected. ${message}`);
  }

  const [rows] = await getPool().execute(sql, params);
  return rows as T;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    requires_size: product.requires_size === undefined || product.requires_size === null
      ? true
      : Boolean(product.requires_size),
    size_options: product.size_options || null
  };
}

function normalizeProducts(products: Product[]): Product[] {
  return products.map(normalizeProduct);
}

async function ignoreExistingSchemaChange(sql: string) {
  try {
    await rawQuery(sql);
  } catch {
    // MySQL throws when additive schema changes already exist.
  }
}

async function ensureProductSchema() {
  await ignoreExistingSchemaChange('ALTER TABLE products ADD COLUMN requires_size BOOLEAN NOT NULL DEFAULT TRUE AFTER tags');
  await ignoreExistingSchemaChange('ALTER TABLE products ADD COLUMN size_options VARCHAR(255) NULL AFTER requires_size');
  await ignoreExistingSchemaChange('ALTER TABLE products ADD COLUMN faqs TEXT NULL AFTER size_options');

  await rawQuery(
    `CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      is_main BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  await rawQuery(
    `CREATE TABLE IF NOT EXISTS product_videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      video_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
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

async function ensureContactMessagesTable() {
  await rawQuery(
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

async function ensureMembershipApplicationsTable() {
  await rawQuery(
    `CREATE TABLE IF NOT EXISTS membership_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      size VARCHAR(50) NOT NULL,
      position VARCHAR(100) NOT NULL,
      member_id VARCHAR(50) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

async function ensurePromoCodesTable() {
  await rawQuery(
    `CREATE TABLE IF NOT EXISTS promo_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(100) NOT NULL UNIQUE,
      type VARCHAR(50) NOT NULL,
      value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      applies_to VARCHAR(50) NOT NULL DEFAULT 'all',
      product_ids VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

export async function getProducts(category?: string): Promise<Product[]> {
  await ensureProductSchema();

  let sql = 'SELECT * FROM products';
  const params: QueryParam[] = [];
  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  return normalizeProducts(await rawQuery<Product[]>(sql, params));
}

export async function getShopHeroProductId(): Promise<number | null> {
  await ensureSettingsTable();

  const rows = await rawQuery<Array<{ setting_value: string }>>(
    'SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1',
    [SHOP_HERO_PRODUCT_ID_KEY]
  );
  const productId = Number(rows[0]?.setting_value);
  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

export async function setShopHeroProductId(productId: number): Promise<number> {
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('Product not found.');
  }

  await ensureSettingsTable();
  await rawQuery(
    `INSERT INTO site_settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [SHOP_HERO_PRODUCT_ID_KEY, String(productId)]
  );

  return productId;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await ensureProductSchema();

  const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE slug = ?', [slug]);
  if (rows.length === 0) return null;

  const product = rows[0];
  const [images, videos] = await Promise.all([
    rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [product.id]),
    rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [product.id])
  ]);

  return normalizeProduct({ ...product, images, videos });
}

export async function getProductById(id: number): Promise<Product | null> {
  await ensureProductSchema();

  const rows = await rawQuery<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) return null;

  const product = rows[0];
  const [images, videos] = await Promise.all([
    rawQuery<ProductImage[]>('SELECT * FROM product_images WHERE product_id = ?', [product.id]),
    rawQuery<ProductVideo[]>('SELECT * FROM product_videos WHERE product_id = ?', [product.id])
  ]);

  return normalizeProduct({ ...product, images, videos });
}

function resolveMainImage(product: ProductInput) {
  if (!product.images || product.images.length === 0) return product.image_url;
  return (product.images.find((img) => img.is_main) || product.images[0]).image_url;
}

async function replaceProductMedia(productId: number, mainImageUrl: string, product: ProductInput) {
  await rawQuery('DELETE FROM product_images WHERE product_id = ?', [productId]);

  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      await rawQuery(
        'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
        [productId, img.image_url, img.is_main]
      );
    }
  } else {
    await rawQuery(
      'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, TRUE)',
      [productId, mainImageUrl]
    );
  }

  await rawQuery('DELETE FROM product_videos WHERE product_id = ?', [productId]);
  if (product.videos && product.videos.length > 0) {
    for (const vid of product.videos) {
      await rawQuery(
        'INSERT INTO product_videos (product_id, title, video_url) VALUES (?, ?, ?)',
        [productId, vid.title, vid.video_url]
      );
    }
  }
}

export async function createProduct(product: ProductInput): Promise<Product> {
  await ensureProductSchema();

  const mainImageUrl = resolveMainImage(product);
  const result = await rawQuery<ResultSetHeader>(
    `INSERT INTO products
     (name, slug, price, original_price, category, image_url, colorway, weight_grams, traction_type, description, type_chip, tags, requires_size, size_options, faqs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      product.requires_size,
      product.size_options,
      product.faqs || null
    ]
  );

  await replaceProductMedia(result.insertId, mainImageUrl, product);
  const created = await getProductById(result.insertId);
  if (!created) throw new Error('Product was created but could not be loaded.');
  return created;
}

export async function updateProduct(id: number, product: ProductInput): Promise<Product> {
  await ensureProductSchema();

  const mainImageUrl = resolveMainImage(product);
  await rawQuery<ResultSetHeader>(
    `UPDATE products
     SET name = ?, slug = ?, price = ?, original_price = ?, category = ?, image_url = ?, colorway = ?,
         weight_grams = ?, traction_type = ?, description = ?, type_chip = ?, tags = ?, requires_size = ?, size_options = ?, faqs = ?
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
      product.requires_size,
      product.size_options,
      product.faqs || null,
      id
    ]
  );

  await replaceProductMedia(id, mainImageUrl, product);
  const updated = await getProductById(id);
  if (!updated) throw new Error('Product not found.');
  return updated;
}

export async function deleteProduct(id: number): Promise<void> {
  await rawQuery('DELETE FROM products WHERE id = ?', [id]);
}

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
  await ensureCustomerTables();
  const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  await ensureCustomerTables();
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE email = ? LIMIT 1', [normalizedEmail]);
  return rows[0] || null;
}

export async function findCustomerByGoogleId(googleId: string): Promise<Customer | null> {
  await ensureCustomerTables();
  const rows = await rawQuery<Customer[]>('SELECT * FROM customers WHERE google_id = ? LIMIT 1', [googleId]);
  return rows[0] || null;
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  await ensureCustomerTables();
  const normalizedEmail = input.email.trim().toLowerCase();

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
}

export async function createEmailVerificationToken(customerId: number, token: string): Promise<void> {
  await ensureCustomerTables();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await rawQuery('DELETE FROM email_verification_tokens WHERE customer_id = ?', [customerId]);
  await rawQuery(
    'INSERT INTO email_verification_tokens (customer_id, token, expires_at) VALUES (?, ?, ?)',
    [customerId, token, expiresAt.slice(0, 19).replace('T', ' ')]
  );
}

export async function verifyCustomerByToken(token: string): Promise<Customer | null> {
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
}

export async function verifyCustomerEmail(customerId: number): Promise<void> {
  await ensureCustomerTables();
  await rawQuery('UPDATE customers SET email_verified = TRUE WHERE id = ?', [customerId]);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return rawQuery<Testimonial[]>('SELECT * FROM testimonials ORDER BY created_at DESC, id DESC');
}

export async function createTestimonial(testimonial: TestimonialInput): Promise<Testimonial> {
  const result = await rawQuery<ResultSetHeader>(
    `INSERT INTO testimonials (customer_name, role, quote, rating)
     VALUES (?, ?, ?, ?)`,
    [testimonial.customer_name, testimonial.role, testimonial.quote, testimonial.rating]
  );

  return {
    id: result.insertId,
    ...testimonial,
    created_at: new Date().toISOString()
  };
}

export async function getTestimonialById(id: number): Promise<Testimonial | null> {
  const rows = await rawQuery<Testimonial[]>('SELECT * FROM testimonials WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function updateTestimonial(id: number, testimonial: TestimonialInput): Promise<Testimonial> {
  await rawQuery<ResultSetHeader>(
    `UPDATE testimonials
     SET customer_name = ?, role = ?, quote = ?, rating = ?
     WHERE id = ?`,
    [testimonial.customer_name, testimonial.role, testimonial.quote, testimonial.rating, id]
  );

  return { id, ...testimonial };
}

export async function deleteTestimonial(id: number): Promise<void> {
  await rawQuery('DELETE FROM testimonials WHERE id = ?', [id]);
}

async function ensureOrderCustomerColumn() {
  await ignoreExistingSchemaChange('ALTER TABLE orders ADD COLUMN customer_id INT NULL AFTER id');
  await ignoreExistingSchemaChange(
    'ALTER TABLE orders ADD CONSTRAINT fk_orders_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL'
  );
  await ensureOrderDiscountAndProofColumns();
}

async function ensureOrderDiscountAndProofColumns() {
  await ignoreExistingSchemaChange('ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(100) NULL AFTER total');
  await ignoreExistingSchemaChange('ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER coupon_code');
  await ignoreExistingSchemaChange('ALTER TABLE orders ADD COLUMN delivery_proof VARCHAR(255) NULL AFTER status');
}

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
  await ensureCustomerTables();
  await ensureOrderCustomerColumn();

  const conn = await getPool().getConnection();
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
        'INSERT INTO order_items (order_id, product_id, size, qty, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.size, item.qty, item.price]
      );
    }

    await conn.commit();
    return orderId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

function mapOrderItem(item: CustomerOrderItem): CustomerOrderItem {
  return {
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name || `Product #${item.product_id}`,
    product_image_url: item.product_image_url || '/apex-logo.png',
    size: item.size,
    qty: Number(item.qty),
    price: Number(item.price)
  };
}

function normalizeCustomerOrder(order: Omit<CustomerOrder, 'items'>, items: OrderItemRow[]): CustomerOrder {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    total: Number(order.total),
    discount: order.discount ? Number(order.discount) : 0,
    coupon_code: order.coupon_code || null,
    delivery_proof: order.delivery_proof || null,
    items: items.filter((item) => item.order_id === order.id).map(mapOrderItem)
  };
}

function normalizeAdminOrder(order: Omit<AdminOrder, 'items'>, items: OrderItemRow[]): AdminOrder {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    total: Number(order.total),
    discount: order.discount ? Number(order.discount) : 0,
    coupon_code: order.coupon_code || null,
    delivery_proof: order.delivery_proof || null,
    items: items.filter((item) => item.order_id === order.id).map(mapOrderItem)
  };
}

export async function getOrdersForCustomer(customerId: number): Promise<CustomerOrder[]> {
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
  const items = await rawQuery<OrderItemRow[]>(
    `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
            p.image_url AS product_image_url, oi.size, oi.qty, oi.price
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (${placeholders})
     ORDER BY oi.id ASC`,
    orderIds
  );

  return orders.map((order) => normalizeCustomerOrder(order, items));
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
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
  const items = await rawQuery<OrderItemRow[]>(
    `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
            p.image_url AS product_image_url, oi.size, oi.qty, oi.price
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (${placeholders})
     ORDER BY oi.id ASC`,
    orderIds
  );

  return orders.map((order) => normalizeAdminOrder(order, items));
}

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  await updateOrderStatusAndProof(orderId, status);
}

export async function updateOrderStatusAndProof(orderId: number, status: string, deliveryProof?: string | null): Promise<void> {
  const allowedStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid order status.');
  }

  if (deliveryProof !== undefined) {
    await rawQuery<ResultSetHeader>(
      'UPDATE orders SET status = ?, delivery_proof = ? WHERE id = ?',
      [status, deliveryProof, orderId]
    );
    return;
  }

  await rawQuery<ResultSetHeader>('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}

export async function getOrderById(orderId: number): Promise<AdminOrder | null> {
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

  const items = await rawQuery<OrderItemRow[]>(
    `SELECT oi.id, oi.order_id, oi.product_id, p.name AS product_name,
            p.image_url AS product_image_url, oi.size, oi.qty, oi.price
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [orderId]
  );

  return normalizeAdminOrder(rows[0], items);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  await ensureContactMessagesTable();
  return rawQuery<ContactMessage[]>('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC');
}

export async function createContactMessage(msg: ContactMessageInput): Promise<ContactMessage> {
  await ensureContactMessagesTable();
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
}

export async function markMessageRead(id: number): Promise<void> {
  await ensureContactMessagesTable();
  await rawQuery<ResultSetHeader>('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);
}

export async function deleteContactMessage(id: number): Promise<void> {
  await ensureContactMessagesTable();
  await rawQuery<ResultSetHeader>('DELETE FROM contact_messages WHERE id = ?', [id]);
}

async function ensureCategoryImageColumn() {
  await ignoreExistingSchemaChange('ALTER TABLE categories ADD COLUMN image_url VARCHAR(255) NULL AFTER slug');
}

export async function getCategories(): Promise<Category[]> {
  await ensureCategoryImageColumn();
  return rawQuery<Category[]>('SELECT * FROM categories ORDER BY id ASC');
}

export async function createCategory(cat: CategoryInput): Promise<Category> {
  await ensureCategoryImageColumn();
  const result = await rawQuery<ResultSetHeader>(
    'INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)',
    [cat.name, cat.slug, cat.image_url]
  );
  return { id: result.insertId, ...cat };
}

export async function deleteCategory(id: number): Promise<void> {
  await rawQuery<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
}

export async function getCategoryById(id: number): Promise<Category | null> {
  await ensureCategoryImageColumn();
  const rows = await rawQuery<Category[]>('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function updateCategory(id: number, cat: CategoryInput): Promise<Category> {
  await ensureCategoryImageColumn();
  await rawQuery<ResultSetHeader>(
    'UPDATE categories SET name = ?, slug = ?, image_url = ? WHERE id = ?',
    [cat.name, cat.slug, cat.image_url, id]
  );
  return { id, ...cat };
}

export async function getMembershipApplications(): Promise<MembershipApplication[]> {
  await ensureMembershipApplicationsTable();
  return rawQuery<MembershipApplication[]>('SELECT * FROM membership_applications ORDER BY created_at DESC, id DESC');
}

export async function createMembershipApplication(app: MembershipApplicationInput): Promise<MembershipApplication> {
  await ensureMembershipApplicationsTable();
  const result = await rawQuery<ResultSetHeader>(
    'INSERT INTO membership_applications (name, email, size, position, member_id) VALUES (?, ?, ?, ?, ?)',
    [app.name, app.email, app.size, app.position, app.member_id]
  );
  return { id: result.insertId, ...app, created_at: new Date().toISOString() };
}

export async function deleteMembershipApplication(id: number): Promise<void> {
  await ensureMembershipApplicationsTable();
  await rawQuery<ResultSetHeader>('DELETE FROM membership_applications WHERE id = ?', [id]);
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  await ensurePromoCodesTable();
  return rawQuery<PromoCode[]>('SELECT * FROM promo_codes ORDER BY created_at DESC, id DESC');
}

export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
  await ensurePromoCodesTable();
  const rows = await rawQuery<PromoCode[]>(
    'SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?)',
    [code.trim()]
  );
  return rows[0] || null;
}

export async function createPromoCode(promo: PromoCodeInput): Promise<PromoCode> {
  await ensurePromoCodesTable();
  const result = await rawQuery<ResultSetHeader>(
    'INSERT INTO promo_codes (code, type, value, min_spend, applies_to, product_ids) VALUES (?, ?, ?, ?, ?, ?)',
    [promo.code.toUpperCase(), promo.type, promo.value, promo.min_spend, promo.applies_to, promo.product_ids]
  );
  return {
    id: result.insertId,
    ...promo,
    code: promo.code.toUpperCase(),
    created_at: new Date().toISOString()
  };
}

export async function deletePromoCode(id: number): Promise<void> {
  await ensurePromoCodesTable();
  await rawQuery<ResultSetHeader>('DELETE FROM promo_codes WHERE id = ?', [id]);
}
