'use client'

import { Shield, Trash2, UserCog } from 'lucide-react'
import { trpc } from '@/lib/trpc-client'

export default function AdminManagementPage() {
  const { data: admins, isLoading, refetch } = trpc.admin.super.getAdmins.useQuery()
  const updateRole = trpc.admin.super.updateAdminRole.useMutation({
    onSuccess: () => refetch(),
  })
  const deleteAdmin = trpc.admin.super.deleteAdmin.useMutation({
    onSuccess: () => refetch(),
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage platform administrators and their roles</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#11131a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(admins as any[])?.map((admin: any) => (
                <tr key={admin.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{admin.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        admin.role === 'SUPER_ADMIN'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {admin.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() =>
                            updateRole.mutate({
                              userId: admin.id,
                              role: 'SUPER_ADMIN',
                            })
                          }
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-[#1a1d25]"
                          title="Promote to Super Admin"
                        >
                          <Shield size={15} />
                        </button>
                      )}
                      {admin.role === 'SUPER_ADMIN' && (
                        <button
                          onClick={() =>
                            updateRole.mutate({
                              userId: admin.id,
                              role: 'ADMIN',
                            })
                          }
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-[#1a1d25]"
                          title="Demote to Admin"
                        >
                          <UserCog size={15} />
                        </button>
                      )}
                      {admin.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete admin "${admin.name}"?`)) {
                              deleteAdmin.mutate({ userId: admin.id })
                            }
                          }}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-[#1a1d25]"
                          title="Delete Admin"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!admins || (admins as any[]).length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
