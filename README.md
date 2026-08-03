# Endow Global Education Platform

> A global education-recruitment platform connecting students, counselors, university partners, and administrators across countries in real time.

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOGIN PAGES                                  │
│  /login          /login/sa       /login/admin    /login/counselor│
│  Student Portal  Super Admin     Admin Portal    Counselor Hub  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Email/password auth (Better Auth)
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   /dashboard               /sa                   /admin
   Student only        SUPER_ADMIN only        ADMIN only
   │                       │                       │
   ├─ Overview             ├─ Dashboard            ├─ Dashboard
   ├─ My Application       ├─ Branches             ├─ Students
   ├─ Documents            ├─ Universities (CRUD)  ├─ Counselors
   ├─ Messages             ├─ Courses (CRUD)       ├─ Applications
   ├─ Appointments         ├─ Users (RBAC mgmt)    ├─ Documents
   └─ Profile Settings     ├─ Countries            ├─ Universities
                           ├─ Activity             ├─ Courses
                           └─ Settings             ├─ Departments
                                                   ├─ Scholarships
                    /counselor                     ├─ Resources (uploads)
                    COUNSELOR only                 ├─ Countries
                    │                               ├─ Messages
                    ├─ Dashboard                   ├─ Analytics
                    ├─ My Students                 ├─ Testimonials
                    ├─ Applications                ├─ Notifications
                    ├─ Sessions                    ├─ Newsletters
                    ├─ Messages                    └─ Settings
                    ├─ Reviews
                    ├─ Analytics
                    └─ Settings

        PUBLIC PAGES
        /               Landing page
        /about          About Endow
        /blog           Blog & resources
        /courses        Browse courses
        /universities   Explore universities
        /register       Student registration
        /onboarding     Post-OAuth profile completion
