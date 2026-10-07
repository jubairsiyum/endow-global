'use client'

import { SABadge } from '@/components/super-admin/shared/SABadge'
import { SAButton } from '@/components/super-admin/shared/SAButton'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import {
  AlertTriangle,
  Building2,
  Globe,
  MapPin,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SETUP', 'CLOSED'] as const

const STATUS_VARIANT: Record<string, 'success' | 'neutral' | 'route' | 'alert'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  SETUP: 'route',
  CLOSED: 'alert',
}

export default function SABranchesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [form, setForm] = useState({
    code: '',
    name: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    status: 'ACTIVE' as string,
    managerName: '',
    counselors: '0',
    applications: '0',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const {
    data: branchList,
    isLoading,
    error,
  } = trpc.admin.branches.list.useQuery({
    search: search || undefined,
  })

  const createMutation = trpc.admin.branches.create.useMutation({
    onSuccess: () => {
      toast.success('Branch created successfully')
      utils.admin.branches.list.invalidate()
      resetForm()
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create branch'),
  })

  const updateMutation = trpc.admin.branches.update.useMutation({
    onSuccess: () => {
      toast.success('Branch updated successfully')
      utils.admin.branches.list.invalidate()
      resetForm()
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update branch'),
  })

  const deleteMutation = trpc.admin.branches.delete.useMutation({
    onSuccess: () => {
      toast.success('Branch deleted successfully')
      utils.admin.branches.list.invalidate()
      setDeleteConfirm(null)
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to delete branch'),
  })

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({
      code: '',
      name: '',
      country: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      status: 'ACTIVE',
      managerName: '',
      counselors: '0',
      applications: '0',
    })
  }

  function startEdit(branch: any) {
    setEditingId(branch.id)
    setForm({
      code: branch.code,
      name: branch.name,
      country: branch.country,
      city: branch.city,
      address: branch.address || '',
      phone: branch.phone || '',
      email: branch.email || '',
      status: branch.status || 'ACTIVE',
      managerName: branch.managerName || '',
      counselors: branch.counselors?.toString() || '0',
      applications: branch.applications?.toString() || '0',
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      ...form,
      counselors: parseInt(form.counselors) || 0,
      applications: parseInt(form.applications) || 0,
      email: form.email || undefined,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data } as any)
    } else {
      createMutation.mutate(data as any)
    }
  }

  const is = { background: '#ffffff', borderColor: '#e5e7eb', color: '#111827' } as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Branches"
        description="Manage platform branch offices worldwide."
        buttonText="Add Branch"
        onButtonClick={() => {
          resetForm()
          setShowForm(true)
        }}
      />

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches..."
            className="focus:border-primary w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all"
          />
        </div>
        <SAButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch('')
            utils.admin.branches.list.invalidate()
          }}
        >
          <RefreshCw size={12} /> Reset
        </SAButton>
      </div>

      {/* Table using AdminTable */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[950px] grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1.2fr_1fr] border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
            {[
              'Code',
              'Branch Name',
              'Country',
              'City',
              'Manager',
              'Counselors',
              'Apps',
              'Status',
              'Actions',
            ].map((h) => (
              <div
                key={h}
                className="text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {h}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center px-4 py-20">
              <AlertTriangle size={28} className="text-red-500" />
              <p className="mt-3 text-[14px] font-medium text-red-600">Failed to load branches</p>
              <SAButton
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => utils.admin.branches.list.invalidate()}
              >
                Retry
              </SAButton>
            </div>
          ) : !branchList || branchList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Building2 size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No branches found</p>
              <p className="text-sm">Add your first branch office to get started.</p>
            </div>
          ) : (
            (branchList || []).map((branch: any) => (
              <div
                key={branch.id}
                className="grid min-w-[950px] grid-cols-[1fr_2fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1.2fr_1fr] items-center border-b border-gray-100 px-6 py-4 transition-all hover:bg-gray-50"
              >
                <div>
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: '#E8A33D', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {branch.code}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Building2 size={14} style={{ color: '#E8A33D' }} />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-gray-900">
                        {branch.name}
                      </span>
                      {branch.address && (
                        <p className="max-w-[180px] truncate text-[11px] text-gray-400">
                          {branch.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-gray-400" />
                    {branch.country}
                  </div>
                </div>
                <div className="text-[13px] text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-400" />
                    {branch.city}
                  </div>
                </div>
                <div className="text-[13px] font-medium text-gray-800">
                  {branch.managerName || '—'}
                </div>
                <div>
                  <SABadge variant="route">{branch.counselors || 0}</SABadge>
                </div>
                <div>
                  <SABadge variant="success">{branch.applications || 0}</SABadge>
                </div>
                <div>
                  <SABadge variant={STATUS_VARIANT[branch.status] || 'neutral'} dot>
                    {branch.status}
                  </SABadge>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(branch)}
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(branch.id)}
                      className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {/* CREATE / EDIT MODAL */}
      {showForm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {editingId ? 'Edit Branch' : 'Add Branch'}
                </h2>
                <button
                  onClick={resetForm}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2"
                >
                  {[
                    {
                      label: 'Branch Code *',
                      key: 'code',
                      required: true,
                      maxLength: 10,
                      placeholder: 'e.g. DAC',
                    },
                    {
                      label: 'Branch Name *',
                      key: 'name',
                      required: true,
                      placeholder: 'e.g. Dhaka Office',
                    },
                    { label: 'Country *', key: 'country', required: true },
                    { label: 'City *', key: 'city', required: true },
                    { label: 'Address', key: 'address' },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Manager Name', key: 'managerName' },
                  ].map((f) => (
                    <label key={f.key} className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-gray-700">{f.label}</span>
                      <input
                        type={f.type || 'text'}
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        required={f.required}
                        maxLength={f.maxLength}
                        className="focus:border-primary w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                        style={is}
                        placeholder={f.placeholder || f.label}
                      />
                    </label>
                  ))}

                  {/* Status */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="focus:border-primary w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                      style={is}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Counselors */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-gray-700">Counselors</span>
                    <input
                      type="number"
                      min={0}
                      value={form.counselors}
                      onChange={(e) => setForm({ ...form, counselors: e.target.value })}
                      className="focus:border-primary w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                      style={is}
                    />
                  </label>

                  {/* Applications */}
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Applications</span>
                    <input
                      type="number"
                      min={0}
                      value={form.applications}
                      onChange={(e) => setForm({ ...form, applications: e.target.value })}
                      className="focus:border-primary w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none"
                      style={is}
                    />
                  </label>

                  <div className="col-span-full flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingId
                          ? 'Update Branch'
                          : 'Create Branch'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900">Delete Branch?</h3>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. The branch office will be permanently removed.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate({ id: deleteConfirm })}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
