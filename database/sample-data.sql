-- Sample data for Four Leaf Clover Jewelry Shop

-- Insert sample product images for existing products
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'Sterling Silver Four-Leaf Clover Ring - Main View', 0, true),
(1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85', 'Sterling Silver Four-Leaf Clover Ring - Side View', 1, false),

(2, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'Rose Gold Clover Necklace - Main View', 0, true),
(2, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85', 'Rose Gold Clover Necklace - Pendant Detail', 1, false),

(3, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'Gold-Filled Clover Earrings - Main View', 0, true),
(3, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85', 'Gold-Filled Clover Earrings - Side View', 1, false),

(4, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 'Silver Clover Charm Bracelet - Main View', 0, true),
(4, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85', 'Silver Clover Charm Bracelet - Detail View', 1, false);

-- Insert additional products for a fuller catalog
INSERT INTO products (name, description, short_description, sku, price, category_id, material, weight_grams, dimensions, care_instructions, is_active, is_featured) VALUES
('Emerald Four-Leaf Clover Pendant', 'Stunning emerald pendant featuring a detailed four-leaf clover design. Perfect for special occasions and everyday elegance.', 'Emerald pendant with four-leaf clover design', 'PEND-001', 199.99, 5, 'Sterling Silver with Emerald', 4.2, '15mm x 15mm', 'Clean with soft cloth. Avoid harsh chemicals.', true, true),

('White Gold Clover Ring Set', 'Elegant set of three white gold rings with interconnected four-leaf clover motifs. Can be worn together or separately.', 'White gold clover ring set of three', 'RING-002', 349.99, 1, 'White Gold', 8.5, 'Sizes 6-8', 'Professional cleaning recommended annually.', true, false),

('Diamond Clover Stud Earrings', 'Delicate diamond-studded four-leaf clover earrings. Each clover features genuine diamonds for maximum sparkle.', 'Diamond four-leaf clover stud earrings', 'EAR-002', 289.99, 3, 'White Gold with Diamonds', 2.8, '8mm x 8mm', 'Store in jewelry box. Clean with diamond cleaner.', true, true),

('Vintage Brass Clover Locket', 'Antique-style brass locket with intricate four-leaf clover engraving. Opens to hold two small photos.', 'Vintage brass locket with clover engraving', 'NECK-002', 79.99, 2, 'Antique Brass', 12.3, '25mm diameter', 'Apply light oil occasionally to prevent tarnishing.', true, false),

('Rose Gold Clover Tennis Bracelet', 'Luxurious tennis bracelet featuring multiple four-leaf clover charms in rose gold. Perfect for formal occasions.', 'Rose gold tennis bracelet with multiple clovers', 'BRAC-002', 429.99, 4, 'Rose Gold', 15.6, '7.5 inch length', 'Professional cleaning recommended. Avoid water exposure.', true, true),

('Sterling Silver Clover Anklet', 'Delicate anklet with small four-leaf clover charms. Adjustable chain for perfect fit.', 'Sterling silver anklet with clover charms', 'BRAC-003', 69.99, 4, 'Sterling Silver', 3.2, '9-11 inch adjustable', 'Clean with silver polish. Store in anti-tarnish pouch.', true, false);

-- Insert inventory for new products
INSERT INTO inventory (product_id, quantity_available, quantity_reserved, reorder_level) VALUES
(5, 12, 0, 3),
(6, 8, 1, 2),
(7, 15, 0, 4),
(8, 20, 0, 5),
(9, 6, 0, 2),
(10, 25, 0, 8);

-- Insert product images for new products
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
-- Emerald Pendant
(5, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 'Emerald Four-Leaf Clover Pendant - Main View', 0, true),
(5, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&crop=entropy', 'Emerald Four-Leaf Clover Pendant - Close-up', 1, false),

-- White Gold Ring Set
(6, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&sat=-20', 'White Gold Clover Ring Set - All Three Rings', 0, true),
(6, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&sat=-20&crop=entropy', 'White Gold Clover Ring Set - Individual Ring Detail', 1, false),

-- Diamond Stud Earrings
(7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&contrast=20', 'Diamond Clover Stud Earrings - Pair View', 0, true),
(7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&contrast=20&crop=entropy', 'Diamond Clover Stud Earrings - Single Earring Detail', 1, false),

-- Vintage Brass Locket
(8, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&sepia=80', 'Vintage Brass Clover Locket - Closed View', 0, true),
(8, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&sepia=80&crop=entropy', 'Vintage Brass Clover Locket - Open View', 1, false),

-- Rose Gold Tennis Bracelet
(9, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&hue=30', 'Rose Gold Clover Tennis Bracelet - Full Length', 0, true),
(9, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&hue=30&crop=entropy', 'Rose Gold Clover Tennis Bracelet - Charm Detail', 1, false),

-- Sterling Silver Anklet
(10, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&sat=-30', 'Sterling Silver Clover Anklet - Full View', 0, true),
(10, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&sat=-30&crop=entropy', 'Sterling Silver Clover Anklet - Charm Close-up', 1, false);

-- Create a default admin user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@fourleafclover.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHBEnoYYqVs5H8u', 'Admin', 'User', '+1-555-0123', 'admin');
-- Password is: admin123456

-- Create sample customer users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('sarah.johnson@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHBEnoYYqVs5H8u', 'Sarah', 'Johnson', '+1-555-0124', 'customer'),
('mike.chen@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHBEnoYYqVs5H8u', 'Mike', 'Chen', '+1-555-0125', 'customer'),
('emma.wilson@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHBEnoYYqVs5H8u', 'Emma', 'Wilson', '+1-555-0126', 'customer');
-- All passwords are: password123

-- Insert sample addresses
INSERT INTO addresses (user_id, type, street_address, city, state_province, postal_code, country, is_default) VALUES
(2, 'shipping', '123 Main Street', 'New York', 'NY', '10001', 'United States', true),
(2, 'billing', '123 Main Street', 'New York', 'NY', '10001', 'United States', true),
(3, 'shipping', '456 Oak Avenue', 'Los Angeles', 'CA', '90210', 'United States', true),
(3, 'billing', '456 Oak Avenue', 'Los Angeles', 'CA', '90210', 'United States', true),
(4, 'shipping', '789 Pine Road', 'Chicago', 'IL', '60601', 'United States', true),
(4, 'billing', '789 Pine Road', 'Chicago', 'IL', '60601', 'United States', true);

-- Insert sample orders
INSERT INTO orders (user_id, order_number, status, subtotal, tax_amount, shipping_amount, total_amount, shipping_address_id, billing_address_id, payment_method, payment_status, notes) VALUES
(2, 'CLV-2024-001', 'delivered', 219.98, 17.60, 9.99, 247.57, 1, 2, 'credit_card', 'paid', 'Gift wrapping requested'),
(3, 'CLV-2024-002', 'shipped', 89.99, 7.20, 0.00, 97.19, 3, 4, 'paypal', 'paid', NULL),
(4, 'CLV-2024-003', 'pending', 159.98, 12.80, 9.99, 182.77, 5, 6, 'credit_card', 'pending', 'Rush delivery requested');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1 items
(1, 1, 1, 89.99, 89.99),
(1, 2, 1, 129.99, 129.99),

-- Order 2 items
(2, 1, 1, 89.99, 89.99),

-- Order 3 items  
(3, 3, 1, 79.99, 79.99),
(4, 4, 1, 79.99, 79.99);

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
(1, 2, 5, 'Absolutely Beautiful!', 'This ring is even more stunning in person. The craftsmanship is exceptional and it fits perfectly. I receive compliments every time I wear it!', true, true),
(1, 3, 4, 'Great Quality', 'Very well made ring. The four-leaf clover design is delicate and elegant. Only giving 4 stars because delivery took a bit longer than expected.', true, true),
(2, 4, 5, 'Perfect Gift', 'Bought this necklace for my girlfriend and she absolutely loves it. The rose gold is beautiful and the pendant is the perfect size.', true, true),
(2, 2, 5, 'Exactly as Described', 'The necklace is gorgeous and exactly what I was looking for. Great quality and fast shipping!', true, true),
(3, 3, 4, 'Pretty Earrings', 'These earrings are very pretty and well-made. They are a bit smaller than I expected but still lovely.', true, true);

-- Insert sample wishlist items
INSERT INTO wishlist_items (user_id, product_id) VALUES
(2, 5),  -- Sarah likes the Emerald Pendant
(2, 7),  -- Sarah likes the Diamond Earrings
(3, 6),  -- Mike likes the Ring Set
(3, 9),  -- Mike likes the Tennis Bracelet
(4, 8),  -- Emma likes the Vintage Locket
(4, 10); -- Emma likes the Anklet

-- Insert sample coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_order_amount, max_usage_count, current_usage_count, start_date, end_date, is_active) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off your first order', 'percentage', 10.00, 50.00, 100, 3, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', true),
('LUCKY20', 'Lucky Clover Special', 'Get $20 off orders over $100', 'fixed', 20.00, 100.00, 50, 1, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', true),
('FREESHIP', 'Free Shipping', 'Free shipping on orders over $75', 'fixed', 9.99, 75.00, 200, 15, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', true);

-- Update category images
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop' WHERE slug = 'rings';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop' WHERE slug = 'necklaces';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' WHERE slug = 'earrings';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' WHERE slug = 'bracelets';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' WHERE slug = 'pendants';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&sepia=20' WHERE slug = 'sets'; 