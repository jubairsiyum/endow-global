'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Plus, Search, LogOut, User, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { authClient } from '@/lib/auth-client'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    if (menuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen])

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
      style={{ background: '#0E1220', borderColor: '#262C42' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md border lg:hidden"
          style={{ borderColor: '#262C42', color: '#8890A8' }}
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <div
          className="hidden w-[280px] items-center gap-2 rounded-md border px-3 py-1.5 md:flex"
          style={{ borderColor: '#262C42', background: '#161B2E' }}
        >
          <Search size={14} style={{ color: '#8890A8' }} aria-hidden />
          <input
            type="text"
            placeholder="Search students, courses, universities..."
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#8890A8]/60"
            style={{ color: '#E8EAF2' }}
          />
          <kbd
            className="rounded px-1.5 py-0.5 text-[10px]"
            style={{
              background: '#0E1220',
              color: '#8890A8',
              border: '1px solid #262C42',
            }}
          >
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="hidden items-center gap-1 rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors hover:opacity-90 lg:flex"
          style={{ background: '#E8A33D', color: '#0E1220' }}
        >
          <Plus size={13} />
          New
        </button>

        <div
          className="hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex"
          style={{
            borderColor: '#262C42',
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
          style={{ borderColor: '#262C42', color: '#8890A8' }}
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
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/[0.04]"
            style={{ color: '#E8EAF2' }}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #E8A33D, #c48b2e)',
                color: '#0E1220',
              }}
            >
              AD
            </div>
            <span className="hidden text-[13px] font-medium lg:inline">Admin</span>
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
                  background: '#161B2E',
                  borderColor: '#262C42',
                  zIndex: 60,
                }}
              >
                <div
                  className="px-3 py-2 border-b"
                  style={{ borderColor: '#262C42' }}
                >
                  <p
                    className="text-[12px] font-semibold"
                    style={{ color: '#E8EAF2' }}
                  >
                    Admin
                  </p>
                  <p className="text-[10px]" style={{ color: '#8890A8' }}>
                    Platform Management
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/profile')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-white/[0.04]"
                  style={{ color: '#E8EAF2' }}
                >
                  <User size={14} style={{ color: '#8890A8' }} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    router.push('/admin/settings')
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-white/[0.04]"
                  style={{ color: '#E8EAF2' }}
                >
                  <KeyRound size={14} style={{ color: '#8890A8' }} />
                  Settings
                </button>

                <div
                  className="my-1 border-t"
                  style={{ borderColor: '#262C42' }}
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
