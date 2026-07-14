-- Add columns to orders table
ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(100) NULL AFTER total;
ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER coupon_code;
ALTER TABLE orders ADD COLUMN delivery_proof VARCHAR(255) NULL AFTER status;
