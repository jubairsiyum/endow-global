# 🚀 Endow Global — Hostinger Deployment Guide

## Project Architecture Summary

| Component | Tech | Port | Notes |
|---|---|---|---|
| **Next.js Web App** | Next.js 14, React 19, tRPC | 3000 | Main app (`apps/web`) |
| **Socket Server** | Node.js + Socket.io | 3001 | Real-time messaging (`apps/socket-server`) |
| **Database** | MySQL (Drizzle ORM) | 3306 | Already on Hostinger (`srv1749.hstgr.io`) |
| **Redis** | Upstash Redis (cloud) | — | Session/caching, use Upstash |
| **Search** | Typesense | 8108 | Needs a cloud instance |
| **File Storage** | AWS S3 | — | Already configured |
| **Auth** | Better Auth | — | Embedded in Next.js |

> [!IMPORTANT]
> This is a **pnpm monorepo** (Turborepo). Hostinger's Node.js hosting runs a **single Node process per app**. You will deploy the **Next.js app** as the main process, and the **Socket server** as a **separate process** (via PM2 or a second Node.js app on Hostinger). The DB is already hosted on Hostinger MySQL.

---

## Pre-Deployment Checklist

Before touching the server, complete these steps locally:

- [ ] All environment variables are ready (see Step 2)
- [ ] Database is already provisioned on Hostinger (`u523324533_egeneweb`)
- [ ] DB migrations are up to date (`pnpm db:push` or `pnpm db:migrate`)
- [ ] You have SSH access to your Hostinger VPS/Premium plan
- [ ] Node.js ≥ 20 and pnpm ≥ 10 are available on the server

---

## STEP 1 — Prepare Hostinger Node.js Environment

### 1.1 Log into Hostinger hPanel
1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Navigate to **Hosting → Manage**
3. Go to **Node.js** section (under Advanced or Website section)
4. Set Node.js version to **20.x** (LTS)

### 1.2 Enable SSH Access
1. In hPanel → **SSH Access** → Enable SSH
2. Note your SSH hostname, port (usually 22 or a custom port), and username
3. Connect via terminal:
   ```bash
   ssh u523324533@srv1749.hstgr.io -p 65002
   # (port number may differ — check hPanel SSH settings)
   ```

### 1.3 Install pnpm on the Server
Once SSH'd in:
```bash
# Install pnpm globally
npm install -g pnpm@11.5.2

# Verify
pnpm --version
node --version   # should be >= 20
```

---

## STEP 2 — Configure Environment Variables

> [!CAUTION]
> **Never commit your `.env` file to git.** Transfer it securely via SSH only.

Create the production `.env` at the root of your project on the server. Here are all variables you need to set for production:

```bash
# ── Database (Already on Hostinger) ───────────────────────
DATABASE_URL="mysql://u523324533_egeneweb:YOUR_PASSWORD@srv1749.hstgr.io:3306/u523324533_egeneweb"

# ── Better Auth ───────────────────────────────────────────
BETTER_AUTH_URL="https://yourdomain.com"          # ← your actual domain
BETTER_AUTH_SECRET="your-strong-random-secret"    # ← generate a new one for prod

# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"   # ← socket proxied via same domain
NEXT_PUBLIC_APP_NAME="Endow Global Education"

# ── OAuth ─────────────────────────────────────────────────
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# ── OpenAI ────────────────────────────────────────────────
OPENAI_API_KEY="sk-..."

# ── Pinecone ──────────────────────────────────────────────
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="endow-courses"
PINECONE_ENVIRONMENT="..."

# ── Typesense (use Typesense Cloud or self-hosted) ────────
TYPESENSE_HOST="xxxxx.a1.typesense.net"   # ← Typesense Cloud host
TYPESENSE_PORT="443"
TYPESENSE_API_KEY="your-typesense-admin-key"
NEXT_PUBLIC_TYPESENSE_SEARCH_KEY="your-search-only-key"

# ── Redis (Upstash — free tier works) ────────────────────
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# ── Stripe ────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# ── AWS S3 ────────────────────────────────────────────────
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-southeast-1"
AWS_S3_BUCKET="endow-global-uploads"
NEXT_PUBLIC_CDN_URL="https://cdn.endowglobal.com"

# ── Firebase ──────────────────────────────────────────────
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ── SMTP ──────────────────────────────────────────────────
SMTP_HOST="smtp.hostinger.com"           # Hostinger's SMTP
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@yourdomain.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM="Endow Global <no-reply@yourdomain.com>"

# ── UploadThing ───────────────────────────────────────────
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."

# ── Cal.com ───────────────────────────────────────────────
CAL_API_KEY="..."
NEXT_PUBLIC_CAL_NAMESPACE="endow"

# ── Socket Server ─────────────────────────────────────────
SOCKET_PORT="3001"
```

