'use client'

import { useState, useEffect, useCallback } from 'react'
import { SASidebar } from './Sidebar'
import { SATopbar } from './Topbar'

interface Props {
  children: React.ReactNode
}

export function SuperAdminShell({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [children])

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    if (drawerOpen) {
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  return (
    <div
      className="flex h-screen overflow-hidden sa-theme"
      style={{ background: '#0E1220' }}
    >
      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SASidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 transition-transform duration-300 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SASidebar
          collapsed={false}
          onToggle={() => setDrawerOpen(false)}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <SATopbar onMenuClick={() => setDrawerOpen(true)} />
        <main
          className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6"
          style={{ background: '#0E1220' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
