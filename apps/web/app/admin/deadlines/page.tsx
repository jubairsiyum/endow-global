'use client'

import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { format } from 'date-fns'
import { CalendarClock, Pencil, RefreshCw, Search, Trash2, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type DeadlineCategory = 'APPLICATION' | 'DOCUMENT' | 'VISA' | 'SCHOLARSHIP' | 'EXAM' | 'OTHER'

const CATEGORIES: { value: DeadlineCategory; label: string }[] = [
  { value: 'APPLICATION', label: 'Application' },
  { value: 'DOCUMENT', label: 'Document' },
  { value: 'VISA', label: 'Visa' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'OTHER', label: 'Other' },
]

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
)

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

interface DeadlineItem {
  id: string
  title?: string | null
  description?: string | null
  category: string
  dueAt?: string | Date | null
  studentId?: string | null
  studentName?: string | null
  relatedUniversity?: string | null
  relatedCourse?: string | null
  isActive?: boolean
  remindDaysBefore?: number
}

interface StudentItem {
  id: string
  name?: string | null
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()

  const {
    data: deadlinesData,
    isLoading,
    isError,
    refetch,
  } = trpc.admin.deadlines.list.useQuery({
    search: debouncedSearch || undefined,
  })

  const {
    data: studentsData,
    isLoading: studentsLoading,
    isError: studentsError,
    refetch: refetchStudents,
  } = trpc.admin.deadlines.students.useQuery()

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

  const deadlines: DeadlineItem[] = (deadlinesData as DeadlineItem[]) || []
  const students: StudentItem[] = (studentsData as StudentItem[]) || []

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(d: DeadlineItem) {
    setEditingId(d.id)
    setForm({
      title: d.title || '',
      description: d.description || '',
      category: (d.category as DeadlineCategory) || 'OTHER',
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

  function handleToggleActive(d: DeadlineItem) {
    toggleActiveMutation.mutate({ id: d.id, isActive: !d.isActive })
  }

  function categoryBadge(category: string) {
    const map: Record<string, string> = {
      APPLICATION: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
      DOCUMENT: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300',
      VISA: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300',
      SCHOLARSHIP: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
      EXAM: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300',
      OTHER: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    }
    return map[category] || map.OTHER
  }

  const activeCount = deadlines.filter((d) => d.isActive).length
  const totalCount = deadlines.length

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
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
        />
      </div>

      {/* TABLE */}
      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[860px] grid-cols-6 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
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
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid min-w-[860px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 dark:border-white/[0.06]"
                  >
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                className="flex flex-col items-center justify-center px-6 py-16 text-center"
                role="alert"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                  <TriangleAlert size={22} />
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Failed to load deadlines
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Something went wrong. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  style={{ background: '#c41e3a' }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  <RefreshCw size={15} /> Try again
                </button>
              </div>
            ) : deadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <CalendarClock size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No deadlines found
                </p>
                <p className="text-sm">Add your first deadline to get started.</p>
              </div>
            ) : (
              deadlines.map((d) => (
                <div
                  key={d.id}
                  className="grid min-w-[860px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 pr-4">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{d.title}</p>
                    {d.relatedUniversity && (
                      <p className="truncate text-xs text-gray-400">{d.relatedUniversity}</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${categoryBadge(
                        d.category
                      )}`}
                    >
                      {CATEGORY_LABEL[d.category] || d.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {d.studentId ? d.studentName || 'Student' : 'All students'}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {d.dueAt ? format(new Date(d.dueAt), 'MMM d, yyyy · h:mm a') : '—'}
                  </div>
                  <div>
                    <button
                      onClick={() => handleToggleActive(d)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        d.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/60 dark:text-green-300'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {d.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(d)}
                      className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                    >
                      <Pencil size={14} />
                    </button>
                    {deleteConfirm === d.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteMutation.mutate({ id: d.id })}
                          className="rounded-lg bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(d.id)}
                        className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Deadline' : 'Add Deadline'}
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
                    Title *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    placeholder="e.g. Semester 1 application deadline"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value as DeadlineCategory })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Audience
                    </label>
                    <select
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      disabled={studentsLoading || studentsError}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] disabled:bg-gray-50 disabled:text-gray-400 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:disabled:bg-gray-900"
                    >
                      <option value="">All students</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {studentsError && (
                      <button
                        type="button"
                        onClick={() => refetchStudents()}
                        className="mt-1 text-xs text-red-500 underline"
                      >
                        Students unavailable — retry
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due date &amp; time *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.dueAt}
                    onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Related university
                    </label>
                    <input
                      value={form.relatedUniversity}
                      onChange={(e) => setForm({ ...form, relatedUniversity: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      placeholder="e.g. Seoul National University"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Related course
                    </label>
                    <input
                      value={form.relatedCourse}
                      onChange={(e) => setForm({ ...form, relatedCourse: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                      placeholder="e.g. BSc Computer Science"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    placeholder="Optional details for the student"
                  />
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Remind (days before)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={365}
                      value={form.remindDaysBefore}
                      onChange={(e) =>
                        setForm({ ...form, remindDaysBefore: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 pt-6">
                    <label className="flex cursor-pointer select-none items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 accent-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b]"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingId(null)
                      setForm(emptyForm)
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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
    </div>
  )
}
