#!/usr/bin/env sh
# Points the Vercel project back at the Vercel-managed Supabase resource
# (mtd-db): removes the manually set Supabase env vars so the integration can
# sync its own, reconnects the resource, and refreshes .env.local.
set -eu
cd "$(dirname "$0")/.."
for NAME in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY NEXT_PUBLIC_SUPABASE_ANON_KEY \
            SUPABASE_URL SUPABASE_SECRET_KEY SUPABASE_SERVICE_ROLE_KEY POSTGRES_URL_NON_POOLING; do
  for ENV in production preview development; do
    vercel env rm "$NAME" "$ENV" --yes >/dev/null 2>&1 || true
  done
done
vercel integration-resource connect mtd-db made-to-disappear --yes
vercel env pull --yes >/dev/null
echo "Vercel is back on mtd-db. Next: delete the straw rows, npm run db:seed, deploy."
