-- Driptide Initial Streetwear Seed Data

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Outerwear', 'outerwear', 'Architectural coats, technical bombers, and heavyweight jackets.', 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200', 1),
('c1000000-0000-0000-0000-000000000002', 'Hoodies & Sweats', 'hoodies-sweats', 'Oversized silhouettes, drop shoulders, and 480GSM French terry fleece.', 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200', 2),
('c1000000-0000-0000-0000-000000000003', 'T-Shirts & Tops', 't-shirts-tops', 'Vintage washed heavyweight cottons, mock necks, and boxy cuts.', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 3),
('c1000000-0000-0000-0000-000000000004', 'Trousers & Denim', 'trousers-denim', 'Pleated wide-leg trousers, double-knee workwear, and Japanese raw denim.', 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200', 4),
('c1000000-0000-0000-0000-000000000005', 'Accessories', 'accessories', 'Modular leather bags, sterling silver hardware, and ribbed beanies.', 'https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=1200', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000008', 'Polos', 'polos', 'Refined piqué polos and relaxed short sleeve staples.', 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=1200', 6),
('c1000000-0000-0000-0000-000000000009', 'Shirts & Shackets', 'shirts', 'Easy overshirts and considered everyday button-downs.', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 7),
('c1000000-0000-0000-0000-000000000010', 'Shorts', 'shorts', 'Relaxed summer shorts with clean utility details.', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 8),
('c1000000-0000-0000-0000-000000000011', 'Activewear', 'activewear', 'Lightweight performance layers for everyday movement.', 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=1200', 9),
('c1000000-0000-0000-0000-000000000012', 'Sweaters', 'sweaters', 'Soft knit layers in versatile seasonal colors.', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 10),
('c1000000-0000-0000-0000-000000000013', 'Footwear', 'footwear', 'Everyday sneakers and versatile casual footwear.', 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=1200', 11),
('c1000000-0000-0000-0000-000000000014', 'Fragrances', 'fragrances', 'Personal scents for day and after dark.', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 12),
('c1000000-0000-0000-0000-000000000015', 'Sale', 'sale', 'Selected styles from previous seasonal edits.', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 13)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_spend_minor, max_discount_minor, usage_limit, usage_count, is_active) VALUES
('b1000000-0000-0000-0000-000000000001', 'DRIP15', 'percentage', 15, 5000, 5000, 1000, 42, true),
('b1000000-0000-0000-0000-000000000002', 'WELCOME20', 'fixed', 2000, 10000, 2000, 500, 18, true),
('b1000000-0000-0000-0000-000000000003', 'ARCHIVE30', 'percentage', 30, 15000, 10000, 200, 110, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Products
-- Product 1: The Obsidian Trench Coat
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000001', 'Obsidian Overcoat', 'obsidian-overcoat', 'Double-breasted tailored wool overcoat', 
'A masterclass in modern tailoring. The Obsidian Overcoat is cut from substantial 650GSM double-faced Italian virgin wool with structured shoulders, peak lapels, and custom matte horn buttons. Designed to drape effortlessly over tailored suits or layered casual streetwear.',
'["Double-faced 100% Italian virgin wool (650GSM)", "Full Cupro lining with interior welt pocket", "Structured raglan shoulders with horn button closure", "Deep storm vent and inverted back pleat", "Made in Portugal"]'::jsonb,
'["Dry clean only with mild solvent", "Steam on low heat", "Store on wide wooden hanger"]'::jsonb,
'c1000000-0000-0000-0000-000000000001', 'published', true, true, 34000, 39500)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000001', 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200', 'Obsidian Overcoat Editorial Front', 1, true),
('d1000000-0000-0000-0000-000000000001', 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200', 'Obsidian Overcoat Model Fit', 2, false),
('d1000000-0000-0000-0000-000000000001', 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200', 'Obsidian Overcoat Fabric Detail', 3, false);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000001', 'OOC-BLK-S', 'Washed Obsidian / S', 'S', 'Obsidian Black', '#0D0D0D', 34000, 39500, 15),
('d1000000-0000-0000-0000-000000000001', 'OOC-BLK-M', 'Washed Obsidian / M', 'M', 'Obsidian Black', '#0D0D0D', 34000, 39500, 24),
('d1000000-0000-0000-0000-000000000001', 'OOC-BLK-L', 'Washed Obsidian / L', 'L', 'Obsidian Black', '#0D0D0D', 34000, 39500, 18),
('d1000000-0000-0000-0000-000000000001', 'OOC-BLK-XL', 'Washed Obsidian / XL', 'XL', 'Obsidian Black', '#0D0D0D', 34000, 39500, 9);

-- Product 2: Boxy Heavyweight Hoodie
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000002', 'Heavyweight Raw Hoodie', 'heavyweight-raw-hoodie', '500GSM custom knit loopback terry',
'Engineered with an exaggerated dropped shoulder, cropped waist ribbing, and double-layered hood without drawstrings for a pure architectural silhouette. Garment-dyed and stone-washed for lived-in softness with heavyweight drape.',
'["500GSM 100% organic cotton loopback French terry", "Double-layered hood with seamless neckline", "Hidden kangaroo pocket with reinforced bar-tacks", "Pre-shrunk custom vintage dye process", "Ethically knit in Los Angeles"]'::jsonb,
'["Machine wash cold inside out with like colors", "Lay flat to dry", "Do not bleach or dry clean"]'::jsonb,
'c1000000-0000-0000-0000-000000000002', 'published', true, true, 16500, 19000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000002', 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200', 'Heavyweight Raw Hoodie Front', 1, true),
('d1000000-0000-0000-0000-000000000002', 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200', 'Heavyweight Raw Hoodie Fit', 2, false);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000002', 'HRH-CHR-S', 'Slate Charcoal / S', 'S', 'Slate Charcoal', '#282828', 16500, 19000, 30),
('d1000000-0000-0000-0000-000000000002', 'HRH-CHR-M', 'Slate Charcoal / M', 'M', 'Slate Charcoal', '#282828', 16500, 19000, 45),
('d1000000-0000-0000-0000-000000000002', 'HRH-CHR-L', 'Slate Charcoal / L', 'L', 'Slate Charcoal', '#282828', 16500, 19000, 35),
('d1000000-0000-0000-0000-000000000002', 'HRH-CHR-XL', 'Slate Charcoal / XL', 'XL', 'Slate Charcoal', '#282828', 16500, 19000, 12);

-- Product 3: Wide-Leg Pleated Trouser
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000003', 'Architect Wide-Leg Trouser', 'architect-wide-leg-trouser', 'Relaxed double-pleated sartorial trouser',
'Blending tailoring with streetwear ease. The Architect Trouser features deep double forward pleats, a wide 22-inch leg opening, side cinch tabs, and heavy tropical wool blend that resists wrinkling.',
'["60% Wool, 38% Polyester, 2% Elastane twill weave", "Double inward front pleats", "Side-adjuster buckled waistband (no belt required)", "YKK zipper fly with horn tab closure", "Unfinished hem for bespoke tailoring"]'::jsonb,
'["Dry clean recommended", "Gentle iron under press cloth", "Hang on trouser clamp"]'::jsonb,
'c1000000-0000-0000-0000-000000000004', 'published', true, false, 19500, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000003', 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200', 'Architect Wide Trouser Editorial', 1, true),
('d1000000-0000-0000-0000-000000000003', 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200', 'Architect Wide Trouser Detail', 2, false);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000003', 'AWT-OLV-30', 'Dust Olive / 30', '30', 'Dust Olive', '#4B4D3C', 19500, NULL, 14),
('d1000000-0000-0000-0000-000000000003', 'AWT-OLV-32', 'Dust Olive / 32', '32', 'Dust Olive', '#4B4D3C', 19500, NULL, 28),
('d1000000-0000-0000-0000-000000000003', 'AWT-OLV-34', 'Dust Olive / 34', '34', 'Dust Olive', '#4B4D3C', 19500, NULL, 20);

-- Product 4: Minimalist Mock Neck Tee
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000004', 'Studio Mock Neck Tee', 'studio-mock-neck-tee', '300GSM combed jersey with 1.25" collar',
'The foundation of the Driptide everyday uniform. Cut from heavy 300GSM combed organic cotton with a structured mock neckline that retains its shape over years of wash and wear. Boxy torso with relaxed mid-bicep sleeves.',
'["300GSM 100% combed ringspun cotton", "Reinforced 1.25-inch ribbed mock collar", "Blind-stitched sleeves and bottom hem", "Sanforized to minimize shrinkage", "Seamless sides for fluid drape"]'::jsonb,
'["Machine wash cold with gentle spin", "Tumble dry low or air dry in shade", "Warm iron if needed"]'::jsonb,
'c1000000-0000-0000-0000-000000000003', 'published', false, true, 8500, 10000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000004', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Studio Mock Neck Tee Front', 1, true),
('d1000000-0000-0000-0000-000000000004', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Studio Mock Neck Tee Lifestyle', 2, false);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000004', 'SMT-ECR-S', 'Raw Ecru / S', 'S', 'Raw Ecru', '#F0EBE1', 8500, 10000, 20),
('d1000000-0000-0000-0000-000000000004', 'SMT-ECR-M', 'Raw Ecru / M', 'M', 'Raw Ecru', '#F0EBE1', 8500, 10000, 35),
('d1000000-0000-0000-0000-000000000004', 'SMT-ECR-L', 'Raw Ecru / L', 'L', 'Raw Ecru', '#F0EBE1', 8500, 10000, 30),
('d1000000-0000-0000-0000-000000000004', 'SMT-ECR-XL', 'Raw Ecru / XL', 'XL', 'Raw Ecru', '#F0EBE1', 8500, 10000, 15);

