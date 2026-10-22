-- Driptide Fashion E-Commerce Schema
-- Initial Migration: Schema, Constraints, Functions, and RLS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status_type AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_status_type AS ENUM ('unfulfilled', 'processing', 'shipped', 'delivered', 'returned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_movement_type AS ENUM ('restock', 'order_reservation', 'order_cancellation', 'manual_adjustment', 'damage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. HELPER FUNCTIONS: updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES & USER ROLES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role_type NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_column();

-- 4. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street1 TEXT NOT NULL,
    street2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    is_default_shipping BOOLEAN NOT NULL DEFAULT false,
    is_default_billing BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 6. COLLECTIONS
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    banner_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT NOT NULL,
    details JSONB DEFAULT '[]'::jsonb,
    fabric_care JSONB DEFAULT '[]'::jsonb,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status product_status_type NOT NULL DEFAULT 'published',
    featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    base_price_minor INT NOT NULL CHECK (base_price_minor >= 0),
    compare_at_price_minor INT CHECK (compare_at_price_minor IS NULL OR compare_at_price_minor >= base_price_minor),
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival);

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at_column();

-- 8. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- 9. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL, -- e.g. "Vintage Wash / L"
    size TEXT,
    color TEXT,
    color_hex TEXT,
    price_minor INT NOT NULL CHECK (price_minor >= 0),
    compare_at_price_minor INT CHECK (compare_at_price_minor IS NULL OR compare_at_price_minor >= price_minor),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    barcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

CREATE TRIGGER update_product_variants_modtime
BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION set_updated_at_column();

-- 10. COLLECTION PRODUCTS
CREATE TABLE IF NOT EXISTS collection_products (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

-- 11. INVENTORY MOVEMENTS (AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    type inventory_movement_type NOT NULL,
    quantity_delta INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason TEXT,
    order_id UUID,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_variant ON inventory_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_order ON inventory_movements(order_id);

-- 12. CARTS & CART ITEMS
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT UNIQUE,
    coupon_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cart_variant UNIQUE (cart_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- 13. WISHLISTS
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

-- 14. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INT NOT NULL CHECK (discount_value > 0),
    min_spend_minor INT DEFAULT 0,
    max_discount_minor INT,
    usage_limit INT,
    usage_count INT NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    guest_email TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    status order_status_type NOT NULL DEFAULT 'pending',
    payment_status payment_status_type NOT NULL DEFAULT 'pending',
    fulfillment_status fulfillment_status_type NOT NULL DEFAULT 'unfulfilled',
    currency TEXT NOT NULL DEFAULT 'USD',
    subtotal_minor INT NOT NULL CHECK (subtotal_minor >= 0),
    shipping_minor INT NOT NULL DEFAULT 0 CHECK (shipping_minor >= 0),
    tax_minor INT NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
    discount_minor INT NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
    total_minor INT NOT NULL CHECK (total_minor >= 0),
    coupon_code TEXT,
    payment_method TEXT NOT NULL DEFAULT 'credit_card',
    tracking_number TEXT,
    courier TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at_column();

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    variant_title TEXT NOT NULL,
    sku TEXT NOT NULL,
    unit_price_minor INT NOT NULL CHECK (unit_price_minor >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_minor INT NOT NULL CHECK (total_price_minor >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 16. PAYMENTS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'mock', 'stripe', 'cod'
    provider_payment_id TEXT,
    idempotency_key TEXT UNIQUE,
    amount_minor INT NOT NULL CHECK (amount_minor >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    status payment_status_type NOT NULL DEFAULT 'pending',
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- 17. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. ATOMIC INVENTORY DEDUCTION (PREVENTS OVERSELLING)
CREATE OR REPLACE FUNCTION reserve_and_deduct_inventory(
    p_order_id UUID,
    p_items JSONB -- Array of { "variant_id": "...", "sku": "...", "quantity": 1 }
)
RETURNS BOOLEAN AS $$
DECLARE
    item JSONB;
    v_variant_id UUID;
    v_qty INT;
    v_current_stock INT;
    v_sku TEXT;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_variant_id := (item->>'variant_id')::UUID;
        v_qty := (item->>'quantity')::INT;
        v_sku := (item->>'sku')::TEXT;

        -- Lock the row for update to prevent concurrent race condition overselling
        SELECT stock_quantity INTO v_current_stock
        FROM product_variants
        WHERE id = v_variant_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Variant % not found', v_variant_id;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for SKU %: requested %, available %', v_sku, v_qty, v_current_stock;
        END IF;

        -- Deduct inventory
        UPDATE product_variants
        SET stock_quantity = stock_quantity - v_qty
        WHERE id = v_variant_id;

        -- Log movement audit
        INSERT INTO inventory_movements (
            variant_id, sku, type, quantity_delta, previous_quantity, new_quantity, reason, order_id
        ) VALUES (
            v_variant_id, v_sku, 'order_reservation', -v_qty, v_current_stock, (v_current_stock - v_qty), 'Order placed', p_order_id
        );
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 19. ATOMIC INVENTORY RESTORATION ON CANCELLATION
CREATE OR REPLACE FUNCTION release_inventory_on_cancellation(
    p_order_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    r RECORD;
    v_current_stock INT;
BEGIN
    FOR r IN SELECT variant_id, sku, quantity FROM order_items WHERE order_id = p_order_id
    LOOP
        SELECT stock_quantity INTO v_current_stock
        FROM product_variants
        WHERE id = r.variant_id
        FOR UPDATE;

        IF FOUND THEN
            UPDATE product_variants
            SET stock_quantity = stock_quantity + r.quantity
            WHERE id = r.variant_id;

            INSERT INTO inventory_movements (
                variant_id, sku, type, quantity_delta, previous_quantity, new_quantity, reason, order_id
            ) VALUES (
                r.variant_id, r.sku, 'order_cancellation', r.quantity, v_current_stock, (v_current_stock + r.quantity), 'Order cancelled', p_order_id
            );
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 20. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Products / Categories / Images are publicly viewable
CREATE POLICY "Public products viewable" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Public variants viewable" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public images viewable" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public categories viewable" ON categories FOR SELECT USING (is_active = true);

-- Profiles: users read and update own profile
CREATE POLICY "User can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users view and edit own addresses
CREATE POLICY "User addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Carts: user or guest session access
CREATE POLICY "User carts" ON carts FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "User cart items" ON cart_items FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE auth.uid() = user_id OR user_id IS NULL)
);

-- Wishlists: user access
CREATE POLICY "User wishlists" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Orders: user can view own orders
CREATE POLICY "User view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User view own order items" ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE auth.uid() = user_id)
);
