'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Shield, Trash2, RefreshCw, AlertTriangle, KeyRound, UserPlus, X, Check,
  MoreHorizontal, UserCog, Lock, Eye, EyeOff, Crown,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { SAInput } from '@/components/super-admin/shared/SAInput'
import { PermissionEditor } from '@/components/admin/PermissionEditor'
import { toast } from 'sonner'

const ROLES = ['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN'] as const

const ROLE_META: Record<string, { label: string; dot: string; badge: 'route' | 'success' | 'alert' | 'neutral' | 'warning'; icon: typeof Shield }> = {
  SUPER_ADMIN: { label: 'Super Admin', dot: 'alert', badge: 'alert', icon: Crown },
  ADMIN: { label: 'Admin', dot: 'route', badge: 'route', icon: Shield },
  COUNSELOR: { label: 'Counselor', dot: 'success', badge: 'success', icon: UserCog },
  STUDENT: { label: 'Student', dot: 'neutral', badge: 'neutral', icon: Shield },
}

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? ROLE_META.STUDENT
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badge === 'alert' ? 'bg-red-50 text-red-700 border border-red-200' : meta.badge === 'route' ? 'bg-amber-50 text-amber-800 border border-amber-200' : meta.badge === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
      <Icon size={11} /> {meta.label}
    </span>
  )
}

