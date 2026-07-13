-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS apex_pitch;
USE apex_pitch;

-- Drop tables if they exist (for easy re-seeding)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS product_images;
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
    tags VARCHAR(255) NULL, -- Comma-separated tags, e.g., 'STABILITY CLAW,CARBON SOLE'
    faqs TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1.5. Create Product Images Table
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Testimonials Table
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    quote TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Orders Table
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

-- 4. Create Order Items Table
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

-- -- 5. Seed Products Data
INSERT INTO products (id, name, slug, price, original_price, category, image_url, colorway, weight_grams, traction_type, description, type_chip, tags) VALUES
(1, 'Nike Air Zoom Mercurial Vapor 15 Elite FG', 'nike-air-zoom-mercurial-vapor-15-elite-fg', 1149.00, 1249.00, 'men', '/images/product/vapor.png', 'BRIGHT CRIMSON / VOLT METALLIC', '185g', 'FG', 'Engineered with a football-specific 3/4 Zoom Air unit under the sole plate, providing explosive propulsion and snappy feedback.', 'ELITE SPEED', 'ZOOM AIR,VAPORPOSITE'),
(2, 'Adidas Predator Elite Fold-Over Tongue FG', 'adidas-predator-elite-fold-over-tongue-fg', 1299.00, NULL, 'men', '/images/product/predator-elite.png', 'CORE BLACK / SOLAR RED', '210g', 'FG', 'Featuring the return of the iconic fold-over tongue and Strikeskin grip fins for lethal control and execution in key striking zones.', 'LETHAL TOUCH', 'STRIKESKIN,LEGEND TONGUE'),
(3, 'Puma Future Ultimate FG/AG', 'puma-future-ultimate-fg-ag', 999.00, NULL, 'men', '/images/product/future.png', 'BLUE GLIMMER / WHITE', '190g', 'FG/AG', 'Designed with FUZIONFIT360 dual mesh upper and PWRTAPE reinforcement for adaptive support and lock-down agility.', 'AGILITY CORE', 'FUZIONFIT,PWRTAPE'),
(4, 'Nike Phantom GX II Elite FG', 'nike-phantom-gx-ii-elite-fg', 1099.00, NULL, 'men', '/images/product/ghost.png', 'VOLT / WOLF GREY', '195g', 'FG', 'Equipped with revolutionary Gripknit touch skins and the Cyclone 360 traction plate for surgical precision and pivot agility.', 'CONTROL PRO', 'GRIPKNIT,CYCLONE 360'),
(5, 'Mizuno Morelia Neo IV Beta Japan FG', 'mizuno-morelia-neo-iv-beta-japan-fg', 1399.00, NULL, 'men', '/images/product/mizuno.png', 'PURA WHITE / GOLD', '175g', 'FG', 'Handcrafted in Japan with premium K-Leather for a barefoot feel and ultimate structural precision. The pinnacle of craftsmanship.', 'HANDCRAFTED', 'K-LEATHER,MADE IN JAPAN'),
(6, 'Nike Zoom Mercurial Superfly 9 Academy TF', 'nike-zoom-mercurial-superfly-9-academy-tf', 379.00, NULL, 'men', '/images/product/stealth.png', 'METALLIC COPPER', '220g', 'TF', 'Artificial turf soccer shoe featuring a low-profile rubber outsole, sock-like collar lock-down, and a springy Zoom Air heel unit.', 'BEST SELLER', 'ZOOM AIR,TURF TRACK'),
(7, 'Nike Women\'s Phantom Luna II Elite FG', 'nike-womens-phantom-luna-ii-elite-fg', 1149.00, NULL, 'women', '/images/product/crimson-vapor.png', 'SUNSET CRIMSON / VOLT', '180g', 'FG', 'Specifically engineered for female athletes, featuring the Cyclone 360 stud layout for rotational traction and high-cuff lock-down collar.', 'ELITE AGILITY', 'CYCLONE 360,FIT-GRID'),
(8, 'Puma Women\'s Ultra Ultimate FG/AG', 'puma-womens-ultra-ultimate-fg-ag', 999.00, NULL, 'women', '/images/product/ghost-phantom.png', 'FIERY CORAL / GOLD', '155g', 'FG/AG', 'Featherweight speed cleat with ULTRAWEAVE upper material and speedplate sole for blistering pace and rapid transitions.', 'LIGHTEST YET', 'ULTRAWEAVE,SPEEDPLATE'),
(9, 'Adidas Women\'s Copa Pure 2.1 FG', 'adidas-womens-copa-pure-21-fg', 899.00, NULL, 'women', '/images/product/velocity-react.png', 'PURA WHITE / SILENT BLUE', '195g', 'FG', 'Ultra-comfortable leather boot featuring a Fusionskin leather forefoot for pillow-soft touch and stable heel counter fit.', 'PURE TOUCH', 'FUSIONSKIN,COPA LAST'),
(10, 'Nike Women\'s Tiempo Legend 10 Elite FG', 'nike-womens-tiempo-legend-10-elite-fg', 1049.00, NULL, 'women', '/images/product/merc-alpha.png', 'MATTE PLATINUM / PINK', '185g', 'FG', 'Engineered with FlyTouch Plus leather alternative for superior touch control without water absorption. A masterclass in comfort.', 'LEGEND FIT', 'FLYTOUCH PLUS,MICRO-DOTS'),
(11, 'Puma Future Match Women\'s Turf', 'puma-future-match-womens-turf', 399.00, NULL, 'women', '/images/product/crimson-vapor.png', 'CRIMSON / ELECTRIC LIME', '210g', 'TF', 'Turf execution of the Future franchise, carrying an adaptable mid-cut collar and multi-studded rubber outsole for high grip.', 'RESTOCKED', 'TURF STUD,FUZIONFIT'),
(12, 'Nike Strike Luminous Ball Size 5', 'nike-strike-luminous-ball-size-5', 129.00, NULL, 'kit', '/images/product/hero-gold-elite.jpg', 'VOLT / REFLECTIVE GREY', '420g', 'ALL-WEATHER', 'Engineered with Aerowsculpt textured grooves for stable flight and high-contrast visuals to track easily in bad light.', 'TRAINING', 'AEROWSCULPT,SIZE 5'),
(13, 'Adidas Creator Compression Shin Guards', 'adidas-creator-compression-shin-guards', 179.00, NULL, 'kit', '/images/product/kit-shields.jpg', 'CARBON BLACK', '65g', 'IMPACT COMPRESSION', 'Equipped with carbon-infused hard shields and premium compression sleeve pockets for secure slippage prevention.', 'PROTECTION', 'HARD SHIELD,SLEEVE POCKET'),
(14, 'Grip Sox Pro Tech Grip Socks', 'grip-sox-pro-tech-grip-socks', 69.00, NULL, 'kit', '/images/product/kit-socks.jpg', 'TRIPLE BLACK', '50g', 'IN-BOOT GRIP', 'Premium soccer grip socks featuring silicone pads on both interior and exterior surfaces to eliminate in-boot foot slippage.', 'PERFORMANCE ESSENTIAL', 'ANTI-SLIP,SILICONE GRIP'),
(15, 'Nike Academy Team Duffel Bag Medium', 'nike-academy-team-duffel-bag-medium', 189.00, NULL, 'kit', '/images/product/kit-duffel.jpg', 'MATTE BLACK', '650g', 'WATERPROOF BASE', 'Heavy-duty polyester duffel featuring dedicated wet/dry storage compartments, waterproof bottom panel, and ventilated boot pockets.', 'GEAR BAG', 'WET-DRY SEPARATION,BOOT POCKET'),
(16, 'Under Armour HeatGear Compression Top', 'under-armour-heatgear-compression-top', 139.00, NULL, 'kit', '/images/product/kit-top.jpg', 'CHARCOAL BLACK / GOLD', '110g', 'COMPRESSION', 'Ultra-tight second-skin compression top with moisture-wicking technology and mesh underarm panels for cooling comfort.', 'BASE LAYER', 'HEATGEAR,MOISTURE-WICKING');

