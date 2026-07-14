-- Create Membership Applications Table
CREATE TABLE IF NOT EXISTS membership_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    member_id VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial test applications
INSERT INTO membership_applications (name, email, size, position, member_id) VALUES
('Marcus Alisson', 'marcus@pitch.com', '10.5', 'Midfielder', 'APX-9821'),
('Sarah Jenkins', 'sarah.j@apex.com', '8.5', 'Forward', 'APX-4102'),
('Kenji Sato', 'sato@football.jp', '9.5', 'Defender', 'APX-1289')
ON DUPLICATE KEY UPDATE member_id=member_id;
