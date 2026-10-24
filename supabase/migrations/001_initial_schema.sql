-- ==============================================================================
-- DRIPTIDE — SUPABASE INITIAL SCHEMA MIGRATION
-- Run this ONCE in the Supabase SQL Editor for your project.
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ==============================================================================

-- Enable UUID extension (if not already enabled)
create extension if not exists "pgcrypto";

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id            text primary key,
  name          text not null,
  slug          text unique not null,
  description   text,
  image_url     text,
  parent_id     text references public.categories(id) on delete set null,
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id                    text primary key,
  name                  text not null,
  slug                  text unique not null,
  tagline               text,
  description           text not null,
  details               jsonb not null default '[]',
  fabric_care           jsonb not null default '[]',
  category_id           text references public.categories(id) on delete set null,
  status                text not null default 'published' check (status in ('draft','published','archived')),
  featured              boolean not null default false,
  is_new_arrival        boolean not null default false,
  base_price_minor      int not null,
  compare_at_price_minor int,
  total_stock           int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── PRODUCT IMAGES ───────────────────────────────────────────────────────────
create table if not exists public.product_images (
  id          text primary key,
  product_id  text not null references public.products(id) on delete cascade,
  url         text not null,
  alt_text    text,
  sort_order  int not null default 1,
  is_primary  boolean not null default false
);

-- ─── PRODUCT VARIANTS ─────────────────────────────────────────────────────────
create table if not exists public.product_variants (
  id                      text primary key,
  product_id              text not null references public.products(id) on delete cascade,
  sku                     text unique not null,
  title                   text not null,
  size                    text,
  color                   text,
  color_hex               text,
  price_minor             int not null,
  compare_at_price_minor  int,
  stock_quantity          int not null default 0,
  barcode                 text
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  text primary key,
  order_number        text unique not null,
  user_id             uuid references auth.users(id) on delete set null,
  guest_email         text,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text,
  shipping_address    jsonb not null,
  billing_address     jsonb,
  status              text not null default 'processing'
                        check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  payment_status      text not null default 'pending'
                        check (payment_status in ('pending','authorized','captured','failed','refunded')),
  fulfillment_status  text not null default 'processing'
                        check (fulfillment_status in ('unfulfilled','processing','shipped','delivered','returned')),
  currency            text not null default 'USD',
  subtotal_minor      int not null,
  shipping_minor      int not null default 0,
  tax_minor           int not null default 0,
  discount_minor      int not null default 0,
  total_minor         int not null,
  coupon_code         text,
  payment_method      text,
  tracking_number     text,
  courier             text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id                  text primary key,
  order_id            text not null references public.orders(id) on delete cascade,
  product_id          text not null,
  variant_id          text not null,
  product_name        text not null,
  variant_title       text not null,
  sku                 text,
  unit_price_minor    int not null,
  quantity            int not null,
  total_price_minor   int not null,
  image_url           text
);

-- ─── COUPONS ──────────────────────────────────────────────────────────────────
create table if not exists public.coupons (
  id                  text primary key,
  code                text unique not null,
  discount_type       text not null check (discount_type in ('percentage','fixed')),
  discount_value      numeric not null,
  min_spend_minor     int,
  max_discount_minor  int,
  usage_limit         int,
  usage_count         int not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ─── INVENTORY MOVEMENTS ──────────────────────────────────────────────────────
create table if not exists public.inventory_movements (
  id                text primary key,
  variant_id        text not null,
  sku               text not null,
  type              text not null
                      check (type in ('restock','order_reservation','order_cancellation','manual_adjustment','damage')),
  quantity_delta    int not null,
  previous_quantity int not null,
  new_quantity      int not null,
  order_id          text references public.orders(id) on delete set null,
  reason            text,
  performed_by      text,
  created_at        timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Service role bypasses RLS; anon/customer role is read-restricted.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.inventory_movements enable row level security;

-- Public read on catalog
create policy "Public read categories" on public.categories for select using (is_active = true);
create policy "Public read products"   on public.products   for select using (status = 'published');
create policy "Public read images"     on public.product_images for select using (true);
create policy "Public read variants"   on public.product_variants for select using (true);

-- Customers can read their own orders
create policy "Customer read own orders" on public.orders for select
  using (auth.uid() = user_id);
create policy "Customer read own order items" on public.order_items for select
  using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

-- Service role (backend) has full access — service_role bypasses RLS automatically.

-- ─── USEFUL INDEXES ───────────────────────────────────────────────────────────
create index if not exists idx_orders_order_number   on public.orders (order_number);
create index if not exists idx_orders_customer_email on public.orders (customer_email);
create index if not exists idx_orders_user_id        on public.orders (user_id);
create index if not exists idx_order_items_order_id  on public.order_items (order_id);
create index if not exists idx_variants_product_id   on public.product_variants (product_id);
create index if not exists idx_coupons_code          on public.coupons (code);
