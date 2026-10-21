# Driptide E-Commerce Platform — Deployment & Setup Guide

## 1. Prerequisites
- **Node.js**: `v20` or higher (`v24.20.0` tested)
- **pnpm**: `v10+` or `v12+` (e.g. `npm install -g pnpm`)
- **Supabase Account**: (or local Docker Supabase CLI instance)

---

## 2. Local Development Setup

### 2.1 Install Dependencies
```bash
pnpm install
```

### 2.2 Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(When developing locally without live Supabase credentials, the backend automatically runs in Local Development Mode with rich pre-seeded streetwear items and working in-memory persistence).*

### 2.3 Run Database Migrations (Supabase)
If connecting to a live Supabase project:
1. Log into your Supabase Dashboard at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Execute `supabase/migrations/20261021000001_initial_schema.sql`.
4. Execute `supabase/seed.sql` to populate the initial catalog and coupons.

### 2.4 Start Development Servers
You can launch both frontend and backend concurrently via Turborepo:
```bash
pnpm dev
```
Or run each application individually:
- **NestJS API Engine**:
  ```bash
  pnpm dev:api
  ```
  *Server starts at `http://localhost:4000/api/v1`*
- **Next.js Storefront & Admin Portal**:
  ```bash
  pnpm dev:web
  ```
  *Application starts at `http://localhost:3000`*

---

## 3. Production Build & Verification

To verify full monorepo compilation, type checking, and Turbopack asset bundling:
```bash
pnpm build
```
This triggers:
1. `@driptide/contracts`: Compiles shared TypeScript declarations (`tsc`)
2. `@driptide/api`: Compiles NestJS modular application (`nest build`)
3. `web`: Compiles Next.js 16 App Router application (`next build`)

---

## 4. Production Deployment Topology

### 4.1 Frontend (`apps/web` on Vercel)
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm --filter web build`
- **Output Directory**: `.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://api.driptide.com/api/v1`
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### 4.2 Backend API Engine (`apps/api` on Railway / Render / AWS ECS)
- **Root Directory**: `apps/api`
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @driptide/contracts build && pnpm --filter @driptide/api build`
- **Start Command**: `node dist/main.js`
- **Environment Variables**:
  - `PORT`: `4000`
  - `SUPABASE_URL`: `https://your-project.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY`: Your service role secret
  - `ALLOWED_ORIGINS`: `https://driptide.com`
