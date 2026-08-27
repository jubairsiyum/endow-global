'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Pencil, Trash2, X, Search, CalendarClock, TriangleAlert, RefreshCw } from 'lucide-react'

type DeadlineCategory = 'APPLICATION' | 'DOCUMENT' | 'VISA' | 'SCHOLARSHIP' | 'EXAM' | 'OTHER'

const CATEGORIES: { value: DeadlineCategory; label: string }[] = [
  { value: 'APPLICATION', label: 'Application' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'VISA', label: 'Visa' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'OTHER', label: 'Other' },
]

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]))

interface DeadlineForm {
  title: string
  description: string
  category: DeadlineCategory
  dueAt: string
  studentId: string
  relatedUniversity: string
  relatedCourse: string
  isActive: boolean
  remindDaysBefore: number
}

const emptyForm: DeadlineForm = {
  title: '',
  description: '',
  category: 'APPLICATION',
  dueAt: '',
  studentId: '',
  relatedUniversity: '',
  relatedCourse: '',
  isActive: true,
  remindDaysBefore: 7,
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

function toDateInputValue(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export default function DeadlinesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DeadlineForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const utils = trpc.useUtils()

  const { data: deadlines, isLoading, isError, refetch } = trpc.admin.deadlines.list.useQuery({
    search: debouncedSearch || undefined,
  })
  const { data: students, isLoading: studentsLoading, isError: studentsError, refetch: refetchStudents } = trpc.admin.deadlines.students.useQuery()

  const createMutation = trpc.admin.deadlines.create.useMutation({
    onSuccess: () => {
      utils.admin.deadlines.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.deadlines.update.useMutation({
    onSuccess: () => {
      utils.admin.deadlines.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.deadlines.remove.useMutation({
    onSuccess: () => {
      utils.admin.deadlines.list.invalidate()
      setDeleteConfirm(null)
    },
  })

  const toggleActiveMutation = trpc.admin.deadlines.update.useMutation({
    onSuccess: () => {
      utils.admin.deadlines.list.invalidate()
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(d: any) {
    setEditingId(d.id)
    setForm({
      title: d.title || '',
      description: d.description || '',
      category: d.category || 'OTHER',
      dueAt: d.dueAt ? toDateInputValue(new Date(d.dueAt)) : '',
      studentId: d.studentId || '',
      relatedUniversity: d.relatedUniversity || '',
      relatedCourse: d.relatedCourse || '',
      isActive: d.isActive ?? true,
      remindDaysBefore: d.remindDaysBefore ?? 7,
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    if (!form.dueAt) return
    const data = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      dueAt: new Date(form.dueAt).toISOString(),
      studentId: form.studentId || null,
      relatedUniversity: form.relatedUniversity.trim() || undefined,
      relatedCourse: form.relatedCourse.trim() || undefined,
      isActive: form.isActive,
      remindDaysBefore: form.remindDaysBefore,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  function handleToggleActive(d: any) {
    toggleActiveMutation.mutate({ id: d.id, isActive: !d.isActive })
  }

  function categoryBadge(category: string) {
    const map: Record<string, string> = {
      APPLICATION: 'bg-blue-50 text-blue-600',
      DOCUMENT: 'bg-purple-50 text-purple-600',
      VISA: 'bg-amber-50 text-amber-600',
      SCHOLARSHIP: 'bg-emerald-50 text-emerald-600',
      EXAM: 'bg-red-50 text-red-600',
      OTHER: 'bg-gray-100 text-gray-600',
    }
    return map[category] || map.OTHER
  }

  const activeCount = (deadlines || []).filter((d: any) => d.isActive).length
  const totalCount = (deadlines || []).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deadlines"
        description={`Publish important deadlines to your students. ${activeCount} active of ${totalCount} total.`}
        buttonText="Add Deadline"
        onButtonClick={openCreate}
      />

      {/* SEARCH */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or student..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary"
        />
      </div>

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[860px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600">
            <div>Deadline</div>
            <div>Category</div>
            <div>Audience</div>
            <div>Due</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid min-w-[860px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center" role="alert">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <TriangleAlert size={22} />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-600">Failed to load deadlines</p>
              <p className="mt-1 text-sm text-gray-400">Something went wrong. Please try again.</p>
              <button
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#AD0819' }}
              >
                <RefreshCw size={15} /> Try again
              </button>
            </div>
          ) : (deadlines || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CalendarClock size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No deadlines found</p>
              <p className="text-sm">Add your first deadline to get started.</p>
            </div>
          ) : (
            (deadlines || []).map((d: any) => (
              <div
                key={d.id}
                className="grid min-w-[860px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50"
              >
                <div className="min-w-0 pr-4">
                  <p className="truncate font-medium text-gray-900">{d.title}</p>
                  {d.relatedUniversity && <p className="truncate text-xs text-gray-400">{d.relatedUniversity}</p>}
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${categoryBadge(d.category)}`}>
                    {CATEGORY_LABEL[d.category] || d.category}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {d.studentId ? (d.studentName || 'Student') : 'All students'}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {d.dueAt ? format(new Date(d.dueAt), 'MMM d, yyyy · h:mm a') : '—'}
                </div>
                <div>
                  <button
                    onClick={() => handleToggleActive(d)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      d.isActive
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    {d.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(d)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === d.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate({ id: d.id })}
                        className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(d.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-200 hover:text-red-500"
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
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Deadline' : 'Add Deadline'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="e.g. Semester 1 application deadline" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DeadlineCategory })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Audience</label>
                  <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} disabled={studentsLoading || studentsError} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">All students</option>
                    {(students || []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {studentsError && (
                    <button type="button" onClick={() => refetchStudents()} className="mt-1 text-xs text-red-500 underline">
                      Students unavailable — retry
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Due date &amp; time *</label>
                <input required type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Related university</label>
                  <input value={form.relatedUniversity} onChange={(e) => setForm({ ...form, relatedUniversity: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="e.g. Seoul National University" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Related course</label>
                  <input value={form.relatedCourse} onChange={(e) => setForm({ ...form, relatedCourse: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="e.g. BSc Computer Science" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Optional details for the student" />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Remind (days before)</label>
                  <input type="number" min={0} max={365} value={form.remindDaysBefore} onChange={(e) => setForm({ ...form, remindDaysBefore: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 accent-primary" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} style={{ background: '#AD0819', boxShadow: '0 4px 12px rgba(173,8,25,0.2)' }} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 hover:shadow-lg disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
