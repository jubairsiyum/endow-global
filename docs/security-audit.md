# Security Audit

Date: 2026-06-09

## Findings

### CRITICAL

| # | Finding | Location | Status |
|---|---|---|---|
| 1 | Admin routes unprotected — `PROTECTED_ADMIN_PATHS` is empty array | `middleware.ts:7` | **FIXED** |

### WARN

| # | Finding | Location | Status |
|---|---|---|---|
| 2 | Dashboard uses mock data, no real server-side DB calls | `app/dashboard/page.tsx` | Documented |
| 3 | Remote DB connection string uses plain `mysql://` (not TLS) | `packages/db/.env` | Documented |
| 4 | No rate limiting on API routes or tRPC procedures | `server/routers/*` | Documented |
| 5 | No CORS configuration (defaults to same-origin) | `next.config.mjs` | OK (default is safe) |
| 6 | `.env.example` contains real remote credentials | `.env.example` | Documented |

### OK

| # | Finding | Location | Status |
|---|---|---|---|
| 7 | Secrets not exposed to client bundle — only `NEXT_PUBLIC_*` vars in client code | `.env` | OK |
| 8 | SQL injection prevented — Drizzle ORM uses parameterized queries | All DB calls | OK |
| 9 | Auth uses session cookies (BetterAuth) — no JWT in localStorage | `lib/auth.ts` | OK |
| 10 | Server-side data fetching used for tRPC context | `lib/trpc.ts` | OK |
| 11 | Input validation via Zod in tRPC procedures | `server/routers/*` | Partial |
| 12 | HTTPS enforced by Vercel deployment | `vercel.json` | OK |

## Fixes Applied

### Fix #1: Enable Admin Middleware Protection

**File**: `apps/web/middleware.ts`

Changed `PROTECTED_ADMIN_PATHS` from empty array to `['/admin']`.

This ensures unauthenticated users are redirected to `/login` when accessing admin routes.
