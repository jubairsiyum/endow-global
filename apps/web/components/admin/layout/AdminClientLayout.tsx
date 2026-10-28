'use client'

import { Sidebar } from '@/components/admin/layout/Sidebar'
import { Topbar } from '@/components/admin/layout/Topbar'
import { UserRole } from '@endow/types'
import { useState } from 'react'

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
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-gray-100 print:h-auto print:overflow-visible print:bg-white print:text-black">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 print:hidden lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Desktop sidebar — always visible on screen, hidden on print */}
      <div className="hidden lg:flex lg:shrink-0 print:hidden">
        <Sidebar userRole={userRole} permissions={permissions} />
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 transition-transform duration-300 print:hidden lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar userRole={userRole} permissions={permissions} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible print:h-auto">
        <div className="shrink-0 print:hidden">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            userRole={userRole}
            permissions={permissions}
          />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-5 print:overflow-visible print:p-0 print:m-0 print:h-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
