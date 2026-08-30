'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSession } from '@/lib/auth-client'
import { useUserAvatar } from '@/components/providers/UserAvatarProvider'
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  Star,
  BookOpen,
  UserCog,
  Globe,
  Award,
  Mail,
  Shield,
  Activity,
  DollarSign,
  Upload,
  Building2,
  FileCheck2,
  CalendarClock,
} from 'lucide-react'
import { UserRole } from '@endow/types'
import { cn } from '@/lib/utils'
import { hasPermission, type Permission } from '@/lib/rbac'

const adminMenuItems: Array<{ name: string; icon: any; href: string; perm: Permission }> = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', perm: 'dashboard:view' },
  { name: 'Students', icon: Users, href: '/admin/students', perm: 'students:view' },
  { name: 'Counselors', icon: UserCog, href: '/admin/counselors', perm: 'counselors:view' },
  { name: 'Applications', icon: FileText, href: '/admin/applications', perm: 'applications:view' },
  { name: 'Documents', icon: FileCheck2, href: '/admin/documents', perm: 'documents:view' },
  { name: 'Deadlines', icon: CalendarClock, href: '/admin/deadlines', perm: 'deadlines:view' },
  { name: 'Universities', icon: GraduationCap, href: '/admin/universities', perm: 'universities:view' },
  { name: 'Courses', icon: BookOpen, href: '/admin/courses', perm: 'courses:view' },
  { name: 'Scholarships', icon: Award, href: '/admin/scholarships', perm: 'scholarships:view' },
  { name: 'Countries', icon: Globe, href: '/admin/countries', perm: 'countries:view' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages', perm: 'messages:view' },
  { name: 'Resources', icon: Upload, href: '/admin/resources', perm: 'resources:view' },
  { name: 'Analytics', icon: BarChart3, href: '/admin/analytics', perm: 'analytics:view' },
  { name: 'Testimonials', icon: Star, href: '/admin/testimonials', perm: 'testimonials:view' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications', perm: 'notifications:view' },
  { name: 'Newsletters', icon: Mail, href: '/admin/newsletters', perm: 'newsletters:view' },
  { name: 'Settings', icon: Settings, href: '/admin/settings', perm: 'settings:view' },
]

const superAdminExtraItems: Array<{ name: string; icon: any; href: string; perm: Permission }> = [
  { name: 'Branches', icon: Building2, href: '/admin/branches', perm: 'branches:view' },
  { name: 'Users', icon: Users, href: '/admin/users', perm: 'users:view' },
  { name: 'Admin Management', icon: Shield, href: '/admin/admins', perm: 'admins:view' },
  { name: 'System Activity', icon: Activity, href: '/admin/activity', perm: 'activity:view' },
  { name: 'Revenue', icon: DollarSign, href: '/admin/revenue', perm: 'revenue:view' },
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

  // Resolve effective permissions: prop > session > fallback []
  const effectivePerms: string[] = (() => {
    if (permissions && permissions.length) return permissions
    const sessPerms = (session?.user as any)?.permissions
    if (Array.isArray(sessPerms)) return sessPerms
    if (typeof sessPerms === 'string') {
      try {
        const p = JSON.parse(sessPerms)
        if (Array.isArray(p)) return p
      } catch {}
    }
    return []
  })()

  const can = (perm: Permission) => hasPermission(effectivePerms, perm, userRole)

  const filteredAdminItems = isSuperAdmin ? adminMenuItems : adminMenuItems.filter((it) => can(it.perm))
  const filteredSuperItems = isSuperAdmin
    ? superAdminExtraItems
    : superAdminExtraItems.filter((it) => can(it.perm))

  const menuItems = isSuperAdmin
    ? [...filteredAdminItems, ...filteredSuperItems]
    : filteredAdminItems

  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Admin'
  const roleInitials = isSuperAdmin ? 'SA' : 'AD'

  return (
    <aside
      className="relative flex h-screen w-[220px] flex-col border-r"
      style={{ background: '#f8fafc', borderColor: '#e5e7eb' }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(232, 163, 61, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div
        className="flex shrink-0 items-center justify-between border-b px-3 h-[52px]"
        style={{ borderColor: '#e5e7eb' }}
      >
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
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
        <div className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive ? '' : 'hover:bg-white/[0.04]'
                )}
                style={{
                  color: isActive ? '#111827' : '#6b7280',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full"
                    style={{ background: '#E8A33D' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  size={16}
                  className="shrink-0"
                  style={{ color: isActive ? '#E8A33D' : '#6b7280' }}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t p-2" style={{ borderColor: '#e5e7eb' }}>
        <div
          className="group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[#F1F1EF]"
          style={{ background: '#F8F8F6' }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md text-[11px] font-bold"
            style={{
              background: '#F7F7F5',
              color: '#6b7280',
            }}
          >
            {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : roleInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold" style={{ color: '#111827' }}>
              {user?.name || roleLabel}
            </p>
            <p className="truncate text-[10px]" style={{ color: '#6b7280' }}>
              endow.global
            </p>
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

