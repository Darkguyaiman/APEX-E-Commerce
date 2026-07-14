-- Create Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'percent', 'fixed', 'free_item'
    value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    min_spend DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    applies_to VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all', 'specific'
    product_ids VARCHAR(255) NULL, -- comma-separated product IDs or free item product ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default promo codes
INSERT INTO promo_codes (code, type, value, min_spend, applies_to, product_ids) VALUES
('APEX20', 'percent', 20.00, 0.00, 'all', NULL),
('RM50OVER300', 'fixed', 50.00, 300.00, 'all', NULL),
('FREEBALL', 'free_item', 0.00, 500.00, 'all', '12')
ON DUPLICATE KEY UPDATE value=value;