export default function SAUsersPage() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as any)?.id as string | undefined

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const limit = 30

  // Modals
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingPerms, setEditingPerms] = useState<string[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', perms: [] as string[] })

  const [roleTarget, setRoleTarget] = useState<{ id: string; name: string; email: string; role: string } | null>(null)
  const [newRole, setNewRole] = useState<string>('ADMIN')
  const [resetTarget, setResetTarget] = useState<{ id: string; name: string; email: string } | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

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
  useEffect(() => { if (permData?.permissions) setEditingPerms(permData.permissions) }, [permData])
  useEffect(() => { if (roleTarget) setNewRole(roleTarget.role) }, [roleTarget])
  useEffect(() => { if (resetTarget) { setNewPassword(''); setShowPw(false) } }, [resetTarget])

  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => { utils.admin.super.getAllUsers.invalidate(); utils.admin.super.getPlatformStats.invalidate(); setRoleTarget(null); toast.success('Role updated') },
    onError: (e) => toast.error(e.message),
  })
  const deleteUser = trpc.admin.super.deleteUser.useMutation({
    onSuccess: () => { utils.admin.super.getAllUsers.invalidate(); utils.admin.super.getPlatformStats.invalidate(); toast.success('User deleted') },
    onError: (e) => toast.error(e.message),
  })
  const updatePerms = trpc.admin.super.updatePermissions.useMutation({
    onSuccess: () => { utils.admin.super.getAllUsers.invalidate(); setEditingUserId(null); toast.success('Permissions updated') },
    onError: (e) => toast.error(e.message),
  })
  const createStaff = trpc.admin.super.createStaff.useMutation({
    onSuccess: () => { utils.admin.super.getAllUsers.invalidate(); setShowCreate(false); setCreateForm({ name: '', email: '', password: '', perms: [] }); toast.success('Staff created') },
    onError: (e) => toast.error(e.message),
  })
  const resetPassword = trpc.admin.super.resetPassword.useMutation({
    onSuccess: () => { setResetTarget(null); setNewPassword(''); toast.success('Password reset — user must login with new password') },
    onError: (e) => toast.error(e.message),
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 1
  const filteredCount = data?.users?.length ?? 0

  return (
    <div className="mx-auto max-w-[1440px] space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>User Management</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6b7280' }}>Manage users, roles and module permissions. Role changes and password resets are audited.</p>
        </div>
        <div className="flex items-center gap-2">
          <SABadge variant="route"><Shield size={11} />{data?.total ?? 0} users</SABadge>
          <SAButton variant="primary" size="sm" onClick={() => setShowCreate(true)}><UserPlus size={14} /> New staff</SAButton>
        </div>
      </motion.div>

      {/* Filters — concise */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-full max-w-[320px]"><SAInput placeholder="Search name or email…" icon={<Search size={14} />} value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} /></div>
          <span className="hidden text-[11px] sm:inline" style={{ color: '#9ca3af' }}>{filteredCount} shown</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {([undefined, ...ROLES] as (string | undefined)[]).map((r) => (
            <button
              key={r ?? 'all'}
              onClick={() => { setRoleFilter(r); setPage(0) }}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${roleFilter === r ? 'bg-[#111827] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border'}`}
              style={roleFilter !== r ? { borderColor: '#e5e7eb' } as any : undefined}
            >
              {r ? ROLE_META[r]?.label ?? r : 'All roles'}
            </button>
          ))}
          <SAButton variant="ghost" size="sm" onClick={() => { setSearch(''); setRoleFilter(undefined); setPage(0); utils.admin.super.getAllUsers.invalidate() }}><RefreshCw size={12} /> Reset</SAButton>
        </div>
      </motion.div>

      {/* Table — modern concise */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="overflow-hidden rounded-xl border shadow-sm" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <AlertTriangle size={28} style={{ color: '#F0625B' }} /><p className="mt-3 text-[14px] font-medium" style={{ color: '#F0625B' }}>Failed to load users</p>
            <SAButton variant="secondary" size="sm" className="mt-3" onClick={() => utils.admin.super.getAllUsers.invalidate()}>Retry</SAButton>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/60" style={{ borderColor: '#e5e7eb' }}>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>User</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Role</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Access</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Status</th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#f3f4f6' } as any}>
                  {(data?.users ?? []).map((user: any) => {
                    const perms: string[] = (() => { const raw = user.permissions; if (Array.isArray(raw)) return raw; if (typeof raw === 'string') { try { const p = JSON.parse(raw); if (Array.isArray(p)) return p } catch {} } return [] })()
                    const isSelf = currentUserId === user.id
                    const isSuper = user.role === 'SUPER_ADMIN'
                    const isAdmin = user.role === 'ADMIN'
                    return (
                      <tr key={user.id} className="group transition-colors hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-bold text-white" style={{ background: isSuper ? 'linear-gradient(135deg,#F0625B,#dc2626)' : isAdmin ? 'linear-gradient(135deg,#E8A33D,#b45309)' : user.role === 'COUNSELOR' ? 'linear-gradient(135deg,#10b981,#047857)' : 'linear-gradient(135deg,#6b7280,#374151)' }}>
                              {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : (user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??')}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-[13px] font-semibold" style={{ color: '#111827' }}>{user.name || 'Unnamed'}</span>
                                {isSelf && <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">You</span>}
                              </div>
                              <div className="truncate text-[11px]" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{user.email}</div>
                              <div className="text-[10px]" style={{ color: '#9ca3af' }}>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                        <td className="px-4 py-3">
                          {isSuper ? <SABadge variant="alert">All modules</SABadge> : isAdmin ? (
                            perms.length ? (
                              <span className="inline-flex items-center gap-1 rounded-full border bg-amber-50 px-2 py-0.5 text-[11px] font-medium" style={{ borderColor: '#fde68a', color: '#92400e' }}>
                                <Shield size={11} /> {perms.length} perms
                              </span>
                            ) : (
                              <span className="rounded-full border bg-red-50 px-2 py-0.5 text-[11px] font-medium" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>No access</span>
                            )
                          ) : (
                            <span className="text-[11px]" style={{ color: '#9ca3af' }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3"><SABadge variant={user.emailVerified ? 'success' : 'warning'} dot>{user.emailVerified ? 'Verified' : 'Pending'}</SABadge></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white hover:bg-gray-50" style={{ borderColor: '#e5e7eb', color: '#6b7280' }} aria-label="Actions">
                                  <MoreHorizontal size={14} />
                                </button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.Content align="end" sideOffset={6} className="z-50 min-w-[200px] rounded-xl border bg-white p-1 shadow-xl" style={{ borderColor: '#e5e7eb' }}>
                                  <DropdownMenu.Item onSelect={() => setRoleTarget({ id: user.id, name: user.name || 'User', email: user.email, role: user.role })} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-gray-50" style={{ color: '#111827' }}>
                                    <UserCog size={14} style={{ color: '#6b7280' }} /> Change role
                                  </DropdownMenu.Item>
                                  {isAdmin && (
                                    <DropdownMenu.Item onSelect={() => setEditingUserId(user.id)} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-gray-50" style={{ color: '#111827' }}>
                                      <KeyRound size={14} style={{ color: '#E8A33D' }} /> Manage permissions
                                    </DropdownMenu.Item>
                                  )}
                                  {!isSelf && (
                                    <DropdownMenu.Item onSelect={() => setResetTarget({ id: user.id, name: user.name || 'User', email: user.email })} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-gray-50" style={{ color: '#111827' }}>
                                      <Lock size={14} style={{ color: '#6b7280' }} /> Reset password
                                    </DropdownMenu.Item>
                                  )}
                                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                                  <DropdownMenu.Item
                                    disabled={isSuper}
                                    onSelect={() => { if (isSuper) return; if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return; deleteUser.mutate({ userId: user.id }) }}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-red-50 disabled:opacity-40"
                                    style={{ color: '#b91c1c' }}
                                  >
                                    <Trash2 size={14} /> Delete user
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {(!data?.users || data.users.length === 0) && (
                    <tr><td colSpan={5} className="py-16 text-center text-[13px]" style={{ color: '#6b7280' }}>{search || roleFilter ? 'No users match your filters' : 'No users found'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y md:hidden" style={{ borderColor: '#f3f4f6' } as any}>
              {(data?.users ?? []).map((user: any) => {
                const perms: string[] = (() => { const raw = user.permissions; if (Array.isArray(raw)) return raw; if (typeof raw === 'string') { try { const p = JSON.parse(raw); if (Array.isArray(p)) return p } catch {} } return [] })()
                const isSelf = currentUserId === user.id
                return (
                  <div key={user.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: user.role === 'SUPER_ADMIN' ? '#dc2626' : user.role === 'ADMIN' ? '#d97706' : '#6b7280' }}>
                      {(user.name || '??').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold" style={{ color: '#111827' }}>{user.name || 'Unnamed'} {isSelf && <span className="ml-1 rounded-full bg-gray-900 px-1 py-0.5 text-[10px] text-white">You</span>}</div>
                      <div className="truncate text-[11px]" style={{ color: '#6b7280' }}>{user.email}</div>
                      <div className="mt-1 flex items-center gap-1.5"><RoleBadge role={user.role} />{user.role === 'ADMIN' && <span className="text-[10px]" style={{ color: '#9ca3af' }}>{perms.length} perms</span>}</div>
                    </div>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="h-8 w-8 rounded-full border bg-white" style={{ borderColor: '#e5e7eb' }}><MoreHorizontal size={14} className="mx-auto" style={{ color: '#6b7280' }} /></button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" className="z-50 min-w-[180px] rounded-xl border bg-white p-1 shadow-xl" style={{ borderColor: '#e5e7eb' }}>
                          <DropdownMenu.Item onSelect={() => setRoleTarget({ id: user.id, name: user.name || 'User', email: user.email, role: user.role })} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]"><UserCog size={14} /> Change role</DropdownMenu.Item>
                          {user.role === 'ADMIN' && <DropdownMenu.Item onSelect={() => setEditingUserId(user.id)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]"><KeyRound size={14} /> Permissions</DropdownMenu.Item>}
                          {!isSelf && <DropdownMenu.Item onSelect={() => setResetTarget({ id: user.id, name: user.name || 'User', email: user.email })} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]"><Lock size={14} /> Reset password</DropdownMenu.Item>}
                          {user.role !== 'SUPER_ADMIN' && <DropdownMenu.Item onSelect={() => { if (confirm(`Delete ${user.email}?`)) deleteUser.mutate({ userId: user.id }) }} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-red-600"><Trash2 size={14} /> Delete</DropdownMenu.Item>}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {data && data.total > 0 && (
          <div className="flex flex-col gap-2 border-t bg-gray-50/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: '#e5e7eb' }}>
            <span className="text-[12px]" style={{ color: '#6b7280' }}>Showing <b style={{ color: '#111827' }}>{page * limit + 1}–{Math.min((page + 1) * limit, data.total)}</b> of <b style={{ color: '#111827' }}>{data.total}</b></span>
            <div className="flex items-center gap-1">
              <SAButton variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</SAButton>
              <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium border" style={{ borderColor: '#e5e7eb', color: '#111827' }}>{page + 1} / {totalPages}</span>
              <SAButton variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</SAButton>
            </div>
          </div>
        )}
      </motion.div>

      {/* Change Role Modal — industry standard: confirmation, no inline edit */}
      <AnimatePresence>
        {roleTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{ height: '100dvh', minHeight: '100vh' }} onClick={() => setRoleTarget(null)} />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4" onClick={() => setRoleTarget(null)}>
              <motion.div initial={{ scale: 0.97, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.97, y: 8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative my-auto w-full max-w-[440px] rounded-2xl border bg-white p-6 shadow-2xl" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: '#E8A33D15' }}><UserCog size={16} style={{ color: '#E8A33D' }} /></div>
                  <div>
                    <h3 className="text-[15px] font-bold" style={{ color: '#111827' }}>Change role</h3>
                    <p className="text-[11px]" style={{ color: '#6b7280' }}>{roleTarget.name} · <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{roleTarget.email}</span></p>
                  </div>
                  <button onClick={() => setRoleTarget(null)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}><X size={14} /></button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border bg-amber-50/40 px-3 py-2.5" style={{ borderColor: '#fde68a' }}>
                    <p className="text-[11px] font-semibold" style={{ color: '#92400e' }}>Current: <RoleBadge role={roleTarget.role} /></p>
                    <p className="mt-1 text-[11px]" style={{ color: '#92400e' }}>Role determines base access. Permissions are only used for <b>ADMIN</b>. Super Admin has all access implicitly.</p>
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>New role</span>
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="rounded-xl border px-3 py-2.5 text-[13px] font-medium outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/15" style={{ borderColor: '#e5e7eb', background: '#ffffff' }}>
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label} ({r})</option>)}
                    </select>
                  </label>

                  {newRole === 'SUPER_ADMIN' && <p className="rounded-lg border bg-red-50 px-3 py-2 text-[11px] font-medium" style={{ borderColor: '#fecaca', color: '#991b1b' }}>⚠️ Granting <b>Super Admin</b> gives full access to all modules and user management. Only trusted staff should have this.</p>}
                  {roleTarget.role === 'SUPER_ADMIN' && newRole !== 'SUPER_ADMIN' && <p className="rounded-lg border bg-red-50 px-3 py-2 text-[11px] font-medium" style={{ borderColor: '#fecaca', color: '#991b1b' }}>⚠️ Demoting a Super Admin is sensitive. Ensure at least one Super Admin remains.</p>}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <SAButton variant="secondary" size="sm" onClick={() => setRoleTarget(null)}>Cancel</SAButton>
                  <SAButton
                    variant="primary"
                    size="sm"
                    disabled={updateRole.isPending || newRole === roleTarget.role}
                    onClick={() => {
                      if (newRole === roleTarget.role) return
                      if (roleTarget.role === 'SUPER_ADMIN' && !confirm('Demote this Super Admin? This reduces their access significantly.')) return
                      if (newRole === 'SUPER_ADMIN' && !confirm(`Promote ${roleTarget.email} to Super Admin?`)) return
                      updateRole.mutate({ userId: roleTarget.id, role: newRole as any })
                    }}
                  >
                    {updateRole.isPending ? 'Updating…' : 'Confirm change'}
                  </SAButton>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal — Super Admin only, other users */}
      <AnimatePresence>
        {resetTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{ height: '100dvh', minHeight: '100vh' }} onClick={() => setResetTarget(null)} />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4" onClick={() => setResetTarget(null)}>
              <motion.div initial={{ scale: 0.97, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.97, y: 8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative my-auto w-full max-w-[440px] rounded-2xl border bg-white p-6 shadow-2xl" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: '#fee2e2' }}><Lock size={16} style={{ color: '#dc2626' }} /></div>
                  <div>
                    <h3 className="text-[15px] font-bold" style={{ color: '#111827' }}>Reset password</h3>
                    <p className="text-[11px] truncate" style={{ color: '#6b7280' }}>{resetTarget.name} · <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{resetTarget.email}</span></p>
                  </div>
                  <button onClick={() => setResetTarget(null)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}><X size={14} /></button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border bg-red-50/40 px-3 py-2.5 text-[11px]" style={{ borderColor: '#fecaca', color: '#991b1b' }}>
                    This will <b>invalidate all sessions</b> for this user and set a new password. They must log in with the new password. This action is audited.
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>New password <span style={{ color: '#dc2626' }}>*</span></span>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full rounded-xl border px-3 py-2.5 pr-9 text-[13px] outline-none placeholder:text-gray-400 focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/15"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100" style={{ color: '#6b7280' }} aria-label="Toggle password visibility">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <span className="text-[10px]" style={{ color: newPassword.length >= 8 ? '#16a34a' : '#9ca3af' }}>{newPassword.length ? `${newPassword.length} chars — ${newPassword.length >= 8 ? 'valid' : 'min 8 required'}` : ' '}</span>
                  </label>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setNewPassword(Math.random().toString(36).slice(-10) + 'A1!')}
                      className="rounded-full border bg-white px-2.5 py-1 text-[11px] font-medium hover:bg-gray-50"
                      style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                    >
                      Generate random
                    </button>
                    <button type="button" onClick={() => setNewPassword('')} className="rounded-full border bg-white px-2.5 py-1 text-[11px] font-medium hover:bg-gray-50" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>Clear</button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <SAButton variant="secondary" size="sm" onClick={() => setResetTarget(null)}>Cancel</SAButton>
                  <SAButton
                    variant="primary"
                    size="sm"
                    disabled={resetPassword.isPending || newPassword.length < 8}
                    onClick={() => {
                      if (!confirm(`Reset password for ${resetTarget.email}?\nTheir current sessions will be terminated.`)) return
                      resetPassword.mutate({ userId: resetTarget.id, newPassword })
                    }}
                  >
                    {resetPassword.isPending ? 'Resetting…' : 'Reset password'}
                  </SAButton>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
