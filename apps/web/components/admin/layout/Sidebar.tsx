'use client'

import { useUserAvatar } from '@/components/providers/UserAvatarProvider'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON, type Permission } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import { UserRole } from '@endow/types'
import { motion } from 'framer-motion'
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarClock,
  CalendarDays,
  DollarSign,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  ImagePlus,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  Star,
  Upload,
  UserCog,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  icon: any
  href: string
  perm: Permission
}

interface NavSection {
  title?: string
  items: NavItem[]
}

// Logical categories
const adminSections: NavSection[] = [
  {
    items: [{ name: 'Dashboard', icon: LayoutDashboard, href: '/admin', perm: 'dashboard:view' }],
  },
  {
    title: 'Student Management',
    items: [
      { name: 'Students', icon: Users, href: '/admin/students', perm: 'students:view' },
      { name: 'Counselors', icon: UserCog, href: '/admin/counselors', perm: 'counselors:view' },
      {
        name: 'Applications',
        icon: FileText,
        href: '/admin/applications',
        perm: 'applications:view',
      },
      { name: 'Documents', icon: FileCheck2, href: '/admin/documents', perm: 'documents:view' },
      { name: 'Deadlines', icon: CalendarClock, href: '/admin/deadlines', perm: 'deadlines:view' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        name: 'Universities',
        icon: GraduationCap,
        href: '/admin/universities',
        perm: 'universities:view',
      },
      { name: 'Courses', icon: BookOpen, href: '/admin/courses', perm: 'courses:view' },
      { name: 'Scholarships', icon: Award, href: '/admin/scholarships', perm: 'scholarships:view' },
      { name: 'Countries', icon: Globe, href: '/admin/countries', perm: 'countries:view' },
      { name: 'Resources', icon: Upload, href: '/admin/resources', perm: 'resources:view' },
      { name: 'Hero Images', icon: ImagePlus, href: '/admin/hero-images', perm: 'hero:view' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { name: 'Messages', icon: MessageSquare, href: '/admin/messages', perm: 'messages:view' },
      {
        name: 'Notifications',
        icon: Bell,
        href: '/admin/notifications',
        perm: 'notifications:view',
      },
      { name: 'Newsletters', icon: Mail, href: '/admin/newsletters', perm: 'newsletters:view' },
      { name: 'Events', icon: CalendarDays, href: '/admin/events', perm: 'events:view' },
      { name: 'Testimonials', icon: Star, href: '/admin/testimonials', perm: 'testimonials:view' },
    ],
  },
  {
    title: 'System & Reports',
    items: [
      { name: 'Analytics', icon: BarChart3, href: '/admin/analytics', perm: 'analytics:view' },
      { name: 'System Activity', icon: Activity, href: '/admin/activity', perm: 'activity:view' },
      { name: 'Settings', icon: Settings, href: '/admin/settings', perm: 'settings:view' },
    ],
  },
]

const superAdminExtraSections: NavSection[] = [
  {
    title: 'Administration',
    items: [
      { name: 'Branches', icon: Building2, href: '/admin/branches', perm: 'branches:view' },
      { name: 'Users', icon: Users, href: '/admin/users', perm: 'users:view' },
      { name: 'Admin Management', icon: Shield, href: '/admin/admins', perm: 'admins:view' },
      { name: 'Revenue', icon: DollarSign, href: '/admin/revenue', perm: 'revenue:view' },
    ],
  },
]

interface SidebarProps {
  userRole: UserRole
  permissions?: string[]
}

export function Sidebar({ userRole, permissions }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { image: avatarImage } = useUserAvatar()
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN

  const user = {
    name: session?.user?.name || (isSuperAdmin ? 'Super Admin' : 'Admin'),
    image: avatarImage ?? (session?.user as any)?.image ?? null,
  }

  const effectivePerms: string[] = (() => {
    if (permissions !== undefined) return permissions
    return parsePermissionsJSON((session?.user as any)?.permissions)
  })()

  const can = (perm: Permission) => {
    if (isSuperAdmin) return true
    if (perm === 'dashboard:view') return true
    return hasPermission(effectivePerms, perm, userRole)
  }

  // Filter sections based on permissions
  const filterSections = (sections: NavSection[]) => {
    return sections
      .map((section) => ({
        ...section,
        items: isSuperAdmin ? section.items : section.items.filter((it) => can(it.perm)),
      }))
      .filter((section) => section.items.length > 0)
  }

  const filteredAdminSections = filterSections(adminSections)
  const filteredSuperSections = filterSections(superAdminExtraSections)

  const allSections = isSuperAdmin
    ? [...filteredAdminSections, ...filteredSuperSections]
    : filteredAdminSections

  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Admin'
  const roleInitials = isSuperAdmin ? 'SA' : 'AD'

  const totalVisibleItems = allSections.reduce((acc, s) => acc + s.items.length, 0)

  return (
    <aside className="relative flex h-screen w-[220px] flex-col border-r border-gray-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-900">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(232, 163, 61, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-gray-200 px-3 dark:border-gray-800">
        <span
          className="text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {isSuperAdmin ? (
            <>
              ENDOW<span style={{ color: '#E8A33D' }}> OPS</span>
            </>
          ) : (
            <>
              ENDOW<span style={{ color: '#E8A33D' }}> ADMIN</span>
            </>
          )}
        </span>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-3"
        aria-label="Admin navigation"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="space-y-4 px-2">
          {totalVisaBleItemsCheck(totalVisibleItems) ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white px-3 py-6 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                No modules assigned
              </p>
              <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                Contact a Super Admin to grant permissions.
              </p>
            </div>
          ) : (
            allSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-0.5">
                {section.title && (
                  <h4 className="px-3 pb-1 pt-2 text-[12px] font-semibold uppercase tracking-wider text-[#E8A33D]/80 dark:text-gray-500">
                    {section.title}
                  </h4>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                        isActive
                          ? 'bg-gray-200/50 font-semibold text-gray-900 dark:bg-gray-800/80 dark:text-white'
                          : 'text-gray-600 hover:bg-gray-200/40 dark:text-gray-400 dark:hover:bg-gray-800/40'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-active"
                          className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-r-full"
                          style={{ background: '#E8A33D' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Icon
                        size={16}
                        className="shrink-0"
                        style={{ color: isActive ? '#E8A33D' : undefined }}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t border-gray-200 p-2 dark:border-gray-800">
        <div className="group flex items-center gap-2.5 rounded-lg bg-gray-100/80 px-2 py-2 transition-colors hover:bg-gray-200/60 dark:bg-gray-800/60 dark:hover:bg-gray-800">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200 text-[11px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            suppressHydrationWarning
          >
            {user?.image ? (
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              roleInitials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-gray-900 dark:text-white">
              {user?.name || roleLabel}
            </p>
            <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">endow.global</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </aside>
  )
}

function totalVisaBleItemsCheck(count: number) {
  return count === 0
}
