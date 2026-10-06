'use client'

import { useUserAvatar } from '@/components/providers/UserAvatarProvider'
import { QuickNavigation } from '@/components/ui/QuickNavigation'
import { authClient, useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, KeyRound, LogOut, Menu, Plus, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const QUICK_NAVIGATION = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Applications', href: '/admin/applications' },
  { label: 'Courses', href: '/admin/courses' },
  { label: 'Universities', href: '/admin/universities' },
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Activity Log', href: '/admin/activity' },
]

interface Props {
  onMenuClick: () => void
}

function StatusDot() {
  return (
    <span className="relative flex h-2 w-2" aria-label="System operational">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{
          background: '#4FD1A5',
          animation: 'status-pulse 3s ease-in-out infinite',
        }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: '#4FD1A5' }}
      />
    </span>
  )
}

export function Topbar({ onMenuClick }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const { image: avatarImage } = useUserAvatar()
  const { data: unreadNotifications = 0 } = trpc.notification.unreadCount.useQuery()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const user = {
    name: session?.user?.name || 'Admin',
    image: avatarImage ?? (session?.user as any)?.image ?? null,
  }
  const initials = (user.name || 'AD')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await authClient.signOut()
    } finally {
      router.push('/login')
    }
  }

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-gray-200 bg-slate-50 px-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <QuickNavigation
          items={QUICK_NAVIGATION}
          placeholder="Quick navigation..."
          className="hidden w-[280px] md:block"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="hidden items-center gap-1 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors hover:opacity-90 lg:flex"
          style={{ background: '#E8A33D', color: '#f8fafc' }}
        >
          <Plus size={13} />
          New
        </button>

        <div className="hidden items-center gap-2 rounded-md border border-gray-200 bg-emerald-500/5 px-3 py-1.5 dark:border-gray-800 sm:flex">
          <StatusDot />
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Systems Normal
          </span>
        </div>

        <button
          onClick={() => router.push('/admin/notifications')}
          className="relative flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-200/50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell size={15} />
          {unreadNotifications > 0 && (
            <span className="absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#F0625B] px-1 text-[9px] font-bold text-white">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="group flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div
              className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              suppressHydrationWarning
            >
              {user?.image ? (
                <img src={user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="hidden text-[13px] font-medium lg:inline">
              {user?.name || 'Admin'}
            </span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                style={{ zIndex: 60 }}
              >
                <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
                  <p className="text-[12px] font-semibold text-gray-900 dark:text-white">Admin</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Platform Management
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/profile')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <User size={14} className="text-gray-500 dark:text-gray-400" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/admin/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <KeyRound size={14} className="text-gray-500 dark:text-gray-400" />
                  Settings
                </button>

                <div className="my-1 border-t border-gray-200 dark:border-gray-800" />

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-[#F0625B] hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                >
                  <LogOut size={14} />
                  {loggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
