# Theme & Style Audit

Date: 2026-06-09

## Color System

| Token | Value | Usage |
|---|---|---|
| `primary` / `#C41E3A` | Crimson red | Buttons, badges, accents, CTAs |
| `primary` (dark) | `#AD0819` | Alternate primary in tailwind config |
| Background (light) | `#f6f7fb` / `#f7f8fb` | Body, dashboard, sections |
| Background (dark) | `#ffffff` (body), `#0b0f19` (dashboard) | Dark mode |
| Card bg | `white` | Cards, panels, modals |
| Text primary | `gray-900` / `gray-950` | Headings, body |
| Text muted | `gray-500` / `gray-600` | Descriptions, labels |
| Success | `green-50` / `green-600` | Growth indicators, checkmarks |
| Warning | `yellow-50` / `yellow-600` | Pending states |
| Danger | `red-50` / `red-600` | Alerts, unread counts |

## Typography

- **Headings**: `font-heading` → Quicksand (`--font-quicksand`), bold, `tracking-tight`
- **Body**: `font-sans` → Inter (via `@fontsource/inter`), regular
- **Scale**:
  - Hero: `text-4xl sm:text-5xl lg:text-6xl` font-bold
  - Section: `text-3xl sm:text-4xl` font-bold
  - Subsection: `text-xl` / `text-lg` font-bold/semibold
  - Body: `text-base` / `text-sm`
  - Labels: `text-xs` font-semibold uppercase tracking-wider

## Spacing Patterns

- **Section padding**: `py-16` to `py-20`
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card padding**: `p-5` to `p-8`
- **Gap (grids)**: `gap-4` to `gap-6` (cards), `gap-8` to `gap-12` (sections)
- **Element spacing**: `space-y-6` pattern for stacked sections

## Component Library

### Button (`components/ui/button.tsx`)
- Variants: `default` (bg-[#C41E3A]), `outline`, `ghost`, `link`, `white`
- Sizes: `default` (h-11), `sm` (h-9), `lg` (h-14), `icon` (h-10 w-10)
- Style: `rounded-full`, hover lift (`hover:-translate-y-0.5`), shadow on hover

### Cards
- Marketing: `rounded-lg border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]`
- Dashboard: `rounded-xl border border-gray-200 bg-white p-3 shadow-sm`
- Admin: `rounded-lg border border-gray-200 bg-white shadow-sm`

### Badges
- Pill: `rounded-full bg-rose-50 text-[#C41E3A]` text-xs font-semibold
- Status: Color-coded (green=success, yellow=warning, red=danger)

### Inputs
- `h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm`
- Focus: `focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20`

## Layout Patterns

### Public Pages (/, /about, /universities, /blog)
- Navbar (fixed, floating, transforms on scroll)
- Content sections (full-width or max-w-7xl container)
- Footer (bg-gray-50, 4-column grid)

### Dashboard (/dashboard/*)
- DashboardShell: sidebar + topbar + main content
- Sidebar: full (lg), rail (md), drawer (mobile)
- Main: `flex-1 overflow-y-auto p-4 lg:p-6`

### Admin (/admin/*)
- Sidebar + Topbar + scrollable main
- `flex h-screen overflow-hidden bg-[#f4f6fb] dark:bg-[#0b0f19]`

## Responsive Breakpoints

- Mobile: default (< md)
- Tablet: `md:` (768px) — icon rail sidebar
- Desktop: `lg:` (1024px) — full sidebar
- Wide: `xl:` (1280px) — admin grid layouts

## Dark Mode

- Mechanism: `next-themes` with `attribute="class"`, `defaultTheme="dark"`
- Toggle: `ThemeToggle` component in `components/ui/`
- Dashboard dark bg: `dark:bg-[#0b0f19]`
- Admin dark bg: `dark:bg-[#0b0f19]`
- Cards dark: `dark:border-gray-800 dark:bg-[#1a1d25]`
- Text dark: `dark:text-white`, `dark:text-gray-400`

## Shared Layouts

- `RootLayout`: ThemeProvider → TRPCReactProvider → Toaster
- `DashboardLayout`: DashboardShell wrapper
- `AdminLayout`: Sidebar + Topbar wrapper
- `UniversitiesLayout`: metadata only (no wrapper)

## Animations

- Framer Motion: `fadeUp`, `staggerContainer`, `floatingVariants`
- CSS: `university-marquee` scroll, `hover-float`, transitions
- Scroll animations: `whileInView` with `viewport={{ once: true }}`