---

## STEP 3 — Upload Your Code to the Server

### Option A: Git (Recommended)

```bash
# On the server via SSH:
cd /home/u523324533/domains/yourdomain.com/public_html
# OR the node app directory Hostinger assigns

git clone https://github.com/YOUR_USERNAME/endow-global.git .
```

### Option B: SFTP / File Manager
Upload the entire project folder via Hostinger File Manager or an SFTP client (FileZilla), **excluding**:
- `node_modules/` (all of them)
- `.next/` build artifacts
- `.turbo/`
- `test-results/`

---

## STEP 4 — Install Dependencies on the Server

```bash
# SSH into server, go to project root
cd /home/u523324533/domains/yourdomain.com/public_html

# Create the .env file
nano .env
# Paste all production environment variables and save

# Install dependencies (pnpm handles the monorepo workspace)
pnpm install --frozen-lockfile
```

---

## STEP 5 — Run Database Migrations

> [!IMPORTANT]
> Your MySQL database is already on Hostinger. Run migrations before building.

```bash
# From the project root on the server
pnpm db:push
# OR if you use migration files:
pnpm db:migrate
```

---

## STEP 6 — Build the Next.js App

```bash
# Build all packages (turbo handles dependency order)
pnpm build
```

This will:
1. Build `packages/db`, `packages/types`, `packages/config`, `packages/ai-worker` first
2. Then build `apps/web` (Next.js) → outputs to `apps/web/.next/`
3. The socket server doesn't need a build step currently (runs via tsx in dev, needs esbuild for prod — see Step 7)

> [!WARNING]
> **Build memory issue**: Next.js builds can be memory-heavy. If it fails with OOM, set:
> ```bash
> export NODE_OPTIONS="--max-old-space-size=4096"
> pnpm build
> ```

---

## STEP 7 — Build the Socket Server

The socket server currently has no build script. You need to compile it:

```bash
cd apps/socket-server

# Install esbuild as dev dependency (one-time)
pnpm add -D esbuild

# Build to dist/
pnpm exec esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --external:ioredis --external:socket.io
```

Or add a `build` script to `apps/socket-server/package.json`:
```json
"build": "esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --external:ioredis --external:socket.io"
```

---

## STEP 8 — Set Up PM2 Process Manager

Hostinger Node.js hosting uses **PM2** to manage processes. You need two processes.

### 8.1 Install PM2
```bash
npm install -g pm2
```

### 8.2 Create PM2 Ecosystem Config

Create `ecosystem.config.js` at the project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'endow-web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'endow-socket',
      cwd: './apps/socket-server',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        SOCKET_PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
```

### 8.3 Start Both Processes
```bash
# From the project root
pm2 start ecosystem.config.js

# Save PM2 config so it restarts after server reboot
pm2 save
pm2 startup   # follow the output command it gives you
```

### 8.4 Verify Both Are Running
```bash
pm2 list
pm2 logs endow-web
pm2 logs endow-socket
```

---

## STEP 9 — Configure Hostinger hPanel Node.js App Entry Point

In hPanel:
1. Go to **Node.js → Manage** for your domain
2. Set:
   - **Node.js version**: 20.x
   - **Application root**: `/home/u523324533/domains/yourdomain.com/public_html`
   - **Application startup file**: `apps/web/node_modules/.bin/next` or use PM2
   - **Application URL**: your domain

> [!NOTE]
> Hostinger's "Node.js app" manager runs a single entry point. Since you're using PM2 for both apps, point the **startup file** to your `ecosystem.config.js` or just manage via PM2 directly via SSH.

---

## STEP 10 — Configure Reverse Proxy (Socket.io)

The socket server runs on port 3001. You need to proxy `/socket.io/` requests to it through your domain so the frontend can connect without CORS issues.

### In Hostinger hPanel → `.htaccess` OR Nginx config:

If Hostinger uses **Apache** (most shared/premium plans):

Create/edit `.htaccess` in `public_html`:
```apache
RewriteEngine On

