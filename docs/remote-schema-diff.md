# Remote vs Local Schema Diff

Date: 2026-06-09
Remote: Hostinger MySQL `srv1749.hstgr.io` (u523324533_egeneweb)
Local: XAMPP MySQL `localhost:3306` (endow_db)

## Summary

- **18 tables** in both — no missing or extra tables
- **193 columns** remote, **~190 columns** local — minor differences
- **20 indexes** remote, **~12 indexes** local — some missing locally
- **2 foreign keys** remote (account→user, session→user) — local has more FKs defined in Drizzle but not in DB

## Key Differences

### 1. `account` table — SIGNIFICANT DIFFERENCE

| Aspect | Remote | Local (Drizzle) |
|---|---|---|
| Primary Key | Composite `(provider, providerAccountId)` | Single `id` (varchar 255) |
| `providerAccountId` column | Named `provider_account_id` | Named `account_id` |
| `provider` column | Exists | Named `providerId` |
| `accessTokenExpiresAt` | Named `expires_at` | Named `access_token_expires_at` |
| `refreshTokenExpiresAt` | Named `refresh_expires_at` | Named `refresh_token_expires_at` |
| Unique constraint | On `(provider, providerAccountId)` via PK | On `(providerId, accountId)` via index |

**Root cause**: Remote was created by BetterAuth/NextAuth with its own naming convention. Local Drizzle schema uses different column names.

**Resolution**: Update local Drizzle schema to match remote column names. The `account` table structure must match what BetterAuth expects.

### 2. `session` table — MODERATE DIFFERENCE

| Aspect | Remote | Local (Drizzle) |
|---|---|---|
| Token column | `session_token` | `token` |
| Expires column | `expires` | `expires_at` |

**Resolution**: Update local to use `session_token` and `expires`.

### 3. Boolean fields — NO ACTUAL DIFFERENCE

Remote uses `tinyint` for booleans. Drizzle `boolean()` maps to `tinyint(1)` in MySQL. These are equivalent.

Tables affected: `user.emailVerified`, `counselorProfile.isAvailable`, `course.hasScholarship`, `course.isActive`, `message.isRead`, `notification.isRead`, `newsletterSubscriber.isActive`, `bookingSession.reminderSent`

### 4. Missing indexes locally

- `email_idx` on `user.email` — exists remote, missing local
- `account_user_id_idx` — exists remote, missing local
- `session_user_id_idx` — exists remote, missing local

### 5. `course` table — IDENTICAL

No differences. Safe to use for course page.

## Action Items

1. Update `packages/db/src/schema/tables.ts`:
   - `accounts`: match remote column names (`provider`, `providerAccountId`, composite PK)
   - `sessions`: rename `token` → `sessionToken`, `expiresAt` → `expires`
2. Add missing indexes
3. Generate migration and push to local DB
