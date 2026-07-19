# Aurele — Project Scaffold

Portfolio/demo e-commerce project for watches & fashion, built to look and run
like a real business. This is the **foundation only** — no pages have been
designed yet, per plan (Navbar + Hero come next).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma + Supabase
(Postgres + Auth) · Stripe · Zustand · TanStack Query · next-intl · Resend ·
React Three Fiber (3D) · Cloudinary

## What's in this scaffold

✅ **Done**
- Full folder structure for all 16 planned pages (see PAGES.md)
- `package.json` with the full agreed stack, nothing extra
- Tailwind theme with the locked design tokens: cream background, gold/champagne
  accent, Fraunces (display serif) + Inter (body) fonts, calm 600–800ms motion
  timing
- Prisma schema: `Brand → Product → ProductVariant` relational structure, with
  stock tracked per-variant (not per-product) — see schema comments
- `lib/inventory.ts` — atomic stock decrement to prevent overselling on
  concurrent checkouts (the race-condition fix we discussed)
- Supabase client setup (browser + server) and auth-session middleware
- Zustand cart store (client-side, persisted, revalidated server-side at
  checkout — never trusted as source of truth for price/stock)
- `.env.example` documenting every required key

🚧 **Not built yet (intentional — by design)**
- Any actual page UI (Navbar, Hero, product cards, etc.)
- Stripe checkout flow / webhook handler logic
- Admin panel logic
- next-intl message files (empty `messages/` folder, ready for locales)
- Seed data / sample products

## Setup steps (do these before we build pages)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a free Supabase project** at supabase.com, then copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)
   - Database connection string (pooled) → `DATABASE_URL`

3. **Copy the env template**
   ```bash
   cp .env.example .env
   ```
   Fill in the Supabase values above. Stripe/Resend/Cloudinary keys can wait
   until we reach those features.

4. **Push the schema to your database**
   ```bash
   npm run db:push
   ```
   This creates all the tables (Brand, Product, ProductVariant, Order, etc.)
   in your Supabase Postgres instance.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   You should see a plain "Scaffold Ready" placeholder page at
   `localhost:3000` — confirming fonts, colors, and the build pipeline all
   work. This is not the real design.

## What's next
Per the plan: Navbar + Hero, built together so you can see the actual
cream/gold/serif direction in the browser before we build the remaining
pages on top of it.
