'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, Mail, UserCheck, UserX } from 'lucide-react'

interface SubscriberForm {
  email: string
  name: string
  isActive: boolean
  tags: string
}

const emptyForm: SubscriberForm = {
  email: '', name: '', isActive: true, tags: '',
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function NewslettersPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SubscriberForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const { data: subscribers, isLoading } = trpc.admin.newsletters.list.useQuery({
    search: debouncedSearch || undefined,
  })

  const createMutation = trpc.admin.newsletters.create.useMutation({
    onSuccess: () => {
      utils.admin.newsletters.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.newsletters.update.useMutation({
    onSuccess: () => {
      utils.admin.newsletters.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.newsletters.delete.useMutation({
    onSuccess: () => {
      utils.admin.newsletters.list.invalidate()
      setDeleteConfirm(null)
    },
  })

  const toggleActiveMutation = trpc.admin.newsletters.update.useMutation({
    onSuccess: () => {
      utils.admin.newsletters.list.invalidate()
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(s: any) {
    setEditingId(s.id)
    setForm({
      email: s.email || '',
      name: s.name || '',
      isActive: s.isActive ?? true,
      tags: Array.isArray(s.tags) ? s.tags.join(', ') : '',
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      email: form.email,
      name: form.name || undefined,
      isActive: form.isActive,
      tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  function handleToggleActive(id: string, current: boolean) {
    toggleActiveMutation.mutate({ id, isActive: !current })
  }

  const activeCount = (subscribers || []).filter(s => s.isActive).length
  const totalCount = (subscribers || []).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter Subscribers"
        description={`Manage your email subscribers. ${activeCount} active of ${totalCount} total.`}
        buttonText="Add Subscriber"
        onButtonClick={openCreate}
      />

      {/* SEARCH */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white"
        />
      </div>

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[700px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>Email</div>
            <div>Name</div>
            <div>Tags</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid min-w-[700px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                </div>
              ))}
            </div>
          ) : (subscribers || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Mail size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No subscribers found</p>
              <p className="text-sm">Add your first subscriber to get started.</p>
            </div>
          ) : (
            (subscribers || []).map(s => (
              <div
                key={s.id}
                className="grid min-w-[700px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
                    {s.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{s.email}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{s.name || '—'}</div>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(s.tags) && s.tags.length > 0 ? (
                    s.tags.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleToggleActive(s.id, s.isActive)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      s.isActive
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {s.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                    {s.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === s.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate({ id: s.id })}
                        className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(s.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Subscriber' : 'Add Subscriber'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#222530]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="subscriber@example.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="e.g. newsletter, updates" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 accent-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active subscriber</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
