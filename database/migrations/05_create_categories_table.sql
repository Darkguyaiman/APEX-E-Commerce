-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default categories
INSERT INTO categories (name, slug, image_url) VALUES
('Men', 'men', '/images/collection-mens.jpg'),
('Women', 'women', '/images/collection-womens.jpg'),
('Kit', 'kit', '/images/collection-speedlab.jpg')
ON DUPLICATE KEY UPDATE name=VALUES(name), image_url=COALESCE(categories.image_url, VALUES(image_url));
