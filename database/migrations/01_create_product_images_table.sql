-- Migration: Create Product Images Table
-- Created: 2026-07-13

CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrate existing main images from products to product_images
INSERT INTO product_images (product_id, image_url, is_main)
SELECT id, image_url, TRUE FROM products
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url);
