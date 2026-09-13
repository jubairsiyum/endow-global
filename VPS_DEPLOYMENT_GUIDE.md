# 🚀 Endow Global — Hostinger KVM 4 Ubuntu VPS Deployment Guide

> Self-hosted production deployment on a **Hostinger KVM 4** (Ubuntu) VPS with full root access.
> This differs from the shared-hosting guide in `hostinger_deployment_guide.md` — here we control
> Nginx, MySQL, Docker, PM2 and SSL directly.

## Architecture (what runs where)

| Component | Where | Port | Notes |
|---|---|---|---|
| **Next.js 14 web app** | PM2 (`endow-web`) | 3000 | `apps/web` |
| **Socket.io server** | PM2 (`endow-socket`) | 3001 | `apps/socket-server` (run via `tsx`, no build needed) |
| **MySQL** | Native on VPS | 3306 | Self-hosted, `DATABASE_URL` points at `127.0.0.1` |
| **Typesense** | Docker (compose) | 8108 | Self-hosted, `TYPESENSE_HOST=127.0.0.1` |
| **Redis** | ⚠️ see below | — | App uses **Upstash REST**, not plain Redis |
| **Nginx** | Native | 80/443 | Reverse proxy + WebSocket for `/socket.io/` |
| **SSL** | Certbot (Let's Encrypt) | 443 | Free |

> [!IMPORTANT]
> **Redis decision.** The app is hardwired to **Upstash's REST API** (`apps/web/lib/redis.ts` uses
> `@upstash/redis` with `UPSTASH_REDIS_REST_URL`/`TOKEN`, and
> `apps/web/app/api/auth/login-rate-limit/route.ts` calls the REST endpoints via `fetch`).
> A plain self-hosted Redis (the `redis` service in `docker-compose.yml`) **will not satisfy** these.
> For production, keep **Upstash Redis (free tier)** — no code changes. If you truly want Redis on the
> VPS, you must refactor `lib/redis.ts` + the rate-limit route to `ioredis` first (out of scope here).
> The `docker-compose.yml` Redis service is currently **unused** by the app; you may leave it out.

---

## 0. Prerequisites

- Hostinger KVM 4 VPS (Ubuntu 22.04/24.04) with root SSH access
- A domain with an **A record** pointing at the VPS public IP (and optionally a `www` record)
- A **Stripe/OpenAI/Pinecone/Google OAuth/etc.** credentials already in hand (see `apps/web/.env`)

Replace `yourdomain.com` and `YOUR_*` placeholders throughout.

---

## 1. Connect & bootstrap the server

Run the included bootstrap script as root (installs Node 20, pnpm, MySQL, Docker, Nginx, Certbot, PM2, UFW):

```bash
ssh root@YOUR_VPS_IP

# Copy the repo's deploy/setup-vps.sh to the server, or paste its contents, then:
chmod +x setup-vps.sh
./setup-vps.sh
```

The script installs everything with `apt`/`npm`. Review `deploy/setup-vps.sh` before running.

---

## 2. Create the MySQL database + user

```bash
mysql
```

```sql
CREATE DATABASE endow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'endow'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON endow.* TO 'endow'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

> MySQL 8 on Ubuntu uses `auth_socket` for `root` by default — that's why the app connects with its
> own user/password. If your MySQL needs it: `sudo mysql_secure_installation`.

---

## 3. Start Typesense (Docker)

```bash
cd /opt/endow-global    # or wherever you cloned the repo
docker compose up -d typesense
```

Generate a **search-only key** (the frontend uses `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY`):

```bash
curl -X POST "http://127.0.0.1:8108/keys" \
  -H "X-TYPESENSE-API-KEY: YOUR_TYPESENSE_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"description":"Search-only key","actions":["documents:search"],"collections":["*"]}'
```

Record the returned key as `NEXT_PUBLIC_TYPESENSE_SEARCH_KEY`.

> `TYPESENSE_API_KEY` in `.env` must equal the `--api-key` value you passed to the Typesense
> container (set via `TYPESENSE_API_KEY` in `.env`, which `docker-compose.yml` interpolates).

---

## 4. Deploy the code

```bash
mkdir -p /opt/endow-global && cd /opt/endow-global
git clone https://github.com/YOUR_USERNAME/endow-global.git .
```

Or use the bundled deploy script (`deploy/deploy.sh`) after the first clone — it handles
`git pull` → install → migrate → build → PM2 reload.

### 4.1 Environment variables

Create the single source of truth env file (loaded by Next.js, the DB package and the socket server):

```bash
cp deploy/.env.production.example apps/web/.env
nano apps/web/.env
```

Fill in every value. At minimum for a working self-hosted deploy:

```dotenv
DATABASE_URL="mysql://endow:YOUR_STRONG_DB_PASSWORD@127.0.0.1:3306/endow"
BETTER_AUTH_URL="https://yourdomain.com"
BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_NAME="Endow Global Education"
SOCKET_PORT=3001

