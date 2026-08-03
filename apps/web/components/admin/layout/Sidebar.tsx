'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  Star,
  BookOpen,
  UserCog,
  Globe,
  Layers,
  Award,
  Mail,
  Shield,
  Activity,
  DollarSign,
} from 'lucide-react'
import { UserRole } from '@endow/types'
import { cn } from '@/lib/utils'

const adminMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Students', icon: Users, href: '/admin/students' },
  { name: 'Counselors', icon: UserCog, href: '/admin/counselors' },
  { name: 'Applications', icon: FileText, href: '/admin/applications' },
  { name: 'Documents', icon: FolderOpen, href: '/admin/documents' },
  { name: 'Universities', icon: GraduationCap, href: '/admin/universities' },
  { name: 'Courses', icon: BookOpen, href: '/admin/courses' },
  { name: 'Departments', icon: Layers, href: '/admin/departments' },
  { name: 'Scholarships', icon: Award, href: '/admin/scholarships' },
  { name: 'Countries', icon: Globe, href: '/admin/countries' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { name: 'Testimonials', icon: Star, href: '/admin/testimonials' },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Newsletters', icon: Mail, href: '/admin/newsletters' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
]

const superAdminExtraItems = [
  { name: 'Admin Management', icon: Shield, href: '/admin/admins' },
  { name: 'System Activity', icon: Activity, href: '/admin/activity' },
  { name: 'Revenue', icon: DollarSign, href: '/admin/revenue' },
]

interface SidebarProps {
  userRole: UserRole
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN

  const menuItems = isSuperAdmin
    ? [...adminMenuItems.slice(0, 15), ...superAdminExtraItems, adminMenuItems[15]]
    : adminMenuItems

  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Admin'
  const roleInitials = isSuperAdmin ? 'SA' : 'AD'

  return (
    <aside
      className="relative flex h-screen w-[220px] flex-col border-r"
      style={{ background: '#0E1220', borderColor: '#262C42' }}
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
        style={{ borderColor: '#262C42' }}
      >
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}
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
                  color: isActive ? '#E8EAF2' : '#8890A8',
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
                  style={{ color: isActive ? '#E8A33D' : '#8890A8' }}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t p-2" style={{ borderColor: '#262C42' }}>
        <div
          className="flex items-center gap-2.5 rounded-lg px-2 py-2"
          style={{ background: 'rgba(232, 163, 61, 0.05)' }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
            style={{
              background: isSuperAdmin
                ? 'linear-gradient(135deg, #E8A33D, #c48b2e)'
                : 'linear-gradient(135deg, #E8A33D, #c48b2e)',
              color: '#0E1220',
            }}
          >
            {roleInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold" style={{ color: '#E8EAF2' }}>
              {roleLabel}
            </p>
            <p className="truncate text-[10px]" style={{ color: '#8890A8' }}>
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
