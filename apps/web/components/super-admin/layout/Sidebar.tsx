'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  FileText,
  Users,
  Globe,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  Activity,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const primaryNav = [
  { name: 'Dashboard', href: '/sa', icon: LayoutDashboard },
  { name: 'Branches', href: '/sa/branches', icon: Building2 },
  { name: 'Universities', href: '/sa/universities', icon: GraduationCap },
  { name: 'Courses', href: '/sa/courses', icon: BookOpen },
  { name: 'Applications', href: '/sa/applications', icon: FileText },
  { name: 'Users', href: '/sa/users', icon: Users },
  { name: 'Countries', href: '/sa/countries', icon: Globe },
  { name: 'Activity', href: '/sa/activity', icon: Activity },
]

const secondaryNav = [
  { name: 'Analytics', href: '/sa/analytics', icon: BarChart3 },
  { name: 'Admin Roles', href: '/sa/users', icon: Shield },
  { name: 'Settings', href: '/sa/settings', icon: Settings },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function SASidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r transition-all duration-300',
        collapsed ? 'w-[56px]' : 'w-[220px]'
      )}
      style={{
        background: '#f8fafc',
        borderColor: '#e5e7eb',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(232, 163, 61, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Logo */}
      <div
        className={cn(
          'flex shrink-0 items-center border-b px-3',
          collapsed ? 'h-[52px] justify-center' : 'h-[52px] justify-between'
        )}
        style={{ borderColor: '#e5e7eb' }}
      >
        {!collapsed && (
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ENDOW
            <span style={{ color: '#E8A33D' }}> OPS</span>
          </span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-colors hover:bg-white/[0.06]',
            collapsed && 'rotate-180'
          )}
          style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Super Admin navigation">
        <div className={cn('space-y-0.5', collapsed ? 'px-1.5' : 'px-2')}>
          {primaryNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'group relative flex items-center rounded-lg text-[13px] font-medium transition-colors',
                  collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2',
                  isActive
                    ? ''
                    : 'hover:bg-white/[0.04]'
                )}
                style={{
                  color: isActive ? '#111827' : '#6b7280',
                }}
              >
                {/* Active indicator â€” thin left edge line */}
                {isActive && (
                  <motion.div
                    layoutId="sa-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full"
                    style={{ background: '#E8A33D' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  size={16}
                  className="shrink-0"
                  style={{
                    color: isActive ? '#E8A33D' : '#6b7280',
                  }}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        <div className={cn('mt-4 space-y-0.5', collapsed ? 'px-1.5' : 'px-2')}>
          <div
            className={cn('mb-1', collapsed ? 'px-0' : 'px-3')}
            style={{ color: '#6b7280' }}
          >
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-widest">System</span>
            )}
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'group relative flex items-center rounded-lg text-[13px] font-medium transition-colors',
                  collapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2',
                  isActive
                    ? ''
                    : 'hover:bg-white/[0.04]'
                )}
                style={{
                  color: isActive ? '#111827' : '#6b7280',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sa-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full"
                    style={{ background: '#E8A33D' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  size={16}
                  className="shrink-0"
                  style={{
                    color: isActive ? '#E8A33D' : '#6b7280',
                  }}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section */}
      <div
        className="shrink-0 border-t p-2"
        style={{ borderColor: '#e5e7eb' }}
      >
        <div
          className={cn(
            'flex items-center rounded-lg px-2 py-2',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
          style={{ background: 'rgba(232, 163, 61, 0.05)' }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #E8A33D, #c48b2e)',
              color: '#f8fafc',
            }}
          >
            SA
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold" style={{ color: '#111827' }}>
                Super Admin
              </p>
              <p className="truncate text-[10px]" style={{ color: '#6b7280' }}>
                endow.global
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
