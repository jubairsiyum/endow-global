# Hostinger VPS Deployment

This project runs as two Node processes behind Nginx:

- Next.js: `127.0.0.1:3000`
- Socket.IO: `127.0.0.1:3001`
- MySQL: external Hostinger/MySQL or another managed MySQL instance
- Redis and Typesense: optional Docker services from `docker-compose.yml`

## 1. Point the domain

Create an A record for `example.com` and, if used, `www.example.com` pointing to the VPS public IP. Wait for DNS to resolve before requesting TLS certificates.

## 2. Prepare Ubuntu

SSH into the VPS as root or a sudo-enabled user and run:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git nginx ufw
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install --global pnpm@11.5.2 pm2
node --version
pnpm --version
```

Allow only SSH, HTTP, and HTTPS through the firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 3. Upload and install

Replace `YOUR_REPOSITORY_URL` with the Git repository URL:

```bash
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www
cd /var/www
git clone YOUR_REPOSITORY_URL endow-global
cd /var/www/endow-global
pnpm install --frozen-lockfile
```

Create the production environment file. Do not commit it:

```bash
cp .env.example .env
nano .env
chmod 600 .env
```

At minimum, set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, and the credentials for every feature you enable. Generate a secret with:

```bash
openssl rand -base64 48
```

## 4. Prepare the database

The database must already exist and allow connections from the VPS. Then run migrations and seed data only when appropriate for the database:

```bash
pnpm db:migrate
pnpm db:seed
```

Do not use `pnpm db:seed` on an existing production database unless the seed script is known to be safe to rerun.

## 5. Build and start the services

```bash
pnpm build
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup systemd
```

Run the command printed by `pm2 startup`, then save again:

```bash
pm2 save
pm2 status
pm2 logs --lines 100
```

Verify the local services before configuring Nginx:

```bash
curl -I http://127.0.0.1:3000
curl http://127.0.0.1:3001/socket.io/
```

## 6. Configure Nginx

Copy the template, replace both domain names, and enable it:

```bash
sudo cp deploy/nginx.endow.conf /etc/nginx/sites-available/endow-global
sudo nano /etc/nginx/sites-available/endow-global
sudo ln -s /etc/nginx/sites-available/endow-global /etc/nginx/sites-enabled/endow-global
sudo nginx -t
sudo systemctl reload nginx
```

Remove the default site if it conflicts:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 7. Enable HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

After HTTPS is active, update `.env` so both public URLs use `https://`, then rebuild and restart:

```bash
pnpm build
pm2 restart all --update-env
```

## 8. Updates

Use this sequence for each release:

```bash
cd /var/www/endow-global
git pull --ff-only
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm build
pm2 reload deploy/ecosystem.config.cjs --update-env
pm2 save
```

## 9. Troubleshooting

```bash
pm2 status
pm2 logs endow-web --lines 200
pm2 logs endow-socket --lines 200
sudo tail -n 100 /var/log/nginx/error.log
sudo ss -ltnp | grep -E ':80|:443|:3000|:3001'
```

Never expose ports `3000`, `3001`, `6379`, or `8108` publicly. Nginx should be the only public application entry point.