-- 6. Seed Testimonials Data
INSERT INTO testimonials (customer_name, role, quote, rating) VALUES
('Marcus Diallo', 'Semi-pro winger', 'The first boot that feels locked in at full sprint. Touch stayed sharp even on wet turf.', 5),
('Lena Park', 'Academy midfielder', 'Lightweight without feeling fragile. The fit is narrow where I need control and flexible through the forefoot.', 5),
('Tom Reyes', 'Sunday league captain', 'The carbon plate has real snap. I came back for the shields and socks after one match.', 4);

-- 7. Seed Product Images Data
INSERT INTO product_images (product_id, image_url, is_main) VALUES
(1, '/images/product/vapor.png', TRUE),
(1, '/images/product/vapor-sole.png', FALSE),
(1, '/images/product/vapor-heel.png', FALSE),
(2, '/images/product/predator-elite.png', TRUE),
(3, '/images/product/future.png', TRUE),
(4, '/images/product/ghost.png', TRUE),
(5, '/images/product/mizuno.png', TRUE),
(6, '/images/product/stealth.png', TRUE),
(7, '/images/product/crimson-vapor.png', TRUE),
(8, '/images/product/ghost-phantom.png', TRUE),
(9, '/images/product/velocity-react.png', TRUE),
(10, '/images/product/merc-alpha.png', TRUE),
(11, '/images/product/crimson-vapor.png', TRUE),
(12, '/images/product/hero-gold-elite.jpg', TRUE),
(13, '/images/product/kit-shields.jpg', TRUE),
(14, '/images/product/kit-socks.jpg', TRUE),
(15, '/images/product/kit-duffel.jpg', TRUE),
(16, '/images/product/kit-top.jpg', TRUE);
