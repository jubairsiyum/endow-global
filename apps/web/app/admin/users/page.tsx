'use client'

import { PermissionEditor } from '@/components/admin/PermissionEditor'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  AlertTriangle,
  Crown,
  KeyRound,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCog,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

const ROLES = ['STUDENT', 'COUNSELOR', 'ADMIN', 'SUPER_ADMIN'] as const
type UserRoleType = (typeof ROLES)[number]

const ROLE_META: Record<
  string,
  {
    label: string
    dot: string
    badge: 'route' | 'success' | 'alert' | 'neutral' | 'warning'
    icon: typeof Shield
  }
> = {
  SUPER_ADMIN: { label: 'Super Admin', dot: 'alert', badge: 'alert', icon: Crown },
  ADMIN: { label: 'Admin', dot: 'route', badge: 'route', icon: Shield },
  COUNSELOR: { label: 'Counselor', dot: 'success', badge: 'success', icon: UserCog },
  STUDENT: { label: 'Student', dot: 'neutral', badge: 'neutral', icon: Shield },
}

interface SessionUser {
  id?: string
  role?: string
}

interface UserItem {
  id: string
  name?: string | null
  email: string
  role: string
  image?: string | null
  emailVerified?: boolean | null
  permissions?: unknown
}

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? ROLE_META.STUDENT
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        meta.badge === 'alert'
          ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400'
          : meta.badge === 'route'
            ? 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300'
            : meta.badge === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border border-gray-200 bg-gray-100 text-gray-700 dark:border-white/[0.08] dark:bg-gray-800 dark:text-gray-300'
      }`}
    >
      <Icon size={13} /> {meta.label}
    </span>
  )
}

export default function SAUsersPage() {
  const { data: session } = useSession()
  const sessionUser = session?.user as SessionUser | undefined
  const currentUserId = sessionUser?.id
  const currentRole = sessionUser?.role
  const isSuperAdmin = currentRole === 'SUPER_ADMIN'

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [page, setPage] = useState(0)
  const [mounted, setMounted] = useState(false)
  const limit = 30

  useEffect(() => {
    setMounted(true)
  }, [])

  // Modals
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingPerms, setEditingPerms] = useState<string[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    perms: [] as string[],
  })

  const [roleTarget, setRoleTarget] = useState<{
    id: string
    name: string
    email: string
    role: string
  } | null>(null)
  const [newRole, setNewRole] = useState<string>('ADMIN')
  const [resetTarget, setResetTarget] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.admin.super.getAllUsers.useQuery({
    search: search || undefined,
    role: roleFilter as UserRoleType | undefined,
    limit,
    offset: page * limit,
  })

  const { data: permData } = trpc.admin.super.getUserPermissions.useQuery(
    { userId: editingUserId! },
    { enabled: !!editingUserId }
  )

  useEffect(() => {
    if (!editingUserId) {
      setEditingPerms([])
      return
    }
    if (permData?.permissions) setEditingPerms(permData.permissions)
  }, [editingUserId, permData])

  useEffect(() => {
    if (roleTarget) setNewRole(roleTarget.role)
  }, [roleTarget])

  const updateRole = trpc.admin.super.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
      setRoleTarget(null)
      toast.success('Role updated')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update role — requires Super Admin'),
  })

  const deleteUser = trpc.admin.super.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      utils.admin.super.getPlatformStats.invalidate()
      toast.success('User deleted')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to delete user'),
  })

  const updatePerms = trpc.admin.super.updatePermissions.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      setEditingUserId(null)
      toast.success('Permissions updated')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update permissions'),
  })

  const createStaff = trpc.admin.super.createStaff.useMutation({
    onSuccess: () => {
      utils.admin.super.getAllUsers.invalidate()
      setShowCreate(false)
      setCreateForm({ name: '', email: '', password: '', perms: [] })
      toast.success('Staff created')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to create staff'),
  })

  const resetPassword = trpc.admin.super.resetPassword.useMutation({
    onSuccess: () => {
      setResetTarget(null)
      setNewPassword('')
      toast.success('Password reset — user must login with new password')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to reset password'),
  })

  const totalPages = data ? Math.ceil(data.total / limit) : 1
  const filteredCount = data?.users?.length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description={`Manage users, roles and module permissions. Total users: ${data?.total ?? 0}`}
        buttonText={isSuperAdmin ? 'New Staff' : undefined}
        onButtonClick={isSuperAdmin ? () => setShowCreate(true) : undefined}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-[320px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <span className="hidden text-xs text-gray-400 sm:inline">{filteredCount} shown</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {([undefined, ...ROLES] as (string | undefined)[]).map((r) => (
            <button
              key={r ?? 'all'}
              type="button"
              onClick={() => {
                setRoleFilter(r)
                setPage(0)
              }}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                roleFilter === r
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400 dark:hover:bg-white/[0.06]'
              }`}
            >
              {r ? (ROLE_META[r]?.label ?? r) : 'All roles'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setRoleFilter(undefined)
              setPage(0)
              utils.admin.super.getAllUsers.invalidate()
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[840px] grid-cols-[1fr_140px_160px_130px_90px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>User</div>
              <div>Role</div>
              <div>Access</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                  />
                ))}
              </div>
            ) : !isSuperAdmin ? (
              <div className="px-6 py-16 text-center">
                <Shield size={32} className="mx-auto text-amber-500" />
                <p className="mt-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Super Admin access required
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  User management requires Super Admin privileges. You are signed in as{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {currentRole || 'ADMIN'}
                  </span>
                  .
                </p>
              </div>
            ) : error ? (
              <div className="px-6 py-16 text-center">
                <AlertTriangle size={32} className="mx-auto text-red-500" />
                <p className="mt-3 text-lg font-semibold text-red-600 dark:text-red-400">
                  Failed to load users
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(error as any)?.message || 'Unexpected error'}
                </p>
              </div>
            ) : !data?.users?.length ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  No users found
                </p>
                <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
              </div>
            ) : (
              data.users
                .filter(
                  (user): user is UserItem =>
                    typeof user === 'object' && user !== null && 'id' in user
                )
                .map((user: UserItem & { [key: string]: any }) => {
                  const perms: string[] = (() => {
                    const raw: unknown = user.permissions
                    if (Array.isArray(raw))
                      return raw.map((p: unknown) => String(p).trim()).filter(Boolean)
                    if (typeof raw === 'string' && raw.trim()) {
                      try {
                        const p = JSON.parse(raw)
                        if (Array.isArray(p))
                          return p.map((x: unknown) => String(x).trim()).filter(Boolean)
                      } catch {}
                    }
                    return []
                  })()
                  const isSelf = currentUserId === user.id
                  const isSuper = user.role === 'SUPER_ADMIN'
                  const isAdmin = user.role === 'ADMIN'

                  return (
                    <div
                      key={user.id}
                      className="grid min-w-[840px] grid-cols-[1fr_140px_160px_130px_90px] items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0 hover:bg-gray-50/50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {user.image ? (
                            <img src={user.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            (user.name || '??').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {user.name || 'Unnamed'}
                            </span>
                            {isSelf && (
                              <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-gray-900">
                                You
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <div>
                        <RoleBadge role={user.role} />
                      </div>

                      <div>
                        {isSuper ? (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300">
                            All modules
                          </span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            {perms.length ? `${perms.length} perms` : 'Dashboard only'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            user.emailVerified
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-amber-500'}`}
                          />
                          {user.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              type="button"
                              aria-label="Actions"
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              sideOffset={6}
                              className="z-50 min-w-[180px] rounded-2xl border border-gray-200 bg-white p-1 shadow-xl dark:border-white/[0.08] dark:bg-[#18181b]"
                            >
                              <DropdownMenu.Item
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setRoleTarget({
                                    id: user.id,
                                    name: user.name || 'User',
                                    email: user.email,
                                    role: user.role,
                                  })
                                }}
                                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 focus:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.06] dark:focus:bg-white/[0.06]"
                              >
                                <UserCog size={14} /> Change role
                              </DropdownMenu.Item>
                              {isAdmin && (
                                <DropdownMenu.Item
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setEditingUserId(user.id)
                                  }}
                                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 focus:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.06] dark:focus:bg-white/[0.06]"
                                >
                                  <KeyRound size={14} /> Manage permissions
                                </DropdownMenu.Item>
                              )}
                              {!isSelf && (
                                <DropdownMenu.Item
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setResetTarget({
                                      id: user.id,
                                      name: user.name || 'User',
                                      email: user.email,
                                    })
                                  }}
                                  className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none hover:bg-gray-50 focus:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.06] dark:focus:bg-white/[0.06]"
                                >
                                  <Lock size={14} /> Reset password
                                </DropdownMenu.Item>
                              )}
                              <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-white/[0.08]" />
                              <DropdownMenu.Item
                                disabled={isSuper}
                                onSelect={(e) => {
                                  e.preventDefault()
                                  if (isSuper) return
                                  if (confirm(`Delete ${user.email}? This cannot be undone.`)) {
                                    deleteUser.mutate({ userId: user.id })
                                  }
                                }}
                                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 outline-none hover:bg-red-50 focus:bg-red-50 disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40 dark:focus:bg-red-950/40"
                              >
                                <Trash2 size={14} /> Delete user
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </div>
                  )
                })
            )}
          </div>

          {data && data.total > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-white/[0.08] dark:bg-[#18181b]/80 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing{' '}
                <b className="text-gray-900 dark:text-white">
                  {page * limit + 1}–{Math.min((page + 1) * limit, data.total)}
                </b>{' '}
                of <b className="text-gray-900 dark:text-white">{data.total}</b>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </AdminTable>
      </div>

      {/* Modals via Portals */}
      {showCreate &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Staff</h2>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4 py-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Alex Rahman"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="staff@endowglobal.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Module Permissions
                  </label>
                  <PermissionEditor
                    value={createForm.perms}
                    onChange={(v) => setCreateForm({ ...createForm, perms: v })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    createStaff.isPending || !createForm.name.trim() || !createForm.email.trim()
                  }
                  onClick={() =>
                    createStaff.mutate({
                      name: createForm.name.trim(),
                      email: createForm.email.trim(),
                      password: createForm.password || undefined,
                      permissions: createForm.perms,
                    })
                  }
                  style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  {createStaff.isPending ? 'Creating…' : 'Create staff'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {roleTarget &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Role</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update role for {roleTarget.name}
              </p>
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Select New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_META[r].label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRoleTarget(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updateRole.isPending || newRole === roleTarget.role}
                  onClick={() => updateRole.mutate({ userId: roleTarget.id, role: newRole as any })}
                  style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  {updateRole.isPending ? 'Updating…' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {resetTarget &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reset Password</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set a new temporary password for {resetTarget.name}
              </p>
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={resetPassword.isPending || newPassword.length < 8}
                  onClick={() => resetPassword.mutate({ userId: resetTarget.id, newPassword })}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {resetPassword.isPending ? 'Resetting…' : 'Reset password'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {editingUserId &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/[0.08]">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Module Permissions
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="py-4">
                <PermissionEditor value={editingPerms} onChange={setEditingPerms} />
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updatePerms.isPending}
                  onClick={() =>
                    updatePerms.mutate({ userId: editingUserId!, permissions: editingPerms })
                  }
                  style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                  className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  {updatePerms.isPending ? 'Saving…' : 'Save permissions'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
