'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  FileText,
  FolderOpen,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Settings,
} from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutGrid
}

const navItems: NavItem[] = [
  { name: 'Overview',      href: '/dashboard',              icon: LayoutGrid },
  { name: 'My Application',href: '/dashboard/application',  icon: FileText },
  { name: 'Documents',     href: '/dashboard/documents',    icon: FolderOpen },
  { name: 'Messages',      href: '/dashboard/messages',     icon: MessageSquare },
  { name: 'Appointments',  href: '/dashboard/appointments', icon: Calendar },
  { name: 'Settings',      href: '/dashboard/settings',     icon: Settings },
]

interface Props {
  onNavigate?: () => void
  /** 'full' (≥1024px), 'rail' (md–lg), 'drawer' (<md) */
  variant: 'full' | 'rail' | 'drawer'
  user?: {
    name: string
    email: string
    initials: string
  }
}

export function DashboardSidebar({ onNavigate, variant, user }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const isFull = variant === 'full'
  const isRail = variant === 'rail'
  const compact = !isFull

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
    } finally {
      router.push('/login')
    }
  }

  return (
    <aside
      aria-label="Student dashboard navigation"
      className={cn(
        'relative flex h-screen flex-col overflow-y-auto border-r border-gray-200 bg-white',
        isFull ? 'w-[260px]' : 'w-[72px]',
      )}
    >
      {/* LOGO */}
      <div
        className={cn(
          'flex shrink-0 items-center border-b border-gray-100',
          isFull ? 'h-[68px] px-5' : 'h-[68px] justify-center px-2',
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2"
          aria-label="Endow Global Education"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#C41E3A] to-[#A01830] text-sm font-black text-white shadow-sm">
            E
          </span>
          {isFull && (
            <span className="font-heading text-base font-bold tracking-tight text-gray-900">
              Endow
              <span className="text-primary"> Global</span>
            </span>
          )}
        </Link>
      </div>

      {/* NAV */}
      <nav
        className={cn(
          'mt-3 flex-1 space-y-1 overflow-y-auto',
          isFull ? 'px-3' : 'px-2',
        )}
        aria-label="Primary"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              title={compact ? item.name : undefined}
              className={cn(
                'group relative flex items-center rounded-2xl text-sm font-medium transition-all duration-300',
                isFull ? 'gap-3 px-3 py-2.5' : 'h-11 w-full justify-center',
                isActive
                  ? 'text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={variant === 'full' ? 'sidebar-active-pill' : undefined}
                  className="absolute inset-0 rounded-2xl bg-red-50"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={18}
                className={cn(
                  'relative z-10 shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700',
                )}
                aria-hidden
              />
              {isFull && (
                <span className="relative z-10 truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* USER + SIGN OUT */}
      <div
        className={cn(
          'shrink-0 border-t border-gray-100 p-2',
        )}
      >
        {user && isFull && (
          <div className="mb-2 flex items-center gap-2.5 rounded-2xl bg-gray-50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C41E3A] to-[#A01830] text-xs font-bold text-white">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          title={compact ? 'Sign out' : undefined}
          className={cn(
            'group flex w-full items-center rounded-2xl text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-primary',
            isFull ? 'gap-3 px-3 py-2.5' : 'h-11 justify-center',
          )}
        >
          <LogOut
            size={18}
            className="shrink-0 text-gray-500 group-hover:text-primary"
            aria-hidden
          />
          {isFull && <span>Sign out</span>}
        </button>
      </div>

      <span className="sr-only">Endow Global Education</span>
    </aside>
  )
}
