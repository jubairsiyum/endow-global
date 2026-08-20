'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, Menu, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import ThemeToggle from '@/components/ui/ThemeToggle'
import { trpc } from '@/lib/trpc-client'
import { NOTIFICATION_EMOJI } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

interface Props {
  onMenuClick: () => void
  userName: string
  userInitials: string
  userImage?: string | null
}

const navLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Universities', href: '/universities' },
  { label: 'About', href: '/about' },
]

export function StudentHeader({ onMenuClick, userName, userInitials, userImage }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useUtils()
  const { data: notifications, isLoading: notificationsLoading, isError: notificationsError, refetch: refetchNotifications } = trpc.dashboard.notifications.list.useQuery()
  const markAllRead = trpc.dashboard.notifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.dashboard.notifications.list.invalidate()
      utils.dashboard.overview.invalidate()
    },
  })
  const unread = (notifications ?? []).filter((notification: any) => !notification.isRead).length

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    router.push(value ? `/courses?query=${encodeURIComponent(value)}` : '/courses')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-[#12141c]/90">
      <div className="flex h-full items-center gap-2 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open student navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>

        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="Endow Global Education home">
          <Image src="/logo/endoedu.svg" alt="Endow Global Education" width={36} height={36} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" priority />
          <div className="w-fit leading-none">
            <span className="block text-[13px] font-bold tracking-tight text-gray-900 dark:text-white">Endow Global</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">Education</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="hidden min-w-0 max-w-[400px] flex-1 md:mx-4 md:block">
          <label className="flex h-10 items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 transition-colors focus-within:border-rose-500 focus-within:bg-white dark:border-gray-700 dark:bg-[#1a1d25] dark:focus-within:bg-[#12141c]">
            <Search size={16} className="shrink-0 text-gray-400" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, universities..."
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              aria-label="Search courses and universities"
            />
          </label>
        </form>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Student portal links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-[#12141c]" aria-hidden />
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#12141c]">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                  {unread > 0 && (
                    <button type="button" onClick={() => markAllRead.mutate()} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-300">
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>
                <ul className="max-h-[360px] overflow-y-auto">
                  {notificationsLoading ? (
                    <li className="space-y-2 px-4 py-8" role="status" aria-label="Loading notifications">
                      <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                    </li>
                  ) : notificationsError ? (
                    <li className="px-4 py-8 text-center text-sm text-red-600 dark:text-red-300">
                      <p>Notifications are unavailable.</p>
                      <button type="button" onClick={() => refetchNotifications()} className="mt-2 font-semibold underline">Try again</button>
                    </li>
                  ) : (notifications ?? []).length === 0 ? (
                    <li className="px-4 py-10 text-center text-sm text-gray-500">No notifications yet</li>
                  ) : (
                    (notifications ?? []).map((notification: any) => (
                      <li key={notification.id} className={cn('flex gap-3 border-b border-gray-50 px-4 py-3 last:border-0 dark:border-gray-800/60', !notification.isRead && 'bg-rose-50/40 dark:bg-rose-500/5')}>
                        <span className="text-lg" aria-hidden>{NOTIFICATION_EMOJI[notification.type] ?? '🔔'}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{notification.body}</p>
                          <p className="mt-1 text-[10px] text-gray-400">{notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}</p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <ThemeToggle />
          <div className="ml-1 flex items-center gap-2.5 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 dark:border-gray-700">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-600 to-rose-700 text-[11px] font-bold text-white">
              {userImage ? <img src={userImage} alt="" className="h-full w-full object-cover" /> : userInitials}
            </span>
            <span className="hidden max-w-[130px] truncate text-sm font-semibold text-gray-800 xl:block dark:text-gray-200">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
