'use client'

import { Search, Bell, Menu, Calendar } from 'lucide-react'

import { useSession } from '@/lib/auth-client'
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

export function CounselorTopbar({ onMenuClick }: Props) {
  const { data: session } = useSession()
  const { image: avatarImage } = useUserAvatar()

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

        <div
          className="hidden w-[300px] items-center gap-2 rounded-md border px-3 py-1.5 md:flex"
          style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
        >
          <Search size={14} style={{ color: '#6b7280' }} aria-hidden />
          <input
            type="text"
            placeholder="Search students, applications..."
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#6b7280]/60"
            style={{ color: '#111827' }}
          />
          <kbd
            className="rounded px-1.5 py-0.5 text-[10px]"
            style={{ background: '#f8fafc', color: '#6b7280', border: '1px solid #e5e7eb' }}
          >
            Ctrl+K
          </kbd>
        </div>
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

        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md border hover:bg-white/[0.04]"
          style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span
            className="absolute right-1 top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[9px] font-bold"
            style={{ background: '#F0625B', color: '#fff' }}
          >
            5
          </span>
        </button>

        <button
          className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[#F1F1EF]"
          style={{ color: '#111827', background: '#F8F8F6' }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md text-[10px] font-bold"
            style={{
              background: '#F7F7F5',
              color: '#6b7280',
            }}
          >
            {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
          </div>
          <span className="hidden text-[13px] font-medium lg:inline">{user?.name || 'Counselor'}</span>
        </button>
      </div>
    </header>
  )
}

