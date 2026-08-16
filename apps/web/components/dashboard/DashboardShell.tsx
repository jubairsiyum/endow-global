'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

import { DashboardSidebar } from './Sidebar'
import { StudentHeader } from './StudentHeader'

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const user = {
    name: session?.user?.name ?? 'Student',
    email: session?.user?.email ?? '',
    initials:
      session?.user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'ST',
  }

  return (
    <>
      <StudentHeader
        onMenuClick={() => setDrawerOpen(true)}
        userName={user.name}
        userInitials={user.initials}
      />
      <div className="flex flex-1">
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
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </>
  )
}