-- Product 5: Modular Crossbody Sling
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000005', 'Tactile Leather Crossbody', 'tactile-leather-crossbody', 'Full-grain Italian calfskin with Fidlock magnetic buckle',
'Designed for urban transit and essential daily carry. Crafted from matte full-grain calfskin leather with waterproof taped zippers, German-engineered Fidlock magnetic quick-release buckle, and modular exterior webbing loops.',
'["Full-grain matte Italian calfskin leather", "Fidlock V-Buckle magnetic hardware (Germany)", "Water-resistant YKK Aquaguard zippers", "Interior padded compartment for 11-inch tablet", "Adjustable seatbelt-weave nylon strap"]'::jsonb,
'["Wipe clean with damp microfiber cloth", "Condition with leather balm semi-annually", "Store in provided canvas dust bag"]'::jsonb,
'c1000000-0000-0000-0000-000000000005', 'published', true, false, 24000, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000005', 'https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=1200', 'Tactile Crossbody Hero', 1, true),
('d1000000-0000-0000-0000-000000000005', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 'Tactile Crossbody Hardware', 2, false);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000005', 'TLC-BLK-ONE', 'Matte Obsidian / One Size', 'One Size', 'Matte Obsidian', '#111111', 24000, NULL, 40);

-- Product 6: Heavy Ribbed Beanie
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor, compare_at_price_minor) VALUES
('d1000000-0000-0000-0000-000000000006', 'Ribbed Merino Beanie', 'ribbed-merino-beanie', '100% extrafine 7-gauge merino wool',
'Chunky 7-gauge fisherman knit beanie crafted from extrafine Australian merino wool. Features a deep fold-over cuff and sculpted crown that holds its structured shape without slouching.',
'["100% Extrafine Australian merino wool", "7-gauge chunky fisherman rib knit", "Adjustable double-turned cuff", "Naturally thermoregulating and odor-resistant", "Knit in Scotland"]'::jsonb,
'["Hand wash cold with wool detergent", "Do not wring; press out water in towel", "Dry flat"]'::jsonb,
'c1000000-0000-0000-0000-000000000005', 'published', false, true, 6500, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
('d1000000-0000-0000-0000-000000000006', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 'Ribbed Merino Beanie', 1, true);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, compare_at_price_minor, stock_quantity) VALUES
('d1000000-0000-0000-0000-000000000006', 'RMB-SND-ONE', 'Desert Sand / One Size', 'One Size', 'Desert Sand', '#D9CDBB', 6500, NULL, 50);

