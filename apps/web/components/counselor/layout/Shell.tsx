'use client'

import { useState, useEffect } from 'react'
import { CounselorSidebar } from './Sidebar'
import { CounselorTopbar } from './Topbar'

interface Props {
  children: React.ReactNode
}

export function CounselorShell({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [children])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0E1220' }}>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      <div className="hidden lg:block">
        <CounselorSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      <div
        className={`fixed left-0 top-0 z-50 transition-transform duration-300 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CounselorSidebar collapsed={false} onToggle={() => setDrawerOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <CounselorTopbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ background: '#0E1220' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
