#!/usr/bin/env sh
# Points the Vercel project at the Supabase project the CLI is linked to
# (supabase/.temp/project-ref): fetches its API keys, replaces the Supabase
# env vars in Production, Preview and Development, and refreshes .env.local.
# Needs: `supabase login`, `supabase link`, `vercel link`, and the database
# password in SUPABASE_DB_PASSWORD (used only for POSTGRES_URL_NON_POOLING,
# which scripts/migrate.sh reads).
set -eu
cd "$(dirname "$0")/.."
REF=$(cat supabase/.temp/project-ref)
: "${SUPABASE_DB_PASSWORD:?set SUPABASE_DB_PASSWORD to the database password}"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
supabase projects api-keys --project-ref "$REF" -o json > "$TMP/keys.json"

# One file per variable; only variables we have values for get written.
printf '%s' "https://$REF.supabase.co" > "$TMP/NEXT_PUBLIC_SUPABASE_URL"
printf '%s' "https://$REF.supabase.co" > "$TMP/SUPABASE_URL"
printf '%s' "postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$REF.supabase.co:5432/postgres" > "$TMP/POSTGRES_URL_NON_POOLING"
python3 - "$TMP" <<'PY'
import json, os, sys
d = sys.argv[1]
for k in json.load(open(os.path.join(d, "keys.json"))):
    key, name = k.get("api_key", ""), k.get("name", "")
    if key.startswith("sb_publishable_"): out = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    elif key.startswith("sb_secret_"): out = "SUPABASE_SECRET_KEY"
    elif name == "anon": out = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    elif name == "service_role": out = "SUPABASE_SERVICE_ROLE_KEY"
    else: continue
    open(os.path.join(d, out), "w").write(key)
PY
rm "$TMP/keys.json"

# Detach the old marketplace resource (removes the variables it synced), then
# clear any leftovers so `vercel env add` cannot collide.
vercel integration-resource disconnect mtd-db made-to-disappear --yes >/dev/null 2>&1 || true
for NAME in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY NEXT_PUBLIC_SUPABASE_ANON_KEY \
            SUPABASE_URL SUPABASE_PUBLISHABLE_KEY SUPABASE_ANON_KEY SUPABASE_SECRET_KEY SUPABASE_SERVICE_ROLE_KEY \
            SUPABASE_JWT_SECRET POSTGRES_URL POSTGRES_PRISMA_URL POSTGRES_URL_NON_POOLING POSTGRES_HOST \
            POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DATABASE; do
  for ENV in production preview development; do
    vercel env rm "$NAME" "$ENV" --yes >/dev/null 2>&1 || true
  done
done

for F in "$TMP"/*; do
  NAME=$(basename "$F")
  for ENV in production preview development; do
    vercel env add "$NAME" "$ENV" < "$F" >/dev/null
    echo "set $NAME ($ENV)"
  done
done

vercel env pull --yes >/dev/null
echo "Vercel now points at Supabase project $REF. Next: npm run db:seed, then deploy."