-- 4. Outfitters-inspired seasonal assortment for the expanded storefront
INSERT INTO products (id, name, slug, tagline, description, details, fabric_care, category_id, status, featured, is_new_arrival, base_price_minor) VALUES
('d1000000-0000-0000-0000-000000000007', 'Everyday Pique Polo', 'everyday-pique-polo', 'A clean piqué polo for everyday wear', 'A clean piqué polo with a relaxed fit and ribbed collar.', '["Cotton piqué", "Ribbed collar", "Relaxed fit"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000008', 'published', true, true, 12900),
('d1000000-0000-0000-0000-000000000008', 'Textured Resort Shirt', 'textured-resort-shirt', 'Easy summer shirting', 'A breathable short sleeve shirt made for warm days and easy layering.', '["Breathable woven fabric", "Short sleeves", "Relaxed fit"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000009', 'published', true, true, 18900),
('d1000000-0000-0000-0000-000000000009', 'Relaxed Utility Short', 'relaxed-utility-short', 'Lightweight cotton utility short', 'A lightweight cotton short with a drawcord waist and roomy pockets.', '["Cotton fabric", "Drawcord waist", "Utility pockets"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000010', 'published', true, true, 14900),
('d1000000-0000-0000-0000-000000000010', 'Active Track Jacket', 'active-track-jacket', 'Light zip-through layer', 'A light zip-through layer with clean piping and an easy athletic shape.', '["Lightweight shell", "Zip front", "Side pockets"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000011', 'published', true, true, 22900),
('d1000000-0000-0000-0000-000000000011', 'Soft Rib Knit Sweater', 'soft-rib-knit-sweater', 'Soft seasonal knitwear', 'A soft-touch knit with a relaxed shoulder and neat rib finish.', '["Soft-touch yarn", "Rib finish", "Relaxed shoulder"]'::jsonb, '["Gentle wash"]'::jsonb, 'c1000000-0000-0000-0000-000000000012', 'published', true, true, 21900),
('d1000000-0000-0000-0000-000000000012', 'Court Low Sneaker', 'court-low-sneaker', 'Minimal low-top sneaker', 'A minimal low-top sneaker with tonal panels and a cushioned sole.', '["Tonal panels", "Cushioned footbed", "Rubber sole"]'::jsonb, '["Wipe clean"]'::jsonb, 'c1000000-0000-0000-0000-000000000013', 'published', true, false, 27900),
('d1000000-0000-0000-0000-000000000013', 'No. 04 Eau de Parfum', 'no-04-eau-de-parfum', 'A warm everyday fragrance', 'A warm, understated fragrance with woody notes for everyday wear.', '["Woody notes", "50ml bottle"]'::jsonb, '[]'::jsonb, 'c1000000-0000-0000-0000-000000000014', 'published', false, true, 19900),
('d1000000-0000-0000-0000-000000000014', 'Washed Graphic Tee', 'washed-graphic-tee', 'Soft washed cotton tee', 'A soft washed cotton tee with a relaxed cut and understated chest graphic.', '["Cotton jersey", "Garment washed", "Relaxed cut"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000015', 'published', true, false, 9900),
('d1000000-0000-0000-0000-000000000015', 'Heavyweight Boxy Tee', 'heavyweight-boxy-tee', 'Structured heavyweight jersey', 'A substantial cotton jersey tee with a structured neckline and boxy shape.', '["Heavyweight cotton", "Boxy shape", "Reinforced neckline"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000003', 'published', true, true, 15900),
('d1000000-0000-0000-0000-000000000016', 'Zip Through Hoodie', 'zip-through-hoodie', 'Brushed fleece zip hoodie', 'A versatile zip hoodie in brushed fleece with a double-layer hood.', '["Brushed fleece", "Double-layer hood", "Zip front"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000002', 'published', true, true, 23900),
('d1000000-0000-0000-0000-000000000017', 'Relaxed Denim Jean', 'relaxed-denim-jean', 'Washed straight-leg denim', 'A relaxed straight-leg denim jean with a washed finish and classic five pockets.', '["Cotton denim", "Five pocket design", "Relaxed straight leg"]'::jsonb, '["Wash inside out"]'::jsonb, 'c1000000-0000-0000-0000-000000000004', 'published', true, true, 25900),
('d1000000-0000-0000-0000-000000000018', 'Canvas Field Jacket', 'canvas-field-jacket', 'A sturdy cotton field jacket', 'A sturdy cotton field jacket with roomy patch pockets and an easy layered fit.', '["Cotton canvas", "Patch pockets", "Layering fit"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000001', 'published', true, false, 32900),
('d1000000-0000-0000-0000-000000000019', 'Everyday Overshirt', 'everyday-overshirt', 'Easy layered cotton overshirt', 'A substantial cotton overshirt designed to wear open over tees or buttoned up.', '["Cotton fabric", "Button front", "Chest pocket"]'::jsonb, '["Machine wash cold"]'::jsonb, 'c1000000-0000-0000-0000-000000000009', 'published', false, true, 24900),
('d1000000-0000-0000-0000-000000000020', 'Leather Crossbody Bag', 'leather-crossbody-bag', 'Compact everyday carry', 'A compact crossbody bag with adjustable webbing and useful zipped storage.', '["Adjustable strap", "Zipped storage", "Everyday size"]'::jsonb, '["Wipe clean"]'::jsonb, 'c1000000-0000-0000-0000-000000000005', 'published', false, false, 18900)
ON CONFLICT (id) DO NOTHING;

