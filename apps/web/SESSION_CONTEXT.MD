# Session Handoff Protocol
Read the analysis at codebase_analysis.md for full architecture details.

## File Ownership Map (DO NOT VIOLATE)
- Session 1: apps/web/lib/auth/, apps/web/app/api/auth/[...betterauth]/*
- Session 2: apps/web/lib/endow-connect/, apps/web/server/routers/endow-connect.ts
- Session 3: packages/ai-worker/src/match/, apps/web/server/routers/counselor-matching.ts, apps/web/lib/countries.ts
- Session 4: apps/web/lib/application-access.ts, apps/web/server/routers/applications*.ts

## Cross-Session Dependencies
- Auth session MUST output standard { user: { id, email, name, role } }
- Endow Connect populates targetCountries/targetSubjects
- Counselor mapping reads those targets and outputs assignedCounselorId
- Application access reads assignedCounselorId to enforce permissions
EOF