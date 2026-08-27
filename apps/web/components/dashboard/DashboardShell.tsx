'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

import { DashboardSidebar } from './Sidebar'
import { StudentHeader } from './StudentHeader'
import { Footer } from '@/components/layout/Footer'
import { useUserAvatar } from '@/components/providers/UserAvatarProvider'

interface Props {
  children: React.ReactNode
}

export function DashboardShell({ children }: Props) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { image: avatarImage } = useUserAvatar()
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
    image: avatarImage ?? (session?.user as { image?: string | null } | undefined)?.image ?? null,
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
      {/* Fixed header */}
      <StudentHeader
        onMenuClick={() => setDrawerOpen(true)}
        userName={user.name}
        userInitials={user.initials}
        userImage={user.image}
      />

      {/* Fixed desktop full sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar variant="full" user={user} />
      </div>

      {/* Fixed tablet icon rail */}
      <div className="hidden md:block lg:hidden">
        <DashboardSidebar variant="rail" user={user} />
      </div>

      {/* Mobile drawer */}
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

      {/* Content: offset below fixed header and right of fixed sidebar */}
      <div className="pt-16">
        <div className="flex min-h-[calc(100vh-64px)] flex-col md:pl-[72px] lg:pl-[248px]">
          <main className="flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  )
}
