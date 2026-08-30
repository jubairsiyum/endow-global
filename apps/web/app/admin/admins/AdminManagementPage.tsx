'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trash2, UserCog, Crown, MoreHorizontal, AlertTriangle, X, Check, KeyRound } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import { toast } from 'sonner'

function RoleBadge({ role }: { role: string }) {
  const isSuper = role === 'SUPER_ADMIN'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${isSuper ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
      {isSuper ? <Crown size={11} /> : <Shield size={11} />} {isSuper ? 'Super Admin' : 'Admin'}
    </span>
  )
}

export default function AdminManagementPage() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as any)?.id as string | undefined

  const { data: admins, isLoading, refetch } = trpc.admin.super.getAdmins.useQuery()
  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => { refetch(); toast.success('Role updated') },
    onError: (e) => toast.error(e.message),
  })
  const deleteAdmin = trpc.admin.super.deleteAdmin.useMutation({
    onSuccess: () => { refetch(); toast.success('Admin deleted') },
    onError: (e) => toast.error(e.message),
  })

  const [roleTarget, setRoleTarget] = useState<{ id: string; name: string; email: string; role: string; newRole: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; email: string } | null>(null)

  const superAdminCount = (admins as any[] || []).filter((a: any) => a.role === 'SUPER_ADMIN').length

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: '#E8A33D', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: '#E8A33D15' }}>
            <Shield size={18} style={{ color: '#E8A33D' }} />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight" style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>Admin Management</h1>
            <p className="text-[12px]" style={{ color: '#6b7280' }}>Restricted to Super Admin — {superAdminCount} super admin{superAdminCount !== 1 ? 's' : ''} · {(admins?.length ?? 0) - superAdminCount} admins</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border bg-amber-50 px-3 py-1.5 text-[11px] font-medium" style={{ borderColor: '#fde68a', color: '#92400e' }}>
          <Crown size={12} /> Super Admin only
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border bg-white px-4 py-3 text-[12px] leading-relaxed" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
        <span className="font-semibold" style={{ color: '#111827' }}>Restricted:</span> Promoting to Super Admin grants full access to every module, user and revenue data. Demoting or deleting is audited and requires confirmation. You cannot demote/delete yourself or the last Super Admin.
      </div>

      {/* Table — modern concise */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: '#e5e7eb' }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50/60" style={{ borderColor: '#e5e7eb' }}>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Admin</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Role</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Joined</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f3f4f6' } as any}>
              {(admins as any[] || []).map((admin: any) => {
                const isSelf = admin.id === currentUserId
                const isLastSuper = admin.role === 'SUPER_ADMIN' && superAdminCount <= 1
                return (
                  <tr key={admin.id} className="group transition-colors hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: admin.role === 'SUPER_ADMIN' ? 'linear-gradient(135deg,#F0625B,#dc2626)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                          {(admin.name || 'AD').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-[13px] font-semibold" style={{ color: '#111827' }}>{admin.name || 'Unnamed'}</span>
                            {isSelf && <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">You</span>}
                          </div>
                          <div className="truncate text-[11px]" style={{ color: '#6b7280', fontFamily: "'JetBrains Mono', monospace" }}>{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={admin.role} /></td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#6b7280' }}>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}</td>
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
                              {admin.role !== 'SUPER_ADMIN' ? (
                                <DropdownMenu.Item
                                  disabled={isSelf}
                                  onSelect={() => setRoleTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email, role: admin.role, newRole: 'SUPER_ADMIN' })}
                                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-amber-50 disabled:opacity-40"
                                  style={{ color: '#92400e' }}
                                >
                                  <Crown size={14} /> Promote to Super Admin
                                </DropdownMenu.Item>
                              ) : (
                                <DropdownMenu.Item
                                  disabled={isSelf || isLastSuper}
                                  onSelect={() => setRoleTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email, role: admin.role, newRole: 'ADMIN' })}
                                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-blue-50 disabled:opacity-40"
                                  style={{ color: '#1d4ed8' }}
                                >
                                  <UserCog size={14} /> Demote to Admin
                                </DropdownMenu.Item>
                              )}
                              {admin.role !== 'SUPER_ADMIN' && (
                                <>
                                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                                  <DropdownMenu.Item
                                    disabled={isSelf}
                                    onSelect={() => setDeleteTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email })}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none hover:bg-red-50 disabled:opacity-40"
                                    style={{ color: '#b91c1c' }}
                                  >
                                    <Trash2 size={14} /> Delete admin
                                  </DropdownMenu.Item>
                                </>
                              )}
                              {isSelf && <DropdownMenu.Label className="px-2.5 py-1.5 text-[11px]" style={{ color: '#9ca3af' }}>You cannot change your own role here</DropdownMenu.Label>}
                              {isLastSuper && admin.role === 'SUPER_ADMIN' && <DropdownMenu.Label className="px-2.5 py-1.5 text-[11px] text-amber-700">Last Super Admin — cannot demote</DropdownMenu.Label>}
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {(!admins || (admins as any[]).length === 0) && (
                <tr><td colSpan={4} className="py-12 text-center text-[13px]" style={{ color: '#6b7280' }}>No admins found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y md:hidden" style={{ borderColor: '#f3f4f6' } as any}>
          {(admins as any[] || []).map((admin: any) => {
            const isSelf = admin.id === currentUserId
            const isLastSuper = admin.role === 'SUPER_ADMIN' && superAdminCount <= 1
            return (
              <div key={admin.id} className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: admin.role === 'SUPER_ADMIN' ? '#dc2626' : '#2563eb' }}>{(admin.name || 'AD').slice(0, 2).toUpperCase()}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold" style={{ color: '#111827' }}>{admin.name || 'Unnamed'} {isSelf && <span className="ml-1 rounded-full bg-gray-900 px-1 py-0.5 text-[10px] text-white">You</span>}</div>
                  <div className="truncate text-[11px]" style={{ color: '#6b7280' }}>{admin.email}</div>
                  <div className="mt-1"><RoleBadge role={admin.role} /></div>
                </div>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="h-8 w-8 rounded-full border bg-white" style={{ borderColor: '#e5e7eb' }}><MoreHorizontal size={14} className="mx-auto" style={{ color: '#6b7280' }} /></button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content align="end" className="z-50 min-w-[180px] rounded-xl border bg-white p-1 shadow-xl" style={{ borderColor: '#e5e7eb' }}>
                      {admin.role !== 'SUPER_ADMIN'
                        ? <DropdownMenu.Item disabled={isSelf} onSelect={() => setRoleTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email, role: admin.role, newRole: 'SUPER_ADMIN' })} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]"><Crown size={14} /> Promote</DropdownMenu.Item>
                        : <DropdownMenu.Item disabled={isSelf || isLastSuper} onSelect={() => setRoleTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email, role: admin.role, newRole: 'ADMIN' })} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]"><UserCog size={14} /> Demote</DropdownMenu.Item>}
                      {admin.role !== 'SUPER_ADMIN' && <DropdownMenu.Item disabled={isSelf} onSelect={() => setDeleteTarget({ id: admin.id, name: admin.name || 'Admin', email: admin.email })} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-red-600"><Trash2 size={14} /> Delete</DropdownMenu.Item>}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            )
          })}
        </div>
      </div>

      {/* Role change confirmation modal */}
      <AnimatePresence>
        {roleTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{ height: '100dvh', minHeight: '100vh' }} onClick={() => setRoleTarget(null)} />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4" onClick={() => setRoleTarget(null)}>
              <motion.div initial={{ scale: 0.97, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.97, y: 8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative my-auto w-full max-w-[440px] rounded-2xl border bg-white p-6 shadow-2xl" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: roleTarget.newRole === 'SUPER_ADMIN' ? '#fee2e2' : '#dbeafe' }}>
                    {roleTarget.newRole === 'SUPER_ADMIN' ? <Crown size={16} style={{ color: '#dc2626' }} /> : <UserCog size={16} style={{ color: '#2563eb' }} />}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold" style={{ color: '#111827' }}>{roleTarget.newRole === 'SUPER_ADMIN' ? 'Promote to Super Admin?' : 'Demote to Admin?'}</h3>
                    <p className="text-[11px]" style={{ color: '#6b7280' }}>{roleTarget.name} · <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{roleTarget.email}</span></p>
                  </div>
                  <button onClick={() => setRoleTarget(null)} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}><X size={14} /></button>
                </div>

                <div className="mt-4 space-y-2">
                  {roleTarget.newRole === 'SUPER_ADMIN' ? (
                    <div className="rounded-xl border bg-red-50 px-3 py-2.5 text-[12px] leading-relaxed" style={{ borderColor: '#fecaca', color: '#991b1b' }}>
                      <b>Super Admin grants full access</b> to every module, all users, revenue, branches and system activity. Only promote trusted staff. This is audited.
                    </div>
                  ) : (
                    <div className="rounded-xl border bg-amber-50 px-3 py-2.5 text-[12px] leading-relaxed" style={{ borderColor: '#fde68a', color: '#92400e' }}>
                      Demoting removes Super Admin privileges. The user will keep their <b>ADMIN</b> permissions as configured in User Management.
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2" style={{ borderColor: '#e5e7eb' }}>
                    <span className="text-[11px]" style={{ color: '#6b7280' }}>Current</span><RoleBadge role={roleTarget.role} />
                    <span style={{ color: '#9ca3af' }}>→</span><RoleBadge role={roleTarget.newRole} />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setRoleTarget(null)} className="rounded-xl border bg-white px-4 py-2 text-[13px] font-medium hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>Cancel</button>
                  <button
                    onClick={() => {
                      if (roleTarget.newRole === 'SUPER_ADMIN' && !confirm(`Promote ${roleTarget.email} to SUPER_ADMIN? This grants full access.`)) return
                      if (roleTarget.newRole === 'ADMIN' && !confirm(`Demote ${roleTarget.email} to ADMIN?`)) return
                      updateRole.mutate({ userId: roleTarget.id, role: roleTarget.newRole as any }, { onSuccess: () => setRoleTarget(null) })
                    }}
                    disabled={updateRole.isPending}
                    className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                    style={{ background: roleTarget.newRole === 'SUPER_ADMIN' ? '#dc2626' : '#2563eb' }}
                  >
                    {updateRole.isPending ? 'Updating…' : roleTarget.newRole === 'SUPER_ADMIN' ? 'Promote' : 'Demote'}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{ height: '100dvh', minHeight: '100vh' }} onClick={() => setDeleteTarget(null)} />
            <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4" onClick={() => setDeleteTarget(null)}>
              <motion.div initial={{ scale: 0.97, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.97, y: 8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative my-auto w-full max-w-[440px] rounded-2xl border bg-white p-6 shadow-2xl" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={18} /></div>
                <h3 className="mt-3 text-[15px] font-bold" style={{ color: '#111827' }}>Delete admin?</h3>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#6b7280' }}>
                  This will permanently delete <b style={{ color: '#111827' }}>{deleteTarget.name}</b> (<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{deleteTarget.email}</span>). Their sessions and staff permissions will be removed. This cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setDeleteTarget(null)} className="rounded-xl border bg-white px-4 py-2 text-[13px] font-medium hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>Cancel</button>
                  <button
                    onClick={() => {
                      if (!confirm(`Permanently delete ${deleteTarget.email}?`)) return
                      deleteAdmin.mutate({ userId: deleteTarget.id }, { onSuccess: () => setDeleteTarget(null) })
                    }}
                    disabled={deleteAdmin.isPending}
                    className="rounded-xl bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteAdmin.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
