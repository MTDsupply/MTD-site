#!/usr/bin/env sh
# Applies every SQL file in supabase/migrations to the linked Supabase project.
set -e
cd "$(dirname "$0")/.."
if [ -f .env.local ]; then set -a; . ./.env.local; set +a; fi
if [ -z "$POSTGRES_URL_NON_POOLING" ]; then
  echo "POSTGRES_URL_NON_POOLING is not set. Run: vercel env pull --yes" >&2
  exit 1
fi
for f in supabase/migrations/*.sql; do
  echo "Applying $f"
  psql "$POSTGRES_URL_NON_POOLING" -v ON_ERROR_STOP=1 -q -f "$f"
done
echo "Migrations applied."