```

---

## Role-Based Access Control (RBAC)

| Role | Enum Value | Description | Dashboard |
|------|-----------|-------------|-----------|
| **Super Admin** | `SUPER_ADMIN` | Full platform control, user role management, university/course CRUD | `/sa` |
| **Admin** | `ADMIN` | Resource management, student/counselor oversight, content management | `/admin` |
| **Counselor** | `COUNSELOR` | Student management, application reviews, session scheduling | `/counselor` |
| **Student** | `STUDENT` | Browse courses, apply to universities, manage documents, book sessions | `/dashboard` |

RBAC is enforced at three layers:
1. **Middleware** (`middleware.ts`) — Cookie-based session check at the edge
2. **Layout** — Server-side role validation via `auth.api.getSession()`
3. **tRPC** — Procedure-level guards (`protectedProcedure`, `adminProcedure`, `superAdminProcedure`)

---

## Route Reference

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Main landing page with hero, course finder, stats, testimonials |
| `/about` | About | Platform information |
| `/blog` | Blog | Articles, resources, success stories |
| `/courses` | Course Browser | Browse and search all available courses |
| `/courses/[slug]` | Course Detail | Individual course page |
| `/universities` | University Explorer | Browse partner universities |
| `/universities/country/[slug]` | Country View | Universities filtered by country |
| `/register` | Student Registration | 4-step wizard: email → OTP → profile → study preferences |
| `/onboarding` | OAuth Completion | Profile completion for Google sign-in users |
| `/login` | Student Login | Email/password + Google sign-in |

### Student Routes (`/dashboard/*`) — Role: `STUDENT`

| Route | Page | Data |
|-------|------|------|
| `/dashboard` | Overview | Stats cards, application timeline, deadlines, quick actions |
| `/dashboard/application` | My Application | Application status cards with counselor notes |
| `/dashboard/documents` | Documents | Upload zone, file list with verified/pending/required statuses |
| `/dashboard/messages` | Messages | Conversation list with role badges and unread indicators |
| `/dashboard/appointments` | Appointments | Session cards with date, counselor, meeting links |
| `/dashboard/settings` | Profile Settings | Edit name, nationality, phone, education, target countries |

### Super Admin Routes (`/sa/*`) — Role: `SUPER_ADMIN`

| Route | Page | Features |
|-------|------|----------|
| `/sa` | Operations Control | Live network map + KPI cards |
| `/sa/branches` | Branches | Dense data table with search, sort, empty/loading/error states |
| `/sa/universities` | University Management | Full CRUD with inline form, search, pagination |
| `/sa/courses` | Course Management | Full CRUD with university selector, search, pagination |
| `/sa/users` | User Management | Role management (select dropdown), user deletion with cascade cleanup, search by name/email, role filter, pagination |
| `/sa/applications` | Applications | _(route exists)_ |
| `/sa/countries` | Countries | _(route exists)_ |
| `/sa/activity` | Activity | _(route exists)_ |
| `/sa/analytics` | Analytics | _(route exists)_ |
| `/sa/settings` | Settings | _(route exists)_ |

### Admin Routes (`/admin/*`) — Role: `ADMIN`

| Route | Page | Features |
|-------|------|----------|
| `/admin` | Dashboard | Stats, analytics chart, application pipeline, recent activity |
| `/admin/students` | Students | List + search, student detail view (`[id]`) |
| `/admin/counselors` | Counselors | Manage counselor profiles |
| `/admin/applications` | Applications | List + status filter, application detail (`[id]`) |
| `/admin/documents` | Documents | Document list from all applications |
| `/admin/universities` | Universities | University management |
| `/admin/courses` | Courses | Course management |
| `/admin/departments` | Departments | Department management |
| `/admin/scholarships` | Scholarships | Scholarship management |
| `/admin/countries` | Countries | Country management |
| `/admin/resources` | Resources | Drag-and-drop file upload, file list management |
| `/admin/messages` | Messages | Conversation monitoring |
| `/admin/analytics` | Analytics | Platform analytics |
| `/admin/testimonials` | Testimonials | Testimonial management |
| `/admin/notifications` | Notifications | Send system notifications |
| `/admin/newsletters` | Newsletters | Newsletter subscriber management |
| `/admin/admins` | Admin Management | Admin role management (promote/demote) |
| `/admin/activity` | System Activity | System logs |
| `/admin/revenue` | Revenue | Revenue tracking |
| `/admin/settings` | Settings | Admin settings |

### Counselor Routes (`/counselor/*`) — Role: `COUNSELOR`

| Route | Page | Description |
|-------|------|-------------|
| `/counselor` | Dashboard | Stats, recent students table, upcoming sessions, performance metrics |
| `/counselor/students` | My Students | _(route exists)_ |
| `/counselor/applications` | Applications | _(route exists)_ |
| `/counselor/sessions` | Sessions | _(route exists)_ |
| `/counselor/messages` | Messages | _(route exists)_ |
| `/counselor/reviews` | Reviews | _(route exists)_ |
| `/counselor/analytics` | Analytics | _(route exists)_ |
| `/counselor/settings` | Settings | _(route exists)_ |

### Auth Routes

| Route | Portal | Icon | Theme |
|-------|--------|------|-------|
| `/login` | Student | — | Light glass + crimson brand |
| `/login/sa` | Super Admin | Shield | Dark ops + amber accent |
| `/login/admin` | Admin | UserCog | Dark ops + amber accent |
| `/login/counselor` | Counselor | GraduationCap | Dark ops + green accent |
| `/register` | Student Registration | — | Multi-step wizard |

---

## API Endpoints

### tRPC Routers (`/api/trpc`)

| Router | Endpoints |
|--------|-----------|
| `user` | `getProfile`, `updateProfile` |
| `course` | `list`, `bySlug`, `getSubjects`, `getLevels` |
| `application` | `getAll`, `getById` |
| `session` | `getUpcoming` |
| `counselor` | `getAssignedStudents` |
| `message` | `getConversations` |
| `notification` | `getAll` |
| `referral` | `getMyCode` |
| `endow` | `getOverview` |
| `ai` | `getMatches` |
| `testimonial` | `getPublished`, `create`, `update`, `delete` |
| `admin` | 12 sub-routers (see below) |

### Admin tRPC Sub-routers

| Sub-router | Procedures | Access |
|------------|-----------|--------|
| `dashboard` | `getMetrics` | `adminProcedure` |
| `students` | `list`, `getById`, `updateProfile`, `assignCounselor` | `adminProcedure` |
| `applications` | `list`, `getById`, `updateStatus`, `addNotes` | `adminProcedure` |
| `counselors` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `notifications` | `sendSystem`, `list` | `adminProcedure` |
| `universities` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `courses` | `list`, `getById`, `create`, `update`, `delete`, `getSubjects` | `adminProcedure` |
| `countries` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `departments` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `scholarships` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `newsletters` | `list`, `getById`, `create`, `update`, `delete` | `adminProcedure` |
| `documents` | `list` | `adminProcedure` |
| `super` | `getAllUsers`, `updateUserRole`, `deleteUser`, `getAdmins`, `deleteAdmin`, `getPlatformStats` | `superAdminProcedure` |

### REST API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...all]` | `GET\|POST` | Better Auth handler (sign-in, sign-out, OTP, OAuth) |
| `/api/trpc/[trpc]` | `POST` | tRPC API handler |
| `/api/upload` | `POST` | Uploadthing file uploads (profile images, PDFs) |
| `/api/ai/chat` | `POST` | AI chatbot |
| `/api/ai/match` | `POST` | AI course matching |
| `/api/search` | `GET` | Typesense full-text search |
| `/api/webhooks/cal` | `POST` | Cal.com webhook |
| `/api/webhooks/stripe` | `POST` | Stripe webhook |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Auth** | Better Auth (email/password + OTP + Google OAuth) |
| **Database** | MySQL 2 + Drizzle ORM |
| **API Layer** | tRPC + superjson |
| **State** | React Query (TanStack) + Zustand |
| **Styling** | Tailwind CSS v3 + class-variance-authority |
| **Animation** | Framer Motion + GSAP |
| **Icons** | Lucide React |
| **Fonts** | Inter (body), Space Grotesk (display/KPI), JetBrains Mono (data/tables) |
| **Forms** | react-hook-form + zod |
| **File Upload** | Uploadthing + AWS S3 |
| **Email** | Resend + Nodemailer (Gmail SMTP) |
| **Search** | Typesense |
| **AI** | Vercel AI SDK + OpenAI + LangChain + Pinecone |
| **Payments** | Stripe |
| **Real-time** | Socket.io + Redis |
| **Push** | Firebase Cloud Messaging |
| **Monorepo** | pnpm workspaces + Turborepo |

---

## Design System — Super Admin Theme

> Dark ops console aesthetic shared across SA, Admin, and Counselor portals.

| Token | Hex | Usage |
|-------|-----|-------|
| `--sa-ink` | `#0E1220` | App background |
| `--sa-surface` | `#161B2E` | Cards, panels, search bars |
| `--sa-border` | `#262C42` | Hairline borders, dividers |
| `--sa-text-primary` | `#E8EAF2` | Headings, active text |
| `--sa-text-secondary` | `#8890A8` | Labels, captions, inactive nav |
| `--sa-route` | `#E8A33D` | Active states, CTAs, sidebar marker |
| `--sa-success` | `#4FD1A5` | Status dots, confirmed states |
| `--sa-alert` | `#F0625B` | Errors, notification badges |

### Shared Design System Components (`components/super-admin/shared/`)
- **SAButton** — 4 variants (primary/secondary/ghost/danger), 4 sizes
- **SABadge** — 5 variants (route/success/alert/warning/neutral) with optional dot
- **SAInput** — Dark-themed input with leading icon support
- **SATooltip** — Framer Motion animated tooltip, 4 placement sides

---

## Database Schema

### Auth Tables (Better Auth)
`user`, `account`, `session`, `verification`

### Domain Tables
`student_profile`, `counselor_profile`, `university`, `course`, `application`, `shortlisted_course`, `match_result`, `booking_session`, `conversation`, `message`, `notification`, `referral`, `newsletter_subscriber`, `chat_history`, `testimonials`

### Catalog Tables
`countries`, `currencies`, `universities` (catalog), `departments`, `courses` (catalog), `tags`, `course_tags`, `course_intakes`, `course_requirements`, `course_media`, `scholarships`, `user_shortlists`, `user_comparisons`, `course_reviews`, `course_views`, `university_rankings`

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
# Fill in: DATABASE_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
# GMAIL_USER, GMAIL_APP_PASSWORD, STRIPE_SECRET_KEY, OPENAI_API_KEY, TYPESENSE_API_KEY, etc.

# Push database schema
pnpm db:push

# Seed data
pnpm db:seed

# Start development server
pnpm dev

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Auth encryption key |
| `BETTER_AUTH_URL` | Yes | App URL for auth callbacks |
| `NEXT_PUBLIC_APP_URL` | Yes | Public-facing app URL |
| `GOOGLE_CLIENT_ID` | For OAuth | Google sign-in |
| `GOOGLE_CLIENT_SECRET` | For OAuth | Google sign-in |
| `GMAIL_USER` | For email | SMTP username |
| `GMAIL_APP_PASSWORD` | For email | SMTP app password |
| `STRIPE_SECRET_KEY` | For payments | Stripe integration |
| `OPENAI_API_KEY` | For AI | OpenAI/chatbot |
| `PINECONE_API_KEY` | For AI | Vector embeddings |
| `TYPESENSE_API_KEY` | For search | Full-text search |
| `UPSTASH_REDIS_URL` | For real-time | Redis for Socket.io |
| `AWS_REGION` | For storage | S3 region |
| `AWS_ACCESS_KEY_ID` | For storage | S3 credentials |
| `AWS_SECRET_ACCESS_KEY` | For storage | S3 credentials |
| `AWS_S3_BUCKET` | For storage | S3 bucket name |
| `UPLOADTHING_SECRET` | For upload | Uploadthing secret |
| `UPLOADTHING_APP_ID` | For upload | Uploadthing app ID |

---

## Monorepo Structure

```
endow-global/
├── apps/
│   ├── web/              # Next.js 14 frontend app
│   └── socket-server/    # Socket.io WebSocket server
├── packages/
│   ├── config/           # Shared Tailwind & ESLint config
│   ├── db/               # Drizzle ORM + MySQL schema
│   ├── types/            # Shared TypeScript types
│   └── ai-worker/        # AI embedding & auto-assignment
├── docs/                 # Documentation
├── e2e/                  # Playwright tests
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # Workspace definition
```

---

## Key Patterns

### Auth Flow
1. **Middleware** redirects unauthenticated users to `/login?callbackUrl=...`
2. **Layout** validates role and redirects if unauthorized
3. **tRPC procedures** enforce role at the API layer
4. Three separate login pages for Staff roles (`login/sa`, `/login/admin`, `/login/counselor`)

### State Management
- **Server state**: tRPC + React Query (caching, invalidation, optimistic updates)
- **Client state**: Zustand stores
- **Auth state**: `useSession()` from Better Auth client

### Error Handling
- Global `error.tsx` boundary at root
- Per-route error boundaries (universities, courses)
- Toast notifications via Sonner
- tRPC error formatter with Zod validation errors
