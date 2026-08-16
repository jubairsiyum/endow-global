'use client'

import Link from 'next/link'
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

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutGrid
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { name: 'My Application', href: '/dashboard/application', icon: FileText },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
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
  const compact = !isFull
  const isDrawer = variant === 'drawer'

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
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
        'relative flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-[#12141c]',
        isDrawer ? 'h-screen' : 'sticky top-[76px] h-[calc(100vh-76px)] self-start',
        isFull ? 'w-[260px]' : 'w-[72px]'
      )}
    >
      {user && isFull && (
        <div className="mx-3 mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#263238] text-sm font-bold text-white">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">Student account</p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            onClick={onNavigate}
            className="mt-3 block rounded-xl bg-[#f4f1ff] px-3 py-2 text-center text-xs font-bold text-[#6425c8] transition-colors hover:bg-[#ebe5ff] dark:bg-[#2c2147] dark:text-[#c4aaff] dark:hover:bg-[#39295a]"
          >
            Complete your profile
          </Link>
        </div>
      )}

      {/* NAV */}
      <nav
        className={cn(
          'flex-1 space-y-1 overflow-hidden',
          isDrawer ? 'pt-6' : 'pt-6',
          isFull ? 'px-3' : 'px-2'
        )}
        aria-label="Primary"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)

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
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1a1d25] dark:hover:text-white'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={variant === 'full' ? 'sidebar-active-pill' : undefined}
                  className="absolute inset-0 rounded-2xl bg-red-50 dark:bg-[#2a1114]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={18}
                className={cn(
                  'relative z-10 shrink-0 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                )}
                aria-hidden
              />
              {isFull && <span className="relative z-10 truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* USER + SIGN OUT */}
      <div className={cn('shrink-0 border-t border-gray-100 p-2 dark:border-gray-800')}>
        {user && isFull && (
          <div className="mb-2 flex items-center gap-2.5 rounded-2xl bg-gray-50 px-3 py-2.5 dark:bg-[#1a1d25]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C41E3A] to-[#A01830] text-xs font-bold text-white">
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          title={compact ? 'Sign out' : undefined}
          className={cn(
            'group flex w-full items-center rounded-2xl text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-primary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-[#2a1114]',
            isFull ? 'gap-3 px-3 py-2.5' : 'h-11 justify-center'
          )}
        >
          {isSigningOut ? (
            <Spinner size={18} className="shrink-0 text-primary" />
          ) : (
            <LogOut
              size={18}
              className="shrink-0 text-gray-500 group-hover:text-primary dark:text-gray-400"
              aria-hidden
            />
          )}
          {isFull && <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>}
        </button>
      </div>

      <span className="sr-only">Endow Global Education</span>
    </aside>
  )
}
