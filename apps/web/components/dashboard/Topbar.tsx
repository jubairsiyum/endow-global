'use client'

import { Bell, Menu, Search } from 'lucide-react'

import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

interface Props {
  onMenuClick: () => void
  userName: string
  userInitials: string
  unreadNotifications?: number
}

export function DashboardTopbar({
  onMenuClick,
  userName,
  userInitials,
  unreadNotifications = 0,
}: Props) {
  return (
    <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors duration-300 dark:border-gray-800 dark:bg-[#1a1d25] lg:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2a2d38] lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-[#222530] md:flex md:w-[300px]">
          <Search size={15} className="text-gray-400" aria-hidden />
          <input
            type="text"
            placeholder="Search courses, universities, docs…"
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />
          <span className="hidden rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-400 lg:inline">
            ⌘K
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2a2d38]"
        >
          <Bell size={17} />
          {unreadNotifications > 0 && (
            <span
              className={cn(
                'absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white'
              )}
            >
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        <ThemeToggle />

        <div className="flex items-center gap-2.5 rounded-2xl border border-transparent py-1 pl-1 pr-2 transition-all hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-[#222530]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C41E3A] to-[#A01830] text-xs font-bold text-white">
            {userInitials}
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">
              {userName}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Student</p>
          </div>
        </div>
      </div>
    </header>
  )
}
