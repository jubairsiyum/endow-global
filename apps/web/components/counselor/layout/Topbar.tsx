'use client'

import { Bell, Menu, Calendar, CheckCheck, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

import { authClient, useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { QuickNavigation } from '@/components/ui/QuickNavigation'
import { useUserAvatar } from '@/components/providers/UserAvatarProvider'

interface Props {
  onMenuClick: () => void
}

function StatusDot() {
  return (
    <span className="relative flex h-2 w-2" aria-label="Active">
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

const QUICK_NAVIGATION = [
  { label: 'Dashboard', href: '/counselor' },
  { label: 'My Students', href: '/counselor/students' },
  { label: 'Applications', href: '/counselor/applications' },
  { label: 'Sessions', href: '/counselor/sessions' },
  { label: 'Settings', href: '/counselor/settings' },
]

export function CounselorTopbar({ onMenuClick }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const { image: avatarImage } = useUserAvatar()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useUtils()
  const { data: notifications } = trpc.notification.getAll.useQuery()
  const markAllRead = trpc.notification.markAllRead.useMutation({
    onSuccess: () => utils.notification.getAll.invalidate(),
  })
  const unread = (notifications ?? []).filter((notification) => !notification.isRead).length

  const user = {
    name: session?.user?.name || 'Counselor',
    image: avatarImage ?? (session?.user as any)?.image ?? null,
  }
  const initials = (user.name || 'CN')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!notificationsRef.current?.contains(target)) setNotificationsOpen(false)
      if (!accountRef.current?.contains(target)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await authClient.signOut()
    } finally {
      router.replace('/login/counselor')
    }
  }

  return (
    <header
      className="flex h-[52px] shrink-0 items-center justify-between border-b px-3"
      style={{ background: '#f8fafc', borderColor: '#e5e7eb' }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md border lg:hidden"
          style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <QuickNavigation items={QUICK_NAVIGATION} placeholder="Quick navigation..." className="hidden w-[300px] md:block" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Next session */}
        <div
          className="hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex"
          style={{ borderColor: '#e5e7eb', background: 'rgba(79, 209, 165, 0.05)' }}
        >
          <Calendar size={13} style={{ color: '#4FD1A5' }} />
          <span className="text-[11px] font-medium" style={{ color: '#4FD1A5' }}>
            Next: 2:30 PM
          </span>
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border hover:bg-white/[0.04]"
            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
            aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={15} />
            {unread > 0 && <span className="absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#F0625B] px-1 text-[9px] font-bold text-white">{unread > 9 ? '9+' : unread}</span>}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-lg border bg-white shadow-lg" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
                <span className="text-xs font-semibold" style={{ color: '#111827' }}>Notifications</span>
                {unread > 0 && <button type="button" onClick={() => markAllRead.mutate()} className="flex items-center gap-1 text-[11px] font-semibold text-[#c41e3a]"><CheckCheck size={12} /> Mark read</button>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {!notifications?.length ? <p className="px-3 py-8 text-center text-xs" style={{ color: '#6b7280' }}>No notifications yet</p> : notifications.map((notification) => (
                  <div key={notification.id} className="border-b px-3 py-2.5 last:border-0" style={{ borderColor: '#f1f5f9', background: notification.isRead ? '#fff' : '#fff7f7' }}>
                    <p className="text-xs font-semibold" style={{ color: '#111827' }}>{notification.title}</p>
                    <p className="mt-0.5 text-[11px]" style={{ color: '#6b7280' }}>{notification.body}</p>
                    <p className="mt-1 text-[10px]" style={{ color: '#9ca3af' }}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setAccountOpen((open) => !open)}
            className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[#F1F1EF]"
            style={{ color: '#111827', background: '#F8F8F6' }}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md text-[10px] font-bold" style={{ background: '#F7F7F5', color: '#6b7280' }} suppressHydrationWarning>
              {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
            </div>
            <span className="hidden text-[13px] font-medium lg:inline">{user?.name || 'Counselor'}</span>
          </button>
          {accountOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border bg-white py-1 shadow-lg" style={{ borderColor: '#e5e7eb' }}>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#F0625B] hover:bg-red-50 disabled:opacity-50"><LogOut size={14} /> {loggingOut ? 'Signing out...' : 'Sign out'}</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

