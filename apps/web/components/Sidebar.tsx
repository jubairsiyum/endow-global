'use client'

import { useState } from 'react'
import Link from 'next/link'

type MenuItem = {
  id: string
  label: string
  href: string
  badge?: number
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'explore', label: 'Explore', href: '/explore' },
  { id: 'match', label: 'My Match', href: '/match' },
  { id: 'shortlist', label: 'Shortlist', href: '/shortlist' },
  { id: 'applications', label: 'Applications', href: '/applications' },
  { id: 'sessions', label: 'Sessions', href: '/sessions' },
  { id: 'messages', label: 'Messages', href: '/messages', badge: 3 },
  { id: 'referral', label: 'Refer & Earn', href: '/referral' },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-gray-200 bg-white px-4 py-6">
      {/* Logo/Branding - Optional */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Endow</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id
          const hasNotification = item.badge && item.badge > 0

          return (
            <Link key={item.id} href={item.href}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 font-semibold text-red-600'
                    : 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Left dot indicator */}
                <div className="flex flex-1 items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-400'}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>

                {/* Right notification badge */}
                {hasNotification && (
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                    {item.badge}
                  </div>
                )}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Footer section - Optional */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900">
          <div className="h-2 w-2 rounded-full bg-gray-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