UPDATE products SET compare_at_price_minor = 12900
WHERE id = 'd1000000-0000-0000-0000-000000000014';

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT v.product_id::uuid, v.url, v.alt_text, 1, true FROM (VALUES
('d1000000-0000-0000-0000-000000000007', 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=1200', 'Everyday Pique Polo'),
('d1000000-0000-0000-0000-000000000008', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 'Textured Resort Shirt'),
('d1000000-0000-0000-0000-000000000009', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Relaxed Utility Short'),
('d1000000-0000-0000-0000-000000000010', 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=1200', 'Active Track Jacket'),
('d1000000-0000-0000-0000-000000000011', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Soft Rib Knit Sweater'),
('d1000000-0000-0000-0000-000000000012', 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=1200', 'Court Low Sneaker'),
('d1000000-0000-0000-0000-000000000013', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 'No. 04 Eau de Parfum'),
('d1000000-0000-0000-0000-000000000014', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Washed Graphic Tee'),
('d1000000-0000-0000-0000-000000000015', 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200', 'Heavyweight Boxy Tee'),
('d1000000-0000-0000-0000-000000000016', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 'Zip Through Hoodie'),
('d1000000-0000-0000-0000-000000000017', 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200', 'Relaxed Denim Jean'),
('d1000000-0000-0000-0000-000000000018', 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=1200', 'Canvas Field Jacket'),
('d1000000-0000-0000-0000-000000000019', 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=1200', 'Everyday Overshirt'),
('d1000000-0000-0000-0000-000000000020', 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200', 'Leather Crossbody Bag')
) AS v(product_id, url, alt_text)
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = v.product_id::uuid AND pi.url = v.url);

INSERT INTO product_variants (product_id, sku, title, size, color, color_hex, price_minor, stock_quantity)
SELECT v.product_id::uuid, v.sku, v.title, v.size, v.color, v.color_hex, v.price_minor, 20 FROM (VALUES
('d1000000-0000-0000-0000-000000000007', 'EVPOLO-M', 'Cloud White / M', 'M', 'Cloud White', '#F2F0EB', 12900),
('d1000000-0000-0000-0000-000000000008', 'TXRSHIRT-M', 'Ink Print / M', 'M', 'Ink Print', '#282828', 18900),
('d1000000-0000-0000-0000-000000000009', 'RLXSHORT-M', 'Stone Blue / M', 'M', 'Stone Blue', '#9ABFD8', 14900),
('d1000000-0000-0000-0000-000000000010', 'ACTJACKET-M', 'Black / M', 'M', 'Black', '#111111', 22900),
('d1000000-0000-0000-0000-000000000011', 'RIBKNIT-M', 'Oatmeal / M', 'M', 'Oatmeal', '#D9CDBB', 21900),
('d1000000-0000-0000-0000-000000000012', 'COURTSNEAK-42', 'Chalk / 42', '42', 'Chalk', '#EFEDE6', 27900),
('d1000000-0000-0000-0000-000000000013', 'NO04PARFUM-OS', 'Amber / One Size', 'One Size', 'Amber', '#98724A', 19900),
('d1000000-0000-0000-0000-000000000014', 'WASHGRAPH-M', 'Washed Olive / M', 'M', 'Washed Olive', '#4B4D3C', 9900),
('d1000000-0000-0000-0000-000000000015', 'HEAVYBOX-M', 'Obsidian / M', 'M', 'Obsidian', '#111111', 15900),
('d1000000-0000-0000-0000-000000000016', 'ZIPHOODIE-M', 'Charcoal / M', 'M', 'Charcoal', '#373737', 23900),
('d1000000-0000-0000-0000-000000000017', 'RELXJEAN-32', 'Mid Blue / 32', '32', 'Mid Blue', '#54758C', 25900),
('d1000000-0000-0000-0000-000000000018', 'CANVASJKT-M', 'Sage / M', 'M', 'Sage', '#828775', 32900),
('d1000000-0000-0000-0000-000000000019', 'OVERSHIRT-M', 'Stone / M', 'M', 'Stone', '#B9B2A6', 24900),
('d1000000-0000-0000-0000-000000000020', 'XBODYBAG-OS', 'Black / One Size', 'One Size', 'Black', '#111111', 18900)
) AS v(product_id, sku, title, size, color, color_hex, price_minor)
ON CONFLICT (sku) DO NOTHING;

UPDATE product_variants SET compare_at_price_minor = 12900
WHERE sku = 'WASHGRAPH-M';

-- Keep previously seeded catalog rows on the reference site's image CDN too.
UPDATE categories SET image_url = CASE slug
  WHEN 'outerwear' THEN 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=700'
  WHEN 'hoodies-sweats' THEN 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=700'
  WHEN 't-shirts-tops' THEN 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=700'
  WHEN 'trousers-denim' THEN 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=700'
  WHEN 'accessories' THEN 'https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=700'
  WHEN 'polos' THEN 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=700'
  WHEN 'shirts' THEN 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=700'
  WHEN 'shorts' THEN 'https://outfitters.com.pk/cdn/shop/files/F0183110903LOWER3.jpg?v=1791445191&width=700'
  WHEN 'activewear' THEN 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=700'
  WHEN 'sweaters' THEN 'https://outfitters.com.pk/cdn/shop/files/F0183102901_2.jpg?v=1790570831&width=700'
  WHEN 'footwear' THEN 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=700'
  WHEN 'fragrances' THEN 'https://outfitters.com.pk/cdn/shop/files/F0102124998_3_copy.jpg?v=1755843658&width=700'
  WHEN 'sale' THEN 'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=700'
  ELSE image_url END
WHERE slug IN ('outerwear', 'hoodies-sweats', 't-shirts-tops', 'trousers-denim', 'accessories', 'polos', 'shirts', 'shorts', 'activewear', 'sweaters', 'footwear', 'fragrances', 'sale');

UPDATE product_images SET url = CASE product_id::text
  WHEN 'd1000000-0000-0000-0000-000000000001' THEN 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=1200'
  WHEN 'd1000000-0000-0000-0000-000000000002' THEN 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200'
  WHEN 'd1000000-0000-0000-0000-000000000003' THEN 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=1200'
  WHEN 'd1000000-0000-0000-0000-000000000004' THEN 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=1200'
  WHEN 'd1000000-0000-0000-0000-000000000005' THEN 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200'
  WHEN 'd1000000-0000-0000-0000-000000000006' THEN 'https://outfitters.com.pk/cdn/shop/files/F0153122998_8_copy2.jpg?v=1771309367&width=1200'
  ELSE url END
WHERE product_id IN (
  'd1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004',
  'd1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000006'
);

-- Sample Store Settings
INSERT INTO store_settings (key, value) VALUES
('general', '{"store_name": "Driptide", "support_email": "concierge@driptide.com", "currency": "USD", "free_shipping_threshold_minor": 15000}'::jsonb),
('shipping', '{"standard_rate_minor": 1500, "express_rate_minor": 3000, "carriers": ["DHL Express", "FedEx Priority"]}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
