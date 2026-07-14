-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default categories
INSERT INTO categories (name, slug) VALUES 
('Men', 'men'),
('Women', 'women'),
('Kit', 'kit')
ON DUPLICATE KEY UPDATE name=name;
