'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Plus, Search, LogOut, User, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { authClient, useSession } from '@/lib/auth-client'
import { useUserAvatar } from '@/components/providers/UserAvatarProvider'

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
    <header
      className="flex h-[52px] shrink-0 items-center justify-between border-b px-3"
      style={{ background: '#f8fafc', borderColor: '#e5e7eb' }}
    >
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
          className="hidden w-[280px] items-center gap-2 rounded-md border px-3 py-1.5 md:flex"
          style={{ borderColor: '#e5e7eb', background: '#ffffff' }}
        >
          <Search size={14} style={{ color: '#6b7280' }} aria-hidden />
          <input
            type="text"
            placeholder="Search students, courses, universities..."
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#6b7280]/60"
            style={{ color: '#111827' }}
          />
          <kbd
            className="rounded px-1.5 py-0.5 text-[10px]"
            style={{
              background: '#f8fafc',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
            }}
          >
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="hidden items-center gap-1 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors hover:opacity-90 lg:flex"
          style={{ background: '#E8A33D', color: '#f8fafc' }}
        >
          <Plus size={13} />
          New
        </button>

        <div
          className="hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex"
          style={{
            borderColor: '#e5e7eb',
            background: 'rgba(79, 209, 165, 0.05)',
          }}
        >
          <StatusDot />
          <span className="text-[11px] font-medium" style={{ color: '#4FD1A5' }}>
            Systems Normal
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
            12
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="group flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[#F1F1EF]"
            style={{ color: '#111827', background: '#F8F8F6' }}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div
              className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md text-[10px] font-bold"
              style={{
                background: '#F7F7F5',
                color: '#6b7280',
              }}
              suppressHydrationWarning
            >
              {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
            </div>
            <span className="hidden text-[13px] font-medium lg:inline">{user?.name || 'Admin'}</span>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border py-1 shadow-lg"
                style={{
                  background: '#ffffff',
                  borderColor: '#e5e7eb',
                  zIndex: 60,
                }}
              >
                <div
                  className="px-3 py-2 border-b"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: '#111827' }}
                  >
                    Admin
                  </p>
                  <p className="text-[10px]" style={{ color: '#6b7280' }}>
                    Platform Management
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/profile')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-white/[0.04]"
                  style={{ color: '#111827' }}
                >
                  <User size={14} style={{ color: '#6b7280' }} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/admin/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-white/[0.04]"
                  style={{ color: '#111827' }}
                >
                  <KeyRound size={14} style={{ color: '#6b7280' }} />
                  Settings
                </button>

                <div
                  className="my-1 border-t"
                  style={{ borderColor: '#e5e7eb' }}
                />

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-white/[0.04] disabled:opacity-50"
                  style={{ color: '#F0625B' }}
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

