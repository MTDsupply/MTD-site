-- Volume pricing: the per-unit price charged on every case once an order
-- reaches 10,000 units (src/lib/pricing.ts). Null when a SKU has no volume tier.
alter table public.products add column if not exists bulk_unit_price numeric(10,4);
