#!/usr/bin/env bash
set -euo pipefail

# Endow Global — deploy script (run from the repo root on the VPS).
# Usage: ./deploy/deploy.sh

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

export NODE_OPTIONS="--max-old-space-size=4096"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing dependencies"
pnpm install --frozen-lockfile

echo "==> Applying homepage hero image schema"
# Production was initialized with a targeted schema flow and has legacy drift.
# Keep this repair idempotent instead of replaying the full Drizzle history.
node packages/db/scripts/ensure-homepage-hero-schema.cjs

echo "==> Applying university schema changes"
# Use an idempotent targeted SQL check. The legacy catalog schema has drifted
# from Drizzle's snapshot, so a full drizzle-kit push is unsafe here.
pnpm db:ensure-university-schema

echo "==> Building web app"
pnpm build

echo "==> (Re)loading PM2 processes"
if pm2 show endow-web >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js --update-env
fi

pm2 save

echo ""
echo "==> Deploy complete."
pm2 status
