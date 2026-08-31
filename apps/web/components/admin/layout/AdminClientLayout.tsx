'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/admin/layout/Sidebar'
import { Topbar } from '@/components/admin/layout/Topbar'
import { UserRole } from '@endow/types'

export function AdminClientLayout({
  children,
  userRole,
  permissions,
}: {
  children: React.ReactNode
  userRole: UserRole
  permissions?: string[]
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-hidden={sidebarOpen ? undefined : false}
      >
        <Sidebar userRole={userRole} permissions={permissions} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-5">{children}</main>
      </div>
    </div>
  )
}
