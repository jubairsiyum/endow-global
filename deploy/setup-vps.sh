#!/usr/bin/env bash
set -euo pipefail

# Endow Global — VPS bootstrap script (run as root).
# Installs Node 20, pnpm, MySQL, Docker, Nginx, Certbot, PM2 and enables UFW.
# Tested on Ubuntu 22.04 / 24.04.

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo ./setup-vps.sh" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating packages"
apt-get update && apt-get upgrade -y

echo "==> Installing base tools"
apt-get install -y curl ca-certificates gnupg git build-essential

echo "==> Installing Node.js 20 (NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Enabling corepack + pnpm"
corepack enable
corepack prepare pnpm@11.10.0 --activate

echo "==> Installing MySQL server"
apt-get install -y mysql-server
systemctl enable --now mysql

echo "==> Installing Docker + Compose plugin"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

echo "==> Installing Nginx + Certbot"
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx

echo "==> Installing PM2"
npm install -g pm2

echo "==> Configuring firewall (SSH + HTTP/HTTPS only)"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "==> Bootstrap complete."
echo "Node:  $(node --version)"
echo "pnpm:  $(pnpm --version)"
echo "MySQL: $(mysqld --version)"
echo "Docker: $(docker --version)"
echo ""
echo "Next steps:"
echo "  1. Create the MySQL DB + user (see VPS_DEPLOYMENT_GUIDE.md section 2)"
echo "  2. Clone the repo and copy deploy/.env.production.example -> apps/web/.env"
echo "  3. docker compose up -d typesense"
echo "  4. pnpm install --frozen-lockfile && pnpm db:push && pnpm build"
echo "  5. pm2 start ecosystem.config.js"
echo "  6. Configure Nginx + certbot (section 6)"