TYPESENSE_HOST=127.0.0.1
TYPESENSE_PORT=8108
TYPESENSE_API_KEY="YOUR_TYPESENSE_ADMIN_KEY"
NEXT_PUBLIC_TYPESENSE_SEARCH_KEY="YOUR_SEARCH_ONLY_KEY"

# Upstash (keep cloud — see Redis note)
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxx"
```

> `apps/web/.env` is the single location read by all processes:
> Next.js loads it natively; `packages/db`, `drizzle.config.ts` and the socket server all go through
> `env-loader.cjs`, which prefers `apps/web/.env`.

### 4.2 Install, migrate, build

```bash
corepack enable && corepack prepare pnpm@11.10.0 --activate   # or: npm i -g pnpm@11.10.0
pnpm install --frozen-lockfile

# Push schema to your fresh MySQL DB
pnpm db:push
# optional: seed reference data (countries, courses, etc.)
pnpm db:seed

# Build (memory-heavy — set a higher heap for KVM 4's RAM)
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

> The socket server needs no build step — it runs via `tsx` directly (see next section).
> `pnpm build` only builds the Next.js app (`apps/web`).

---

## 5. Start with PM2

`ecosystem.config.js` at the repo root defines both processes. Start and persist:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # run the command it prints to enable boot-time restart
```

Verify:

```bash
pm2 status
pm2 logs endow-web --lines 50
pm2 logs endow-socket --lines 50
```

---

## 6. Nginx reverse proxy + SSL

### 6.1 Install the server block

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/endow
sed -i 's/yourdomain.com/YOUR_DOMAIN/g' /etc/nginx/sites-available/endow
ln -s /etc/nginx/sites-available/endow /etc/nginx/sites-enabled/endow
nginx -t && systemctl reload nginx
```

### 6.2 SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-edits the config to add HTTPS and sets up renewal. Test auto-renewal:

```bash
certbot renew --dry-run
```

### 6.3 Update env after SSL

Confirm these are `https://` in `apps/web/.env`, then reload:

```bash
pm2 reload all
```

---

## 7. Verify

```bash
curl -I https://yourdomain.com                     # expect 200/301
curl https://yourdomain.com/socket.io/             # expect a socket.io handshake response
pm2 status
docker compose ps                                 # typesense running
```

Checklist:
- [ ] Homepage loads over HTTPS
- [ ] Login / registration works
- [ ] `/admin` panel accessible
- [ ] Real-time chat works (WebSocket through Nginx)
- [ ] Search works (Typesense) — run the seed/indexer if empty
- [ ] File uploads work (UploadThing/S3)

---

## 8. Deploying updates (every subsequent release)

```bash
cd /opt/endow-global && ./deploy/deploy.sh
```

Or manually: `git pull` → `pnpm install --frozen-lockfile` → `pnpm db:push` → `pnpm build` → `pm2 reload all`.

---

## 9. Firewall & security notes

`setup-vps.sh` enables UFW with `OpenSSH` + `Nginx Full` only — ports **3000/3001/8108/3306** stay
internal (only reachable from `127.0.0.1`). Keep it that way; Nginx is the only public entry.

---

## 10. Common issues

| Issue | Cause | Fix |
|---|---|---|
| Build OOM (`JavaScript heap out of memory`) | Next.js build exceeds RAM | `export NODE_OPTIONS="--max-old-space-size=4096"` (or add swap) |
| Socket fails / 502 on `/socket.io/` | Nginx upgrade headers missing | Ensure `deploy/nginx.conf` has `Upgrade`/`Connection "upgrade"` |
| `pnpm: command not found` | corepack/pnpm not on PATH | `corepack enable && corepack prepare pnpm@11.10.0 --activate` |
| DB `connection refused` | MySQL bound to socket or wrong host | Use `127.0.0.1:3306`, not `localhost` (avoids socket mismatch) |
| `BETTER_AUTH_URL` mismatch | Env still points to old URL | Set `https://yourdomain.com` and `pm2 reload all` |
| Google OAuth fails | Old redirect URIs | Add `https://yourdomain.com/api/auth/callback/google` in Google Console |
| Typesense connection timeout | Wrong host/key | `TYPESENSE_HOST=127.0.0.1`, `TYPESENSE_PORT=8108`, key must match compose |
| Images blocked by CSP | `remotePatterns`/CSP missing host | Add hostname to `apps/web/next.config.mjs` `images.remotePatterns` + CSP |
| Uploads fail (413) | Nginx body size too small | `client_max_body_size` is set to 100m in `deploy/nginx.conf` |
