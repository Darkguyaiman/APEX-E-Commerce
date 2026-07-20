-- Add category images for homepage category cards
ALTER TABLE categories
ADD COLUMN image_url VARCHAR(255) NULL AFTER slug;

UPDATE categories
SET image_url = CASE slug
  WHEN 'men' THEN '/images/collection-mens.jpg'
  WHEN 'women' THEN '/images/collection-womens.jpg'
  WHEN 'kit' THEN '/images/collection-speedlab.jpg'
  ELSE image_url
END
WHERE image_url IS NULL;
