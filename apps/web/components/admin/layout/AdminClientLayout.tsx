'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/admin/layout/Sidebar'
import { Topbar } from '@/components/admin/layout/Topbar'

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6fb] dark:bg-[#0b0f19]">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="shrink-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-5">{children}</main>
      </div>
    </div>
  )
}
