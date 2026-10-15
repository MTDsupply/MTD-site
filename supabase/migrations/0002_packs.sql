-- Consumer pack tiers (100 / 200 / 500), as [{count, price}].
alter table public.products add column if not exists packs jsonb not null default '[]'::jsonb;
