'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-client'
import { useUserAvatar } from '@/components/providers/UserAvatarProvider'

const navItems = [
  { name: 'Dashboard', href: '/counselor', icon: LayoutDashboard },
  { name: 'My Students', href: '/counselor/students', icon: Users },
  { name: 'Applications', href: '/counselor/applications', icon: FileText },
  { name: 'Sessions', href: '/counselor/sessions', icon: Calendar },
  { name: 'Messages', href: '/counselor/messages', icon: MessageSquare },
  { name: 'Settings', href: '/counselor/settings', icon: Settings },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function CounselorSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { image: avatarImage } = useUserAvatar()

  const user = {
    name: session?.user?.name || 'Counselor',
    image: avatarImage ?? (session?.user as any)?.image ?? null,
  }
  const initials = (user.name || 'CN')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r transition-all duration-300',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
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
        className={cn(
          'flex shrink-0 items-center border-b px-3',
          collapsed ? 'h-[52px] justify-center' : 'h-[52px] justify-between'
        )}
        style={{ borderColor: '#e5e7eb' }}
      >
        {!collapsed && (
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            COUNSELOR
            <span style={{ color: '#E8A33D' }}> HUB</span>
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-colors hover:bg-white/[0.06]',
            collapsed && 'rotate-180'
          )}
          style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Counselor navigation">
        <div className={cn('space-y-0.5', collapsed ? 'px-1.5' : 'px-2')}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'group relative flex items-center rounded-lg text-[13px] font-medium transition-colors',
                  collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2',
                  isActive ? '' : 'hover:bg-white/[0.04]'
                )}
                style={{
                  color: isActive ? '#111827' : '#6b7280',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="counselor-active"
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
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t p-2" style={{ borderColor: '#e5e7eb' }}>
        <div
          className={cn(
            'flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-[#F1F1EF]',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
          style={{ background: '#F8F8F6' }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md text-[11px] font-bold"
            style={{
              background: '#F7F7F5',
              color: '#6b7280',
            }}
            suppressHydrationWarning
          >
            {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold" style={{ color: '#111827' }}>
                {user?.name || 'Counselor'}
              </p>
              <p className="truncate text-[10px]" style={{ color: '#6b7280' }}>
                24 students
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

