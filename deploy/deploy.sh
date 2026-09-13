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

echo "==> Pushing DB schema (drizzle-kit push)"
pnpm db:push

echo "==> Building web app"
pnpm build

echo "==> (Re)loading PM2 processes"
if pm2 show endow-web >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo ""
echo "==> Deploy complete."
pm2 status
