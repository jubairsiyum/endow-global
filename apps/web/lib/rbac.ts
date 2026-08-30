// ─── RBAC — Module based permissions ──────────────────────────────────
// SUPER_ADMIN bypasses all checks. ADMIN users have an explicit
// permissions array (JSON) stored on the `user` row, e.g.
//   ["students:view","students:manage","resources:manage"]
// `manage` always implies `view` for the same module.

export const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', group: 'Core' },
  { id: 'students', label: 'Students', icon: 'Users', group: 'People' },
  { id: 'counselors', label: 'Counselors', icon: 'UserCog', group: 'People' },
  { id: 'applications', label: 'Applications', icon: 'FileText', group: 'Workflow' },
  { id: 'documents', label: 'Documents', icon: 'FileCheck2', group: 'Workflow' },
  { id: 'deadlines', label: 'Deadlines', icon: 'CalendarClock', group: 'Workflow' },
  { id: 'universities', label: 'Universities', icon: 'GraduationCap', group: 'Catalog' },
  { id: 'courses', label: 'Courses', icon: 'BookOpen', group: 'Catalog' },
  { id: 'scholarships', label: 'Scholarships', icon: 'Award', group: 'Catalog' },
  { id: 'countries', label: 'Countries', icon: 'Globe', group: 'Catalog' },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare', group: 'Communication' },
  { id: 'resources', label: 'Resources', icon: 'Upload', group: 'Content' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', group: 'Insights' },
  { id: 'testimonials', label: 'Testimonials', icon: 'Star', group: 'Content' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', group: 'Communication' },
  { id: 'newsletters', label: 'Newsletters', icon: 'Mail', group: 'Communication' },
  { id: 'settings', label: 'Settings', icon: 'Settings', group: 'System' },
  // Super-admin only modules (also RBAC-controllable for delegated super staff)
  { id: 'branches', label: 'Branches', icon: 'Building2', group: 'System' },
  { id: 'users', label: 'Users', icon: 'Users', group: 'System' },
  { id: 'admins', label: 'Admin Management', icon: 'Shield', group: 'System' },
  { id: 'activity', label: 'System Activity', icon: 'Activity', group: 'Insights' },
  { id: 'revenue', label: 'Revenue', icon: 'DollarSign', group: 'Insights' },
] as const

export type ModuleId = typeof MODULES[number]['id']

export const ACTIONS = ['view', 'manage'] as const
export type Action = typeof ACTIONS[number]

export type Permission = `${ModuleId}:${Action}`

// All possible permissions (used for validation & UI)
export const ALL_PERMISSIONS: Permission[] = MODULES.flatMap((m) => ACTIONS.map((a) => `${m.id}:${a}` as Permission))

// For convenience — modules where `view` alone is usually the right grant for read-only staff
export const VIEW_ONLY_MODULES = new Set<ModuleId>(['analytics', 'activity', 'revenue', 'dashboard'])

// Human helper for UI chips
export function permissionLabel(p: Permission): string {
  const [mod, act] = p.split(':') as [ModuleId, Action]
  const m = MODULES.find((x) => x.id === mod)
  return `${m?.label ?? mod} — ${act === 'manage' ? 'Manage' : 'View'}`
}

export function parsePermission(p: string): { module: ModuleId; action: Action } | null {
  const [mod, act] = p.split(':')
  if (!mod || !act) return null
  if (!(MODULES as any).some((m: any) => m.id === mod)) return null
  if (!(ACTIONS as any).includes(act)) return null
  return { module: mod as ModuleId, action: act as Action }
}

export function isValidPermission(p: string): boolean {
  return parsePermission(p) !== null
}

// ─── Permission check ──────────────────────────────────────────────
export function hasPermission(
  userPermissions: string[] | null | undefined,
  required: Permission,
  role?: string
): boolean {
  // Super admin bypasses everything
  if (role === 'SUPER_ADMIN') return true
  if (!userPermissions || userPermissions.length === 0) return false
  if (userPermissions.includes(required)) return true
  // `manage` implies `view` for same module
  const { module, action } = parsePermission(required) ?? { module: '', action: '' as any }
  if (action === 'view' && userPermissions.includes(`${module}:manage` as Permission)) return true
  // wildcard `*` or `*:*` grants all
  if (userPermissions.includes('*') || userPermissions.includes('*:*') || userPermissions.includes(`${module}:*`)) return true
  return false
}

export function hasAnyPermission(
  userPermissions: string[] | null | undefined,
  candidates: Permission[],
  role?: string
): boolean {
  return candidates.some((p) => hasPermission(userPermissions, p, role))
}

// Sidebar filter helper
export function filterModulesByPermissions(
  userPermissions: string[] | null | undefined,
  role?: string
): typeof MODULES {
  if (role === 'SUPER_ADMIN') return MODULES as any
  return MODULES.filter((m) => hasPermission(userPermissions, `${m.id}:view` as Permission, role)) as any
}

// Map legacy admin router keys to module ids (for guard wiring)
export const ROUTER_MODULE_MAP: Record<string, ModuleId> = {
  dashboard: 'dashboard',
  students: 'students',
  applications: 'applications',
  counselors: 'counselors',
  documents: 'documents',
  deadlines: 'deadlines',
  universities: 'universities',
  courses: 'courses',
  countries: 'countries',
  messages: 'messages',
  resources: 'resources',
  analytics: 'analytics',
  testimonials: 'testimonials',
  notifications: 'notifications',
  newsletters: 'newsletters',
  settings: 'settings',
  branches: 'branches',
  revenue: 'revenue',
  // super/admin/users => mapping
  super: 'admins',
}

// Counselor hub modules (reviews/analytics removed per requirements)
export const COUNSELOR_MODULES = [
  { id: 'counselor:dashboard', label: 'Dashboard' },
  { id: 'counselor:students', label: 'My Students' },
  { id: 'counselor:applications', label: 'Applications' },
  { id: 'counselor:sessions', label: 'Sessions' },
  { id: 'counselor:messages', label: 'Messages' },
] as const

export type CounselorModuleId = typeof COUNSELOR_MODULES[number]['id']
