# Codebase Analysis & Developer Handoff Report

Date: 2026-05-23

## TL;DR

Monorepo student-counselor SaaS built with Next.js 14 (App Router), tRPC, Drizzle ORM (MySQL), and multiple services (socket-server, ai-worker). Auth uses Next-Auth (Drizzle adapter) with Google/Facebook/Email; a BetterAuth route folder exists but is unused. Major integrations: Stripe, Firebase, Typesense, Pinecone/OpenAI, UploadThing, Resend.

## 1. Tech stack and architecture

- Languages: TypeScript, Node.js
- Frontend: Next.js 14, React 19
- API layer: tRPC v11 (App Router)
- ORM/DB: Drizzle ORM targeting MySQL
- Auth: Next-Auth v5 (Drizzle adapter)
- Realtime: Socket.io + Redis (apps/socket-server)
- AI: OpenAI + LangChain + Pinecone (packages/ai-worker)
- Search: Typesense
- Payments: Stripe
- Uploads: UploadThing + S3
- Monorepo tooling: pnpm, Turbo

## 2. Folder structure & responsibilities

- `apps/web/` — Main Next.js app: UI, tRPC routers, API routes, `lib/*` utilities
- `apps/socket-server/` — WebSocket server for live messaging/notifications
- `packages/db/` — Drizzle config, schema, migrations (`src/schema/tables.ts`)
- `packages/ai-worker/` — Background AI processes (embeddings, auto-assign)
- `packages/types/` — Shared TypeScript types and enums

## 3. Authentication flow

- Next-Auth with Drizzle adapter; JWT session strategy.
- Providers: Google, Facebook, Email (Resend). OAuth accounts recorded in `accounts` table; users in `users` with `role` (STUDENT/COUNSELOR/ADMIN).
- tRPC context maps session to `session.user` and middleware provides `publicProcedure`, `protectedProcedure`, `counselorProcedure`, `adminProcedure` guards.
- Note: `apps/web/app/api/auth/[...betterauth]/` exists but appears unused.

## 4. Database models / schema (high-level)

- Core: `users`, `accounts`, `sessions`, `verificationTokens`
- Profiles: `studentProfiles` (targetCountries, targetSubjects, assignedCounselorId), `counselorProfiles` (expertiseCountries, expertiseSubjects)
- Academic: `universities`, `courses`, `shortlistedCourses`
- Applications: `applications` (studentId, courseId, counselorId, status, documentsUrls, counselorNotes)
- Scheduling/payments: `bookingSessions` (stripePaymentId)
- Messaging: `conversations`, `messages`, `notifications`
- AI: `profileEmbedding`, `matchResults` (vector ids)

Refer to `packages/db/src/schema/tables.ts` for full column definitions.

## 5. Existing API patterns

- Primary: tRPC procedures with Zod validation; context includes `db` and `session`.
- REST route handlers: `app/api/*` for webhooks (Stripe), search (Typesense), upload (UploadThing), AI endpoints, OG images.
- Error handling via TRPCError codes and Zod formatting.

## 6. Roles & permissions

- Roles: `STUDENT`, `COUNSELOR`, `ADMIN` (stored on `users`)
- Enforcement: tRPC middleware procedures (protected/counselor/admin) and query filters per `studentId`/`counselorId`.
- Data access: applications and booking sessions filtered by ownership/assignment; admin can access broader datasets.

## 7. Coding conventions & reusable components

- Components: PascalCase, Tailwind CSS, Radix UI primitives
- Forms: React Hook Form + Zod
- Data fetching: React Query; global state: Zustand
- Server components: Next.js App Router default; `use client` for interactive components
- Reusable patterns: `AdminTable`, `PageHeader`, `StatusBadge`, Radix `Dialog`, `Toast` (Sonner)

## 8. Risks & integration guidance

### BetterAuth Google Sign-In

- Current: route folder exists but unused; Next-Auth active.
- Risk: duplicating auth systems causes duplicate users/sessions.
- Recommendation: Implement BetterAuth adapter that links to existing `users`/`accounts` rows and issues the same session/JWT shape expected by `lib/trpc.ts`. Prefer phased rollout: add BetterAuth as an alternate provider that maps into the existing user model.

### Endow Connect Student Overview API

- Current: no references in codebase.
- Risk: external schema mismatch, rate limiting, PII handling.
- Recommendation: Create `apps/web/lib/endowConnect.ts` or `packages/integrations/endow-connect` adapter. Expose via tRPC and persist to `studentProfiles` or a separate table. Use background sync (ai-worker or scheduled job) and feature flags.

### Counselor mapping by country expertise

- Current: schema supports `expertiseCountries` and `targetCountries`; matching logic likely in `packages/ai-worker` but incomplete.
- Risk: country identifier mismatch, prioritization, scale.
- Recommendation: Normalize country IDs to ISO codes, implement deterministic matching in `packages/ai-worker` (primary filter by country, then subject/language), expose via tRPC `counselor.match`.

### Application management with separate access

- Current: Implemented (applications table, role-based procedures).
- Risk: inconsistent filters may cause data leakage.
- Recommendation: Add centralized `authorizeApplicationAccess(user, applicationId, mode)` helper used across read/update/submit endpoints; optionally add `applicationCollaborators` for shared access.

## Actionables (next steps)

1. Add this report to repo (done).
2. Scaffold BetterAuth adapter (phased approach).
3. Implement Endow Connect adapter and background sync.
4. Add country-normalization utilities and implement matching in `packages/ai-worker`.
5. Centralize application access checks and add tests.

## Key files (starting points)

- `apps/web/lib/auth.ts`
- `apps/web/app/api/auth/[...betterauth]/` (empty)
- `apps/web/lib/trpc.ts`
- `apps/web/server/routers/*.ts`
- `packages/db/src/schema/tables.ts`
- `packages/ai-worker/src/auto-assign.ts`

---

Prepared by: analysis tool
