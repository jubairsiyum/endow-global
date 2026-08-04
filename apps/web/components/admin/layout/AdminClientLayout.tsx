'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/admin/layout/Sidebar'
import { Topbar } from '@/components/admin/layout/Topbar'
import { UserRole } from '@endow/types'

export function AdminClientLayout({
  children,
  userRole,
}: {
  children: React.ReactNode
  userRole: UserRole
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0E1220' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <Sidebar userRole={userRole} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-5">{children}</main>
      </div>
    </div>
  )
}
