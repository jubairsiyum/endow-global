'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Settings,
} from 'lucide-react'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { cn } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

interface NavItem {
  name: string
  href: string
  icon: typeof LayoutGrid
}

const primaryNav: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { name: 'My Application', href: '/dashboard/application', icon: FileText },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
]

const accountNav: NavItem[] = [
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

  const { data: conversations } = trpc.dashboard.messages.conversations.useQuery()
  const unreadMessages = (conversations ?? []).reduce((sum: number, conversation: any) => sum + (conversation.unread ?? 0), 0)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await authClient.signOut()
    } finally {
      router.push('/login')
    }
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const isMessages = item.href === '/dashboard/messages'

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        title={compact ? item.name : undefined}
        className={cn(
          'group relative flex items-center rounded-xl text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600',
          isFull ? 'h-10 gap-3 px-3' : 'h-11 w-full justify-center',
          active
            ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white dark:active:bg-gray-800'
        )}
      >
        {active && (
          <motion.span
            layoutId={variant === 'full' ? 'sidebar-active-bar' : undefined}
            className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full bg-rose-600"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative flex shrink-0 items-center justify-center">
          <Icon
            size={20}
            strokeWidth={active ? 2.2 : 2}
            className={cn(
              'transition-colors',
              active
                ? 'text-rose-600 dark:text-rose-300'
                : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
            )}
            aria-hidden
          />
          {isMessages && unreadMessages > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </span>
        {isFull && <span className="relative truncate">{item.name}</span>}
        {isFull && isMessages && unreadMessages > 0 && (
          <span className="relative ml-auto text-[10px] font-bold text-rose-600">{unreadMessages} new</span>
        )}
      </Link>
    )
  }

  return (
    <aside
      aria-label="Student dashboard navigation"
      className={cn(
        'relative flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-[#12141c]',
        isDrawer ? 'h-screen' : 'sticky top-[64px] h-[calc(100vh-64px)] self-start',
        isFull ? 'w-[248px]' : 'w-[72px]'
      )}
    >
      {/* Identity (drawer only — desktop identity lives in the footer) */}
      {isDrawer && user && (
        <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-sm font-bold text-white">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto',
          isDrawer ? 'p-3' : 'px-3 pt-4',
          !isFull && !isDrawer && 'px-2.5'
        )}
        aria-label="Primary"
      >
        {isFull && (
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            Menu
          </p>
        )}
        <div className={cn('space-y-1', isFull && 'mb-4')}>
          {primaryNav.map(renderItem)}
        </div>

        {isFull && (
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            Account
          </p>
        )}
        <div className="space-y-1">{accountNav.map(renderItem)}</div>
      </nav>

      {/* USER + SIGN OUT */}
      <div className="shrink-0 border-t border-gray-100 p-3 dark:border-gray-800">
        {user && isFull && (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-xs font-bold text-white">
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
            'group flex w-full items-center rounded-xl text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 dark:text-gray-400 dark:hover:bg-gray-800/70 dark:hover:text-white',
            isFull ? 'h-10 gap-3 px-3' : 'h-11 justify-center'
          )}
        >
          {isSigningOut ? (
            <Spinner size={18} className="shrink-0 text-rose-600" />
          ) : (
            <LogOut
              size={20}
              strokeWidth={2}
              className="shrink-0 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
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
