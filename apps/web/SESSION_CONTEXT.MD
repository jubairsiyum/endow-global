# Session Handoff Protocol
Read the analysis at codebase_analysis.md for full architecture details.

## File Ownership Map (DO NOT VIOLATE)
- Session 1: apps/web/lib/auth/, apps/web/app/api/auth/[...all]/*
- Session 2: apps/web/lib/endow-connect/, apps/web/server/routers/endow-connect.ts
- Session 3: packages/ai-worker/src/match/, apps/web/server/routers/counselor-matching.ts, apps/web/lib/countries.ts
- Session 4: apps/web/lib/application-access.ts, apps/web/server/routers/applications*.ts

## Cross-Session Dependencies
- Auth session MUST output standard { user: { id, email, name, role } }
- Endow Connect populates targetCountries/targetSubjects
- Counselor mapping reads those targets and outputs assignedCounselorId
- Application access reads assignedCounselorId to enforce permissions

## Session 1 Handoff

### What changed

NextAuth v5 (`next-auth@5.0.0-beta.31`) has been **completely replaced** by **BetterAuth** (`better-auth@1.6.x`).

| Before (NextAuth) | After (BetterAuth) |
|---|---|
| `apps/web/lib/auth.ts` — NextAuth config | `apps/web/lib/auth/better-auth.ts` — BetterAuth config |
| `apps/web/lib/auth.ts` — `export { auth }` | `apps/web/lib/auth.ts` — re-exports from `./auth/better-auth` |
| `app/api/auth/[...nextauth]/route.ts` | `app/api/auth/[...all]/route.ts` |
| `middleware.ts` — `getToken()` from `next-auth/jwt` | `middleware.ts` — `getSessionCookie()` from `better-auth/cookies` |
| `layout.tsx` — `<SessionProvider>` wrapper | `layout.tsx` — no wrapper needed (removed) |

### How to import auth helpers

#### Server-side (Server Components, tRPC context, API routes)

```ts
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'

const session = await getSession(await headers())
// session?.user → { id: string, email: string, name: string, role: string, image: string | null }
```

The `auth` object is also exported for advanced use:

```ts
import { auth } from '@/lib/auth'
// auth.api.getSession({ headers }) — lower-level BetterAuth API
```

#### Client-side (React components)

BetterAuth does **not** require a `<SessionProvider>`. For client-side session access, create a BetterAuth client:

```ts
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})
// authClient.useSession() — React hook
// authClient.signIn.social({ provider: 'google' }) — trigger OAuth
// authClient.signOut() — sign out
```

#### tRPC context shape (unchanged)

```ts
ctx.session → { user: { id: string, email: string, name: string, role: string } } | null
```

### Database

No schema changes were made. BetterAuth connects to the **same** MySQL `user`, `account`, `session` tables via a direct `mysql2` pool connection. Column names are mapped in `lib/auth/better-auth.ts`.

### Environment variables

| Variable | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Session signing secret (replace `NEXTAUTH_SECRET`) |
| `BETTER_AUTH_URL` | Base URL for auth callbacks (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (same as before) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (same as before) |
| `DATABASE_URL` | MySQL connection string (same as before) |

### Packages to remove (optional cleanup)

- `next-auth`
- `@auth/drizzle-adapter`

EOF