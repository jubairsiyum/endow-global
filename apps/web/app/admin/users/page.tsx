'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shield, Trash2, RefreshCw, AlertTriangle, KeyRound, UserPlus, X, Check } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { SATooltip } from '@/components/super-admin/shared/SATooltip'
import { PermissionEditor } from '@/components/admin/PermissionEditor'
import { toast } from 'sonner'

const ROLES = ['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN'] as const

export default function SAUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const limit = 50

  // Permission editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingPerms, setEditingPerms] = useState<string[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', perms: [] as string[] })

  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.admin.super.getAllUsers.useQuery({
    search: search || undefined,
    role: roleFilter as any,
    limit,
    offset: page * limit,
  })

  const { data: permData } = trpc.admin.super.getUserPermissions.useQuery(
    { userId: editingUserId! },
    { enabled: !!editingUserId }
  )

  useEffect(() => {
    if (permData?.permissions) setEditingPerms(permData.permissions)
  }, [permData])

  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
      toast.success('Role updated')
    },
    onError: (e) => toast.error(e.message),
  })

  const deleteUser = trpc.admin.super.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
      toast.success('User deleted')
    },
    onError: (e) => toast.error(e.message),
  })

  const updatePerms = trpc.admin.super.updatePermissions.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      setEditingUserId(null)
      toast.success('Permissions updated')
    },
    onError: (e) => toast.error(e.message),
  })

  const createStaff = trpc.admin.super.createStaff.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      setShowCreate(false)
      setCreateForm({ name: '', email: '', password: '', perms: [] })
      toast.success('Staff created')
    },
    onError: (e) => toast.error(e.message),
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 1

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
            User Management
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>
            Manage roles and module-based permissions (RBAC) for all platform users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SABadge variant="route">
            <Shield size={11} />
            {data?.total ?? 0} users
          </SABadge>
          <SAButton variant="primary" size="sm" onClick={() => setShowCreate(true)}>
            <UserPlus size={14} /> Create Staff
          </SAButton>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="flex flex-wrap items-center gap-3">
        <div className="w-[300px]">
          <SAInput placeholder="Search by name or email..." icon={<Search size={14} />} value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} />
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
        <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); setRoleFilter(undefined); setPage(0); utils.admin.super.getAllUsers.invalidate() }}>
          <RefreshCw size={12} /> Reset
        </SAButton>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="overflow-hidden rounded-xl border" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <AlertTriangle size={28} style={{ color: '#F0625B' }} />
            <p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load users</p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.super.getAllUsers.invalidate()}>Retry</SAButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#ffffff' }}>
                  {['User', 'Email', 'Role', 'Modules', 'Verified', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr]:border-t [&_tr]:border-[#e5e7eb]/50">
                {(data?.users ?? []).map((user: any) => {
                  const perms: string[] = (() => {
                    const raw = user.permissions
                    if (Array.isArray(raw)) return raw
                    if (typeof raw === 'string') {
                      try { const p = JSON.parse(raw); if (Array.isArray(p)) return p } catch {}
                    }
                    return []
                  })()
                  const isStaff = user.role === 'ADMIN'
                  const isSuper = user.role === 'SUPER_ADMIN'
                  return (
                    <tr key={user.id} className="transition-colors hover:bg-[#E8A33D]/[0.04]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: isSuper ? 'linear-gradient(135deg, #F0625B, #d94646)' : 'linear-gradient(135deg, #E8A33D, #c48b2e)', color: '#fff' }}>
                            {user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                          </div>
                          <span className="text-[13px] font-medium" style={{ color: '#111827' }}>{user.name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            if (e.target.value === user.role) return
                            if (user.role === 'SUPER_ADMIN' && !confirm('Are you sure you want to demote the Super Admin?')) return
                            updateRole.mutate({ userId: user.id, role: e.target.value as any })
                          }}
                          className="rounded-md border px-2 py-1 text-[12px] font-medium outline-none cursor-pointer"
                          style={{ background: '#f8fafc', borderColor: '#e5e7eb', color: '#E8A33D' }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r} style={{ background: '#ffffff', color: '#111827' }}>{r.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {isSuper ? (
                          <SABadge variant="alert" dot>All access</SABadge>
                        ) : isStaff ? (
                          <div className="flex items-center gap-1.5">
                            <SABadge variant={perms.length ? 'route' : 'warning'}>{perms.length ? `${perms.length} perms` : 'No access'}</SABadge>
                            <button onClick={() => setEditingUserId(user.id)} className="rounded-md border px-1.5 py-0.5 text-[11px] hover:bg-gray-50" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                              <KeyRound size={11} className="inline mr-1" />Edit
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px]" style={{ color: '#9ca3af' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <SABadge variant={user.emailVerified ? 'success' : 'warning'} dot>{user.emailVerified ? 'Verified' : 'Pending'}</SABadge>
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <SATooltip content="Delete user">
                          <button
                            onClick={() => { if (!confirm(`Delete user ${user.email}? This action cannot be undone.`)) return; deleteUser.mutate({ userId: user.id }) }}
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
                  )
                })}
                {(!data?.users || data.users.length === 0) && (
                  <tr><td colSpan={7} className="py-20 text-center"><p className="text-[13px]" style={{ color: '#6b7280' }}>{search || roleFilter ? 'No users match your filters' : 'No users found'}</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-2.5" style={{ borderColor: '#e5e7eb' }}>
            <span className="text-[12px]" style={{ color: '#6b7280' }}>
              Showing <span style={{ color: '#111827', fontFamily: "'JetBrains Mono', monospace" }}>{page * limit + 1}–{Math.min((page + 1) * limit, data.total)}</span> of <span style={{ color: '#111827', fontFamily: "'JetBrains Mono', monospace" }}>{data.total}</span>
            </span>
            <div className="flex items-center gap-1">
              <SAButton variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</SAButton>
              <span className="text-[12px] px-2" style={{ color: '#6b7280' }}>{page + 1} / {totalPages}</span>
              <SAButton variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</SAButton>
            </div>
          </div>
        )}
      </motion.div>

      {/* Permission Edit Modal — separate backdrop + scroll wrapper (fixes blur viewport) */}
      <AnimatePresence>
        {editingUserId && (() => {
          const editingUser = (data?.users ?? []).find((u: any) => u.id === editingUserId) as any
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              aria-modal="true"
              role="dialog"
            >
              {/* Backdrop — true viewport, blurred, never scrolls */}
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm supports-[backdrop-filter]:bg-black/30"
                style={{ height: '100dvh', minHeight: '100vh' }}
                onClick={() => setEditingUserId(null)}
                aria-hidden
              />
              {/* Scrollable wrapper — handles viewport height correctly on mobile */}
              <div
                className="fixed inset-0 flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6"
                onClick={() => setEditingUserId(null)}
              >
                <motion.div
                  initial={{ scale: 0.97, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.97, opacity: 0, y: 12 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative my-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[min(88vh,calc(100dvh-2rem))] max-sm:max-h-[calc(100svh-2rem)]"
                  style={{ borderColor: '#e5e7eb' }}
                >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-3 border-b bg-white px-5 py-4 sm:px-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#E8A33D15' }}><KeyRound size={14} style={{ color: '#E8A33D' }} /></span>
                      Edit Module Permissions
                    </h3>
                    {editingUser && (
                      <p className="mt-1 truncate text-[12px]" style={{ color: '#6b7280' }}>
                        <span className="font-medium" style={{ color: '#111827' }}>{editingUser.name || 'User'}</span> · <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{editingUser.email}</span> · <span className="uppercase tracking-wide" style={{ fontSize: '10px' }}>{editingUser.role}</span>
                      </p>
                    )}
                    <p className="mt-1 hidden text-[11px] sm:block" style={{ color: '#9ca3af' }}>Choose <b>View</b> to allow reading, <b>Manage</b> to allow creating / editing / deleting. Manage always includes View.</p>
                  </div>
                  <button
                    onClick={() => setEditingUserId(null)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
                    style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body — scrollable */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#fcfcfc] p-4 sm:p-6" style={{ WebkitOverflowScrolling: 'touch' as any }}>
                  <PermissionEditor value={editingPerms} onChange={setEditingPerms} />
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-white px-5 py-3 sm:px-6" style={{ borderColor: '#e5e7eb' }}>
                  <span className="text-[11px]" style={{ color: '#9ca3af' }}>{editingPerms.length} permission{editingPerms.length !== 1 ? 's' : ''} selected</span>
                  <div className="flex gap-2">
                    <SAButton variant="secondary" size="sm" onClick={() => setEditingUserId(null)}>Cancel</SAButton>
                    <SAButton variant="primary" size="sm" disabled={updatePerms.isPending} onClick={() => updatePerms.mutate({ userId: editingUserId!, permissions: editingPerms })}>
                      {updatePerms.isPending ? 'Saving…' : <><Check size={14} /> Save permissions</>}
                    </SAButton>
                  </div>
                </div>
              </motion.div>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Create Staff Modal — separate backdrop + scroll wrapper */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm supports-[backdrop-filter]:bg-black/30"
              style={{ height: '100dvh', minHeight: '100vh' }}
              onClick={() => setShowCreate(false)}
              aria-hidden
            />
            <div
              className="fixed inset-0 flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6"
              onClick={() => setShowCreate(false)}
            >
              <motion.div
                initial={{ scale: 0.97, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.97, opacity: 0, y: 12 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative my-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[min(88vh,calc(100dvh-2rem))] max-sm:max-h-[calc(100svh-2rem)]"
                style={{ borderColor: '#e5e7eb' }}
              >
              <div className="flex shrink-0 items-center justify-between border-b bg-white px-5 py-4 sm:px-6" style={{ borderColor: '#e5e7eb' }}>
                <div>
                  <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#E8A33D15' }}><UserPlus size={14} style={{ color: '#E8A33D' }} /></span>
                    Create Staff
                  </h3>
                  <p className="mt-1 text-[11px]" style={{ color: '#6b7280' }}>Creates an <span className="font-semibold" style={{ color: '#111827' }}>ADMIN</span> account with the selected module permissions.</p>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#fcfcfc] p-4 sm:p-6" style={{ WebkitOverflowScrolling: 'touch' as any }}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Full name <span style={{ color: '#F0625B' }}>*</span></span>
                    <input
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      placeholder="e.g. Alex Rahman"
                      className="rounded-xl border px-3 py-2.5 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/15"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Work email <span style={{ color: '#F0625B' }}>*</span></span>
                    <input
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      placeholder="staff@endowglobal.com"
                      className="rounded-xl border px-3 py-2.5 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/15"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Temporary password <span className="font-normal normal-case tracking-normal" style={{ color: '#9ca3af' }}>— optional, OTP also works</span></span>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="rounded-xl border px-3 py-2.5 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/15"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </label>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#111827' }}>
                    Module Permissions
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold" style={{ color: '#92400e' }}>{createForm.perms.length} selected</span>
                  </p>
                  <PermissionEditor value={createForm.perms} onChange={(v) => setCreateForm({ ...createForm, perms: v })} />
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-white px-5 py-3 sm:px-6" style={{ borderColor: '#e5e7eb' }}>
                <SAButton variant="secondary" size="sm" onClick={() => setShowCreate(false)}>Cancel</SAButton>
                <SAButton
                  variant="primary"
                  size="sm"
                  disabled={createStaff.isPending || !createForm.name.trim() || !createForm.email.trim()}
                  onClick={() => createStaff.mutate({ name: createForm.name.trim(), email: createForm.email.trim(), password: createForm.password || undefined, permissions: createForm.perms })}
                >
                  {createStaff.isPending ? 'Creating…' : <><UserPlus size={14} /> Create staff</>}
                </SAButton>
              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