# Proxy Socket.io to port 3001
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^socket\.io/(.*) ws://localhost:3001/socket.io/$1 [P,L]

RewriteRule ^socket\.io/(.*) http://localhost:3001/socket.io/$1 [P,L]

# All other requests go to Next.js on port 3000
RewriteRule ^(.*) http://localhost:3000/$1 [P,L]
```

> [!IMPORTANT]
> If Hostinger uses **Nginx** (VPS plans), you need to edit the Nginx config instead. Contact Hostinger support to confirm your hosting type or check in hPanel under "Web Server".

For **Nginx VPS**, edit `/etc/nginx/sites-available/yourdomain.com`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Socket.io WebSocket proxy
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then reload: `sudo nginx -t && sudo nginx -s reload`

---

## STEP 11 — Set Up SSL (HTTPS)

In hPanel:
1. Go to **SSL → Manage**
2. Enable **Free SSL (Let's Encrypt)** for your domain
3. Force HTTPS redirect

After SSL is enabled, update your `.env` on the server:
```bash
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"
```

Then restart:
```bash
pm2 restart all
```

---

## STEP 12 — Configure External Services for Production

### Redis → Use Upstash (Free)
1. Go to [upstash.com](https://upstash.com) → Create Redis database
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your `.env`

### Typesense → Use Typesense Cloud
1. Go to [cloud.typesense.org](https://cloud.typesense.org) → Create cluster
2. Copy host, port (`443`), and API keys to `.env`

### Google OAuth → Update Redirect URIs
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Update **Authorized redirect URIs** to:
   - `https://yourdomain.com/api/auth/callback/google`

---

## STEP 13 — Post-Deployment Verification

```bash
# Check both processes are running
pm2 list

# Check Next.js logs
pm2 logs endow-web --lines 50

# Check Socket server logs
pm2 logs endow-socket --lines 50

# Test HTTP response
curl -I https://yourdomain.com

# Test Socket endpoint
curl https://yourdomain.com/socket.io/
```

Visit your domain and check:
- [ ] Homepage loads
- [ ] Login / registration works
- [ ] Admin panel is accessible at `/admin`
- [ ] Real-time chat/notifications work (socket)
- [ ] File uploads work (UploadThing / S3)

---

## Summary Deployment Commands (Quick Reference)

```bash
# 1. SSH into server
ssh u523324533@srv1749.hstgr.io -p 65002

# 2. Clone repo
cd /home/u523324533/domains/yourdomain.com/public_html
git clone https://github.com/YOUR/endow-global.git .

# 3. Create .env with production values
nano .env

# 4. Install deps
pnpm install --frozen-lockfile

# 5. Run DB migrations
pnpm db:push

# 6. Build everything
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

# 7. Build socket server
cd apps/socket-server && pnpm exec esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --external:ioredis --external:socket.io && cd ../..

# 8. Start with PM2
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| Build OOM error | Not enough RAM | `export NODE_OPTIONS="--max-old-space-size=4096"` |
| `pnpm: command not found` | pnpm not installed | `npm install -g pnpm@11.5.2` |
| Socket connection fails | Port 3001 blocked | Use reverse proxy via port 80/443 |
| DB connection refused | Wrong host in `DATABASE_URL` | Confirm Hostinger internal hostname |
| `BETTER_AUTH_URL` mismatch | Forgot to update for prod | Set to `https://yourdomain.com` |
| Google OAuth not working | Old redirect URIs | Update in Google Cloud Console |
| Images not loading | CSP or missing remote pattern | Add hostname to `next.config.mjs` `remotePatterns` |
