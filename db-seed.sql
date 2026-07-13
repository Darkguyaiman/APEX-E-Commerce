-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS apex_pitch;
USE apex_pitch;

-- Drop tables if they exist (for easy re-seeding)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- 1. Create Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NULL,
    category VARCHAR(50) NOT NULL, -- 'men', 'women', 'kit'
    image_url VARCHAR(255) NOT NULL,
    colorway VARCHAR(255) NOT NULL,
    weight_grams VARCHAR(50) NOT NULL,
    traction_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    type_chip VARCHAR(50) NULL, -- 'ELITE', 'LIMITED DROP', 'NEW ARRIVAL', etc.
    tags VARCHAR(255) NULL -- Comma-separated tags, e.g., 'STABILITY CLAW,CARBON SOLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip_code VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'apple_pay'
    card_number VARCHAR(50) NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    size VARCHAR(50) NOT NULL,
    qty INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Products Data
INSERT INTO products (name, slug, price, original_price, category, image_url, colorway, weight_grams, traction_type, description, type_chip, tags) VALUES
-- Featured Men's
('Velocity Elite Neon', 'velocity-elite-neon', 275.00, NULL, 'men', '/images/collection-speedlab.jpg', 'ELITE PERFORMANCE / NEON', '185g', 'FG', 'Engineered for explosive acceleration. The future of speed is here with our lightest, most responsive carbon-fiber chassis ever designed for the elite professional.', 'ELITE', 'CARBON SOLE,FEATHERWEIGHT'),

-- Men's Collection
('Apex Predator Carbon', 'apex-predator-carbon', 240.00, NULL, 'men', '/images/product-predator.png', 'FIRM GROUND / VOLT SILVER', '195g', 'FG', 'Our signature firm ground predator cleat, equipped with carbon fiber plates for optimal traction and stability.', 'ELITE', 'STABILITY CLAW,CARBON SOLE'),
('Midnight Stealth X', 'midnight-stealth-x', 290.00, NULL, 'men', '/images/product-stealth.png', 'ARTIFICIAL TURF / TRIPLE BLACK', '205g', 'TF', 'An aggressive football boot design in deep jet black with electric lime detailing on the sole plate.', 'LIMITED DROP', 'GRIP-SKIN,PRO-FIT'),
('Titan SG Reinforced', 'titan-sg-reinforced', 215.00, 260.00, 'men', '/images/product-titan.png', 'SOFT GROUND / SLATE NEON', '220g', 'SG', 'A football boot optimized for soft ground conditions, featuring long metal studs for maximum grip.', 'NEW ARRIVAL', 'METAL STUDS,ARMOR WEAVE'),
('Ghost Pro White', 'ghost-pro-white', 195.00, NULL, 'men', '/images/product-ghost.png', 'FIRM GROUND / PURE WHITE', '180g', 'FG', 'Professional grade football boot in a pristine white colorway with geometric carbon-fiber textures.', NULL, 'TRANSLUCENT UPPER,FEATHERWEIGHT'),

-- Featured Women's
('Crimson Agility', 'crimson-agility', 265.00, NULL, 'women', '/images/collection-womens.jpg', 'WOMEN''S ELITE / CRIMSON', '170g', 'FG', 'The Crimson Agility collection redefines the game. Engineered with women-specific bio-mechanics for lethal speed and surgical precision.', 'ELITE', 'REACT CUSHIONING,360 FIT'),

-- Women's Collection
('Crimson Vapor Elite', 'crimson-vapor-elite', 249.99, 299.99, 'women', '/images/product-crimson-vapor.png', 'FIRM GROUND / CRIMSON RED', '160g', 'FG', 'A sleek crimson red and white women''s football boot with a white carbon fiber texture and lightweight fit.', 'ELITE', 'LIGHTWEIGHT,FIRM GROUND'),
('Apex Ghost Phantom', 'apex-ghost-phantom', 274.99, NULL, 'women', '/images/product-ghost-phantom.png', 'ALL CONDITIONS / WHITE & LIME', '175g', 'AG/FG', 'Dynamic side profile cleat focusing on the intricate texture of the knit upper and anatomical mapping.', 'LIMITED RELEASE', '360 FIT,ALL CONDITIONS'),
('Velocity React Pro', 'velocity-react-pro', 219.99, NULL, 'women', '/images/product-velocity-react.png', 'ELITE / DEEP CRIMSON RED', '180g', 'FG', 'A high-tech soccer boot for women featuring a deep crimson red colorway with shimmering black carbon fiber accents.', 'NEW', 'PRECISION,ELITE'),
('Merc Alpha X', 'merc-alpha-x', 199.99, NULL, 'women', '/images/product-merc-alpha.png', 'STREET / CRIMSON & SILVER', '165g', 'STREET', 'Professional cleat designed specifically for female athletes, featuring unique anatomical fit and styling.', 'RESTOCKING SOON', 'SPEED CORE,STREET'),

-- Elite Product Detail Product (Gold Elite)
('Apex Gold Elite', 'apex-gold-elite', 249.99, NULL, 'men', '/images/hero-gold-elite.jpg', 'CARBON / VOLT GOLD', '165g', 'SG/FG HYBRID', 'Engineered for the decisive moment. The Apex Gold Elite features our proprietary Grip Control Pro skin and a reinforced carbon-fiber plate for maximum energy return.', 'ELITE LEVEL', 'GRIP CONTROL,CARBON CORE'),

-- Essentials (Kit)
('Core Compression Socks', 'core-compression-socks', 24.00, NULL, 'kit', '/images/kit-socks.jpg', 'MATTE BLACK', '45g', 'ALL-WEATHER', 'High-performance compression soccer socks with arch support.', NULL, 'COMPRESSION,ARCH SUPPORT'),
('Pro Carbon Shields', 'pro-carbon-shields', 65.00, NULL, 'kit', '/images/kit-shields.jpg', 'CARBON HIVE', '75g', 'IMPACT', 'Aerodynamic lightweight carbon fiber shin guards with honeycomb shock absorbing pads.', NULL, 'CARBON FIBER,SHIELD'),
('Apex Match Day Duffel', 'apex-match-day-duffel', 85.00, NULL, 'kit', '/images/kit-duffel.jpg', 'MATTE BLACK', '850g', 'WATERPROOF', 'A matte black performance duffel bag with waterproof zippers and shoe ventilation.', NULL, 'WATERPROOF,VENTILATED'),
('Tech Dri-Fit Top', 'tech-dri-fit-top', 45.00, NULL, 'kit', '/images/kit-top.jpg', 'GOLD HEAT-PRESS', '120g', 'BREATHABLE', 'High-quality black training jersey with gold heat-pressed logo and moisture wicking.', NULL, 'DRI-FIT,BREATHABLE');
