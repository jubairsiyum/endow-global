Admin Portal Build Plan
Phase 1: Security (2 files)
1.1 Enable admin route protection — middleware.ts

Uncomment PROTECTED_ADMIN_PATHS = ['/admin']
The middleware only checks for session cookie existence (not role). Role checking happens at the tRPC adminProcedure level.
1.2 Add admin auth guard — app/admin/layout.tsx

Convert to a server component wrapper that validates the session + ADMIN role
Redirect to /login if no session, or /dashboard if not admin
Keep the client-side sidebar/topbar as a nested client component
Phase 2: Backend — tRPC Routers (1 file rewrite + 1 new file)
2.1 Rewrite server/routers/admin.ts — Full admin router with nested sub-routers:

Sub-router Procedures
admin.dashboard getMetrics — user count, application counts by status, counselor count, recent activity
admin.students list (search, pagination), getById, updateProfile, assignCounselor
admin.applications list (search, status filter, pagination), getById, updateStatus, addNotes
admin.counselors list, getById
admin.notifications sendSystem (to user or broadcast)
All procedures use adminProcedure (auth + ADMIN role check).

2.2 Add zod validation — Input schemas for list/pagination/update endpoints.

Phase 3: Frontend — Connect to Real APIs (5 pages)
3.1 Dashboard — app/admin/page.tsx

Replace hardcoded stats with admin.dashboard.getMetrics tRPC query
Show real counts: students, applications, pending docs, consultations
Show real application pipeline counts by status
Show recent activity from DB
3.2 Students — app/admin/students/page.tsx

Connect search input to admin.students.list with debounced query
Server-side pagination (cursor-based, 20 per page)
Real data: name, email, nationality, assigned counselor, status
"View" button navigates to /admin/students/[id]
3.3 Student Detail — NEW app/admin/students/[id]/page.tsx

Fetch student by ID with profile + applications + sessions
Show full profile: GPA, test scores, target countries/subjects, counselor assignment
Assign/change counselor dropdown
3.4 Applications — app/admin/applications/page.tsx

Connect search + status filter to admin.applications.list
Server-side pagination
Real data: student name, university, course, status, submission date
Status badge using actual ApplicationStatus enum values
"View" button navigates to /admin/applications/[id]
3.5 Application Detail — NEW app/admin/applications/[id]/page.tsx

Fetch application with student + course + counselor relations
Show application details, documents, personal statement
Update status dropdown with confirmation
Add/view counselor notes
Files to Create/Modify
Action File
Modify middleware.ts
Modify app/admin/layout.tsx
Rewrite server/routers/admin.ts
Modify app/admin/page.tsx
Rewrite app/admin/students/page.tsx
Create app/admin/students/[id]/page.tsx
Rewrite app/admin/applications/page.tsx
Create app/admin/applications/[id]/page.tsx
Modify components/ui/StatusBadge.tsx (support real enum values)
Modify server/root.ts (if router structure changes)
Execution Order
Middleware + Admin layout auth guard (security first)
Admin tRPC router (backend)
Dashboard page (quick win, verifies backend works)
Students list + detail (core feature)
Applications list + detail (core feature)
StatusBadge update (support real statuses)
