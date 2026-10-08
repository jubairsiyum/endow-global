'use client'

import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { AnimatePresence, motion } from 'framer-motion'
import { Crown, MoreHorizontal, Shield, Trash2, UserCog, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface AdminUser {
  id: string
  name?: string | null
  email: string
  role: string
  createdAt?: string | Date | null
}

interface RoleTargetState {
  id: string
  name: string
  email: string
  role: string
  newRole: string
}

interface DeleteTargetState {
  id: string
  name: string
  email: string
}

interface SessionUser {
  id?: string
}

function RoleBadge({ role }: { role: string }) {
  const isSuper = role === 'SUPER_ADMIN'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        isSuper
          ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/60 dark:text-red-300'
          : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-300'
      }`}
    >
      {isSuper ? <Crown size={11} /> : <Shield size={11} />} {isSuper ? 'Super Admin' : 'Admin'}
    </span>
  )
}

export default function AdminManagementPage() {
  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined
  const currentUserId = sessionUser?.id

  const { data: admins, isLoading, refetch } = trpc.admin.super.getAdmins.useQuery()
  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => {
      refetch()
      toast.success('Role updated')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e.message),
  })
  const deleteAdmin = trpc.admin.super.deleteAdmin.useMutation({
    onSuccess: () => {
      refetch()
      toast.success('Admin deleted')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e.message),
  })

  const [roleTarget, setRoleTarget] = useState<RoleTargetState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTargetState | null>(null)

  const adminList: AdminUser[] = (admins as AdminUser[]) || []
  const superAdminCount = adminList.filter((a) => a.role === 'SUPER_ADMIN').length

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{ borderColor: '#c41e3a', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'rgba(196, 30, 58, 0.1)' }}
          >
            <Shield size={18} style={{ color: '#c41e3a' }} />
          </div>
          <div>
            <h1
              className="text-[18px] font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Admin Management
            </h1>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Restricted to Super Admin — {superAdminCount} super admin
              {superAdminCount !== 1 ? 's' : ''} · {adminList.length - superAdminCount} admins
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/60 dark:text-amber-300">
          <Crown size={12} /> Super Admin only
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[12px] leading-relaxed text-gray-600 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-white">Restricted:</span> Promoting
        to Super Admin grants full access to every module, user and revenue data. Demoting or
        deleting is audited and requires confirmation. You cannot demote/delete yourself or the last
        Super Admin.
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/60 dark:border-white/[0.08] dark:bg-[#18181b]/80">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Admin
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Joined
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {adminList.map((admin) => {
                const isSelf = admin.id === currentUserId
                const isLastSuper = admin.role === 'SUPER_ADMIN' && superAdminCount <= 1
                return (
                  <tr
                    key={admin.id}
                    className="group transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{
                            background:
                              admin.role === 'SUPER_ADMIN'
                                ? 'linear-gradient(135deg,#c41e3a,#a01830)'
                                : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                          }}
                        >
                          {(admin.name || 'AD').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-[13px] font-semibold text-gray-900 dark:text-white">
                              {admin.name || 'Unnamed'}
                            </span>
                            {isSelf && (
                              <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-gray-900">
                                You
                              </span>
                            )}
                          </div>
                          <div
                            className="truncate text-[11px] text-gray-500 dark:text-gray-400"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={admin.role} />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-400 dark:hover:bg-white/[0.06]"
                              aria-label="Actions"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              sideOffset={6}
                              className="z-50 min-w-[200px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-white/[0.08] dark:bg-[#18181b]"
                            >
                              {admin.role !== 'SUPER_ADMIN' ? (
                                <DropdownMenu.Item
                                  disabled={isSelf}
                                  onSelect={() =>
                                    setRoleTarget({
                                      id: admin.id,
                                      name: admin.name || 'Admin',
                                      email: admin.email,
                                      role: admin.role,
                                      newRole: 'SUPER_ADMIN',
                                    })
                                  }
                                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-amber-700 outline-none transition-colors hover:bg-amber-50 disabled:opacity-40 dark:text-amber-400 dark:hover:bg-amber-950/40"
                                >
                                  <Crown size={14} /> Promote to Super Admin
                                </DropdownMenu.Item>
                              ) : (
                                <DropdownMenu.Item
                                  disabled={isSelf || isLastSuper}
                                  onSelect={() =>
                                    setRoleTarget({
                                      id: admin.id,
                                      name: admin.name || 'Admin',
                                      email: admin.email,
                                      role: admin.role,
                                      newRole: 'ADMIN',
                                    })
                                  }
                                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-blue-700 outline-none transition-colors hover:bg-blue-50 disabled:opacity-40 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                >
                                  <UserCog size={14} /> Demote to Admin
                                </DropdownMenu.Item>
                              )}
                              {admin.role !== 'SUPER_ADMIN' && (
                                <>
                                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                                  <DropdownMenu.Item
                                    disabled={isSelf}
                                    onSelect={() =>
                                      setDeleteTarget({
                                        id: admin.id,
                                        name: admin.name || 'Admin',
                                        email: admin.email,
                                      })
                                    }
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-red-600 outline-none transition-colors hover:bg-red-50 disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40"
                                  >
                                    <Trash2 size={14} /> Delete admin
                                  </DropdownMenu.Item>
                                </>
                              )}
                              {isSelf && (
                                <DropdownMenu.Label className="px-2.5 py-1.5 text-[11px] text-gray-400">
                                  You cannot change your own role here
                                </DropdownMenu.Label>
                              )}
                              {isLastSuper && admin.role === 'SUPER_ADMIN' && (
                                <DropdownMenu.Label className="px-2.5 py-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                                  Last Super Admin — cannot demote
                                </DropdownMenu.Label>
                              )}
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {adminList.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-[13px] text-gray-500 dark:text-gray-400"
                  >
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="divide-y divide-gray-100 dark:divide-white/[0.06] md:hidden">
          {adminList.map((admin) => {
            const isSelf = admin.id === currentUserId
            const isLastSuper = admin.role === 'SUPER_ADMIN' && superAdminCount <= 1
            return (
              <div key={admin.id} className="flex items-center gap-3 p-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                  style={{
                    background: admin.role === 'SUPER_ADMIN' ? '#c41e3a' : '#2563eb',
                  }}
                >
                  {(admin.name || 'AD').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-gray-900 dark:text-white">
                    {admin.name || 'Unnamed'}{' '}
                    {isSelf && (
                      <span className="ml-1 rounded-full bg-gray-900 px-1 py-0.5 text-[10px] text-white dark:bg-white dark:text-gray-900">
                        You
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                    {admin.email}
                  </div>
                  <div className="mt-1">
                    <RoleBadge role={admin.role} />
                  </div>
                </div>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="h-8 w-8 rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]"
                      aria-label="Actions"
                    >
                      <MoreHorizontal
                        size={14}
                        className="mx-auto text-gray-500 dark:text-gray-400"
                      />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      className="z-50 min-w-[180px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-white/[0.08] dark:bg-[#18181b]"
                    >
                      {admin.role !== 'SUPER_ADMIN' ? (
                        <DropdownMenu.Item
                          disabled={isSelf}
                          onSelect={() =>
                            setRoleTarget({
                              id: admin.id,
                              name: admin.name || 'Admin',
                              email: admin.email,
                              role: admin.role,
                              newRole: 'SUPER_ADMIN',
                            })
                          }
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-gray-900 dark:text-gray-200"
                        >
                          <Crown size={14} /> Promote
                        </DropdownMenu.Item>
                      ) : (
                        <DropdownMenu.Item
                          disabled={isSelf || isLastSuper}
                          onSelect={() =>
                            setRoleTarget({
                              id: admin.id,
                              name: admin.name || 'Admin',
                              email: admin.email,
                              role: admin.role,
                              newRole: 'ADMIN',
                            })
                          }
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-gray-900 dark:text-gray-200"
                        >
                          <UserCog size={14} /> Demote
                        </DropdownMenu.Item>
                      )}
                      {admin.role !== 'SUPER_ADMIN' && (
                        <DropdownMenu.Item
                          disabled={isSelf}
                          onSelect={() =>
                            setDeleteTarget({
                              id: admin.id,
                              name: admin.name || 'Admin',
                              email: admin.email,
                            })
                          }
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-red-600 dark:text-red-400"
                        >
                          <Trash2 size={14} /> Delete
                        </DropdownMenu.Item>
                      )}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ height: '100dvh', minHeight: '100vh' }}
              onClick={() => setRoleTarget(null)}
            />
            <div
              className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4"
              onClick={() => setRoleTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.97, y: 8, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.97, y: 8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative my-auto w-full max-w-[440px] rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: roleTarget.newRole === 'SUPER_ADMIN' ? '#fee2e2' : '#dbeafe',
                    }}
                  >
                    {roleTarget.newRole === 'SUPER_ADMIN' ? (
                      <Crown size={16} style={{ color: '#dc2626' }} />
                    ) : (
                      <UserCog size={16} style={{ color: '#2563eb' }} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
                      {roleTarget.newRole === 'SUPER_ADMIN'
                        ? 'Promote to Super Admin?'
                        : 'Demote to Admin?'}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {roleTarget.name} ·{' '}
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {roleTarget.email}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setRoleTarget(null)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400 dark:hover:bg-white/[0.06]"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {roleTarget.newRole === 'SUPER_ADMIN' ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-relaxed text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                      <b>Super Admin grants full access</b> to every module, all users, revenue,
                      branches and system activity. Only promote trusted staff. This is audited.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] leading-relaxed text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                      Demoting removes Super Admin privileges. The user will keep their <b>ADMIN</b>{' '}
                      permissions as configured in User Management.
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/[0.08] dark:bg-[#09090b]">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">Current</span>
                    <RoleBadge role={roleTarget.role} />
                    <span className="text-gray-400">→</span>
                    <RoleBadge role={roleTarget.newRole} />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setRoleTarget(null)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (
                        roleTarget.newRole === 'SUPER_ADMIN' &&
                        !confirm(
                          `Promote ${roleTarget.email} to SUPER_ADMIN? This grants full access.`
                        )
                      )
                        return
                      if (
                        roleTarget.newRole === 'ADMIN' &&
                        !confirm(`Demote ${roleTarget.email} to ADMIN?`)
                      )
                        return
                      updateRole.mutate(
                        {
                          userId: roleTarget.id,
                          role: roleTarget.newRole as 'ADMIN' | 'SUPER_ADMIN',
                        },
                        { onSuccess: () => setRoleTarget(null) }
                      )
                    }}
                    disabled={updateRole.isPending}
                    className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                    style={{
                      background: roleTarget.newRole === 'SUPER_ADMIN' ? '#c41e3a' : '#2563eb',
                    }}
                  >
                    {updateRole.isPending
                      ? 'Updating…'
                      : roleTarget.newRole === 'SUPER_ADMIN'
                        ? 'Promote'
                        : 'Demote'}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ height: '100dvh', minHeight: '100vh' }}
              onClick={() => setDeleteTarget(null)}
            />
            <div
              className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4"
              onClick={() => setDeleteTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.97, y: 8, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.97, y: 8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative my-auto w-full max-w-[440px] rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <Trash2 size={18} />
                </div>
                <h3 className="mt-3 text-[15px] font-bold text-gray-900 dark:text-white">
                  Delete admin?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                  This will permanently delete{' '}
                  <b className="text-gray-900 dark:text-white">{deleteTarget.name}</b> (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {deleteTarget.email}
                  </span>
                  ). Their sessions and staff permissions will be removed. This cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm(`Permanently delete ${deleteTarget.email}?`)) return
                      deleteAdmin.mutate(
                        { userId: deleteTarget.id },
                        { onSuccess: () => setDeleteTarget(null) }
                      )
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
