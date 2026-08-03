'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function SATopbar({ onMenuClick }: Props) {
  return (
    <header
      className="flex h-[52px] shrink-0 items-center justify-between border-b px-3"
      style={{ background: '#0E1220', borderColor: '#262C42' }}
    >
      {/* Left side */}
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
          className="hidden w-[320px] items-center gap-2 rounded-md border px-3 py-1.5 md:flex"
          style={{ borderColor: '#262C42', background: '#161B2E' }}
        >
          <Search size={14} style={{ color: '#8890A8' }} aria-hidden />
          <input
            type="text"
            placeholder="Search branches, universities, applications..."
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

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Live status indicator */}
        <div
          className="hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex"
          style={{ borderColor: '#262C42', background: 'rgba(79, 209, 165, 0.05)' }}
        >
          <StatusDot />
          <span className="text-[11px] font-medium" style={{ color: '#4FD1A5' }}>
            Systems Normal
          </span>
        </div>

        {/* Notifications */}
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
            3
          </span>
        </button>

        {/* User menu */}
        <button
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/[0.04]"
          style={{ color: '#E8EAF2' }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #E8A33D, #c48b2e)',
              color: '#0E1220',
            }}
          >
            SA
          </div>
          <span className="hidden text-[13px] font-medium lg:inline">Super Admin</span>
        </button>
      </div>
    </header>
  )
}
