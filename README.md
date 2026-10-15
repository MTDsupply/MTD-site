# Made to Disappear

Storefront for Made to Disappear: certified home compostable foodservice supplies, sold by the case to businesses and in packs to consumers from one site. The brand card and site map that drive every decision are in [docs/brand-card.md](docs/brand-card.md).

## Stack

Next.js 16 (App Router, Cache Components), TypeScript, Tailwind 4, Supabase (Postgres + magic-link auth), Stripe Checkout, Resend, pdf-lib. Deploys to Vercel; the project is linked as `made-to-disappear`.

## Run it

```sh
npm install
vercel env pull --yes      # pulls Supabase/Stripe/Resend keys into .env.local
npm run db:migrate         # applies supabase/migrations/*.sql (needs psql)
npm run db:seed            # upserts src/lib/catalog/seed.ts into Supabase
npm run dev
```

`npm run build` runs the copy lint first: it fails if any banned claim word (see the claims rules in the brand card) appears in `src/` or `public/`.

## How the catalogue works

- `src/lib/catalog/seed.ts` is the source of truth. `npm run db:seed` pushes it to Supabase; the site reads Supabase and falls back to the seed if the database is unreachable.
- A category's `status` (`live` | `coming_soon`) drives every surface: home grid, `/products`, the mega-menu, the footer and `/certifications`. Flip it in the database (or the seed, then reseed) and nothing else changes.
- Live products render product cards with Add to cart. Coming-soon categories render the Fog tile with a Clay tag and a "Notify me" capture that writes to the `notify` table and emails hello@.
- Prices are per pack (consumer) or per case (business). The header toggle is stored in the `mtd_mode` cookie.

## Integrations

| Service | Status | What it does |
| --- | --- | --- |
| Supabase | installed and seeded | catalogue, notify, quotes, contact, orders, addresses, magic-link sign-in |
| Stripe | needs marketplace terms accepted, then `vercel integration add stripe --no-claim --name mtd-stripe` | hosted Checkout from `/cart`; webhook at `/api/stripe/webhook` writes orders (set `STRIPE_WEBHOOK_SECRET`) |
| Resend | needs marketplace terms accepted, then `vercel integration add resend/resend-email --no-claim --name mtd-email` | quote, contact and notify emails to hello@; set `EMAIL_FROM` to a verified domain sender |

Until Stripe is installed, checkout shows a message pointing to the phone line and the quote form. Until Resend is installed, emails are logged to the server console.

## Before launch

- Replace the placeholder phone number in `src/lib/site.ts` and the site URL / contact email env vars.
- The wordmark (`public/logo-wordmark.png`, plus a white variant) is the October 2026 "made to disappear." mark, cut out from `docs/source-logo/`. The certification badge is `public/badge-home-compostable.png`. The favicon is the wordmark on a Paper square.
- Add the TÜV Austria certificate numbers and PDFs (`public/certs/`) to the `certs` table or the seed.
- Confirm straw pricing and case count (`MTD-STR-200` in the seed is a placeholder).
- Add product photos to `public/products/` as `SKU-front.jpg`, `SKU-3q.jpg`, `SKU-base.jpg`, `SKU-case.jpg`.
- In Supabase Auth, set the site URL and add `/auth/confirm` to the redirect allow list.
