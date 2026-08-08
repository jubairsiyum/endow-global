'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, Trash2, RefreshCw, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'

const ROLES = ['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN'] as const

const roleColors: Record<string, 'route' | 'success' | 'alert' | 'neutral'> = {
  SUPER_ADMIN: 'alert',
  ADMIN: 'route',
  COUNSELOR: 'success',
  STUDENT: 'neutral',
}

export default function SAUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const limit = 50

  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.admin.super.getAllUsers.useQuery({
    search: search || undefined,
    role: roleFilter as any,
    limit,
    offset: page * limit,
  })

  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
    },
  })

  const deleteUser = trpc.admin.super.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
    },
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 1

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-[20px] font-bold tracking-tight"
            style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            User Management
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
            Manage roles and permissions for all platform users
          </p>
        </div>
        <SABadge variant="route">
          <Shield size={11} />
          {data?.total ?? 0} users
        </SABadge>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="w-[300px]">
          <SAInput
            placeholder="Search by name or email..."
            icon={<Search size={14} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {([undefined, ...ROLES] as (string | undefined)[]).map((r) => (
            <button
              key={r ?? 'all'}
              onClick={() => { setRoleFilter(r); setPage(0) }}
              className="rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                background: roleFilter === r ? 'rgba(232, 163, 61, 0.12)' : 'transparent',
                color: roleFilter === r ? '#E8A33D' : '#6b7280',
                border: `1px solid ${roleFilter === r ? 'rgba(232, 163, 61, 0.2)' : '#e5e7eb'}`,
              }}
            >
              {r ?? 'All'}
            </button>
          ))}
        </div>
        <SAButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch('')
            setRoleFilter(undefined)
            setPage(0)
            utils.admin.super.getAllUsers.invalidate()
          }}
        >
          <RefreshCw size={12} />
          Reset
        </SAButton>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="overflow-hidden rounded-xl border"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2"
              style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }}
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <AlertTriangle size={28} style={{ color: '#F0625B' }} />
            <p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>
              Failed to load users
            </p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.super.getAllUsers.invalidate()}>
              Retry
            </SAButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#ffffff' }}>
                  {['User', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
                {(data?.users ?? []).map((user: any) => (
                  <tr key={user.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
                          style={{
                            background: user.role === 'SUPER_ADMIN'
                              ? 'linear-gradient(135deg, #F0625B, #d94646)'
                              : 'linear-gradient(135deg, #E8A33D, #c48b2e)',
                            color: '#fff',
                          }}
                        >
                          {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: '#111827' }}>
                          {user.name || 'Unnamed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => {
                          if (e.target.value === user.role) return
                          if (user.role === 'SUPER_ADMIN' && !confirm('Are you sure you want to demote the Super Admin?')) return
                          updateRole.mutate({ userId: user.id, role: e.target.value as any })
                        }}
                        className="rounded-md border px-2 py-1 text-[12px] font-medium outline-none cursor-pointer"
                        style={{
                          background: '#f8fafc',
                          borderColor: '#e5e7eb',
                          color: '#E8A33D',
                        }}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} style={{ background: '#ffffff', color: '#111827' }}>
                            {r.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <SABadge variant={user.emailVerified ? 'success' : 'warning'} dot>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </SABadge>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <SATooltip content="Delete user">
                        <button
                          onClick={() => {
                            if (!confirm(`Delete user ${user.email}? This action cannot be undone.`)) return
                            deleteUser.mutate({ userId: user.id })
                          }}
                          disabled={user.role === 'SUPER_ADMIN'}
                          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[#F0625B]/10 disabled:opacity-30"
                          style={{ color: '#F0625B' }}
                          aria-label="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </SATooltip>
                    </td>
                  </tr>
                ))}
                {(!data?.users || data.users.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <p className="text-[13px]" style={{ color: '#6b7280' }}>
                        {search || roleFilter ? 'No users match your filters' : 'No users found'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > 0 && (
          <div
            className="flex items-center justify-between border-t px-4 py-2.5"
            style={{ borderColor: '#e5e7eb' }}
          >
            <span className="text-[12px]" style={{ color: '#6b7280' }}>
              Showing{' '}
              <span style={{ color: '#111827', fontFamily: "'JetBrains Mono', monospace" }}>
                {page * limit + 1}–{Math.min((page + 1) * limit, data.total)}
              </span>{' '}
              of{' '}
              <span style={{ color: '#111827', fontFamily: "'JetBrains Mono', monospace" }}>
                {data.total}
              </span>
            </span>
            <div className="flex items-center gap-1">
              <SAButton variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </SAButton>
              <span className="text-[12px] px-2" style={{ color: '#6b7280' }}>
                {page + 1} / {totalPages}
              </span>
              <SAButton variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </SAButton>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
