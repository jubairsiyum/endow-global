'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

import { DashboardSidebar } from './Sidebar'
import { DashboardTopbar } from './Topbar'
import { mockStudent } from '@/lib/mockData'

interface Props {
  children: React.ReactNode
}

export function DashboardShell({ children }: Props) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Defense in depth: even though middleware protects /dashboard, redirect if no session
  useEffect(() => {
    if (!isPending && !session) {
      const callbackUrl = typeof window !== 'undefined' ? window.location.pathname : '/dashboard'
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    }
  }, [isPending, session, router])

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [children])

  // Close drawer on Esc
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const user = {
    name: session?.user?.name ?? mockStudent.name,
    email: session?.user?.email ?? mockStudent.email,
    initials:
      session?.user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? mockStudent.initials,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7fb] text-gray-900 transition-colors duration-300 dark:bg-[#0b0f19] dark:text-white">
      {/* DESKTOP FULL SIDEBAR */}
      <div className="hidden lg:block">
        <DashboardSidebar variant="full" user={user} />
      </div>

      {/* TABLET ICON RAIL */}
      <div className="hidden md:block lg:hidden">
        <DashboardSidebar variant="rail" user={user} />
      </div>

      {/* MOBILE DRAWER */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}
      <div
        className={`fixed left-0 top-0 z-50 transition-transform duration-300 md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar variant="drawer" user={user} onNavigate={() => setDrawerOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          onMenuClick={() => setDrawerOpen(true)}
          userName={user.name}
          userInitials={user.initials}
          unreadNotifications={mockStudent.unreadMessages}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
