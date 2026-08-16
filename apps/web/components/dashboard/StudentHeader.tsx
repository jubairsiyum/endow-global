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
}

export function StudentHeader({ onMenuClick, userName, userInitials }: Props) {
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
    <header className="sticky top-0 z-40 border-b border-[#e7e9ee] bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-[#12141c]/95">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open student navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 lg:hidden dark:border-gray-700 dark:text-gray-200"
        >
          <Menu size={19} />
        </button>

        <Link href="/dashboard" className="flex shrink-0 items-center gap-2" aria-label="Student dashboard">
          <Image src="/logo/endoedu.svg" alt="Endow Global Education" width={38} height={38} className="h-9 w-9" priority />
          <span className="hidden text-[17px] font-bold tracking-[-0.04em] text-[#ed1b35] sm:block">endow</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden min-w-0 max-w-[430px] flex-1 md:block">
          <label className="flex h-11 items-center gap-2.5 rounded-full border border-[#c6cad3] bg-[#fbfbfc] px-4 transition-colors focus-within:border-[#7c3aed] dark:border-gray-700 dark:bg-[#1a1d25]">
            <Search size={17} className="shrink-0 text-gray-500" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, universities..."
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white"
              aria-label="Search courses and universities"
            />
          </label>
        </form>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Student portal links">
          <Link href="/courses" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            Courses
          </Link>
          <Link href="/universities" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            Countries
          </Link>
          <Link href="/about" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Bell size={19} />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ed1b35]" aria-hidden />}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#12141c]">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
                  {unread > 0 && (
                    <button type="button" onClick={() => markAllRead.mutate()} className="inline-flex items-center gap-1 text-xs font-semibold text-[#6d28d9] hover:underline">
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
                      <li key={notification.id} className={cn('flex gap-3 border-b border-gray-50 px-4 py-3 last:border-0 dark:border-gray-800/60', !notification.isRead && 'bg-red-50/40 dark:bg-[#2a1114]/30')}>
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
          <div className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-2 dark:border-gray-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#263238] text-xs font-bold text-white">{userInitials}</span>
            <span className="hidden max-w-[130px] truncate text-sm font-semibold text-gray-800 xl:block dark:text-gray-200">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
