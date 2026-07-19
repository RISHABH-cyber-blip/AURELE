# Page Map

Folders already scaffolded under `app/`, matching the agreed plan.
Route groups `(shop)` and `(auth)` don't affect the URL — they're just
organizational.

| # | Page | Route | Folder | Status |
|---|------|-------|--------|--------|
| 1 | Home | `/` | `app/page.tsx` | Placeholder only |
| 2 | Shop / listing | `/shop` | `app/(shop)/shop` | Empty |
| 3 | Product detail | `/product/[slug]` | `app/(shop)/product/[slug]` | Empty |
| 4 | Cart | `/cart` | `app/(shop)/cart` | Empty |
| 5 | Wishlist | `/wishlist` | `app/(shop)/wishlist` | Empty |
| 6 | Login | `/login` | `app/(auth)/login` | Empty |
| 7 | Signup | `/signup` | `app/(auth)/signup` | Empty |
| 8 | Account | `/account` | `app/account` | Empty |
| 9 | Checkout | `/checkout` | `app/checkout` | Empty |
| 10 | Track order | `/track-order` | `app/track-order` | Empty |
| 11 | Authenticity | `/authenticity` | `app/authenticity` | Empty |
| 12 | About | `/about` | `app/about` | Empty |
| 13 | Support | `/support` | `app/support` | Empty |
| 14 | Contact | `/contact` | `app/contact` | Empty |
| 15 | Terms | `/legal/terms` | `app/legal/terms` | Empty |
| 16 | Privacy | `/legal/privacy` | `app/legal/privacy` | Empty |
| 17 | Refund policy | `/legal/refund-policy` | `app/legal/refund-policy` | Empty |
| — | Admin | `/admin/*` | `app/admin` | Empty, not in public nav |

API routes scaffolded:
- `app/api/checkout` — will create Stripe Checkout Sessions
- `app/api/webhooks/stripe` — will handle payment confirmation +
  atomic stock decrement (see `lib/inventory.ts`)

## Build order (per the phased plan)

1. **Core shopping loop** — Home → Shop → Product Detail → Cart → Checkout
2. **Account system** — Login/Signup → Account → Wishlist → Track Order
3. **Trust & legal** — Authenticity → About → Support → Contact → Terms →
   Privacy → Refund Policy
4. **Admin** — product CRUD, order management
