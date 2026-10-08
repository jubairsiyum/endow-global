'use client'

import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { Mail, Pencil, Search, Trash2, UserCheck, UserX, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface SubscriberForm {
  email: string
  name: string
  isActive: boolean
  tags: string
}

interface SubscriberItem {
  id: string
  email: string
  name?: string | null
  isActive?: boolean | null
  tags?: string[] | null
}

const emptyForm: SubscriberForm = {
  email: '',
  name: '',
  isActive: true,
  tags: '',
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()

  const { data: subscribersData, isLoading } = trpc.admin.newsletters.list.useQuery({
    search: debouncedSearch || undefined,
  })

  const subscribers: SubscriberItem[] = (subscribersData as SubscriberItem[]) || []

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

  function openEdit(s: SubscriberItem) {
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
      tags: form.tags
        ? form.tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  function handleToggleActive(id: string, current?: boolean | null) {
    toggleActiveMutation.mutate({ id, isActive: !(current ?? true) })
  }

  const activeCount = subscribers.filter((s) => s.isActive).length
  const totalCount = subscribers.length

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
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
        />
      </div>

      {/* TABLE */}
      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[700px] grid-cols-5 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Email</div>
              <div>Name</div>
              <div>Tags</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {isLoading ? (
              <div className="py-10">
                <div className="flex justify-center pb-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid min-w-[700px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 dark:border-white/[0.06]"
                  >
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : subscribers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <Mail size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No subscribers found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add your first subscriber to get started.
                </p>
              </div>
            ) : (
              subscribers.map((s) => (
                <div
                  key={s.id}
                  className="grid min-w-[700px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
                      {s.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{s.email}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{s.name || '—'}</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(s.tags) && s.tags.length > 0 ? (
                      s.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
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
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/60 dark:text-green-300'
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
                      className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(s.id)}
                      className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminTable>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Subscriber' : 'Add Subscriber'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    placeholder="subscriber@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    placeholder="e.g. newsletter, updates"
                  />
                </div>
                <label className="flex cursor-pointer select-none items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 accent-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b]"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active subscriber
                  </span>
                </label>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingId(null)
                      setForm(emptyForm)
                    }}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingId
                        ? 'Update'
                        : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete Subscriber?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The subscriber will be permanently removed.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
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
