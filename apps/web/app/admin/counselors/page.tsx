'use client'

import { ImageUploader } from '@/components/super-admin/shared/ImageUploader'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { Pencil, Star, Trash2, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

interface CounselorProfile {
  bio?: string | null
  expertiseSubjects?: string[] | string | null
  expertiseCountries?: string[] | string | null
  languages?: string[] | string | null
  sessionRate?: number | null
  calUsername?: string | null
  isAvailable?: boolean | null
  rating?: number | null
}

interface Counselor {
  id: string
  name: string
  email: string
  image?: string | null
  counselorProfile?: CounselorProfile | null
}

interface CounselorFormState {
  name: string
  email: string
  bio: string
  expertiseSubjects: string
  expertiseCountries: string
  languages: string
  sessionRate: string
  calUsername: string
  isAvailable: boolean
  image: string
}

function safeArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[]
  if (typeof val === 'string') {
    try {
      const p = JSON.parse(val)
      return Array.isArray(p) ? (p as string[]) : []
    } catch {
      return []
    }
  }
  return []
}

export default function CounselorsPage() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CounselorFormState>({
    name: '',
    email: '',
    bio: '',
    expertiseSubjects: '',
    expertiseCountries: '',
    languages: 'English',
    sessionRate: '0',
    calUsername: '',
    isAvailable: true,
    image: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const { data: counselors, isLoading } = trpc.admin.counselors.list.useQuery()

  const createMutation = trpc.admin.counselors.create.useMutation({
    onSuccess: () => {
      toast.success('Counselor created')
      utils.admin.counselors.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to create counselor'),
  })

  const updateMutation = trpc.admin.counselors.update.useMutation({
    onSuccess: () => {
      toast.success('Counselor updated')
      utils.admin.counselors.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update counselor'),
  })

  const deleteMutation = trpc.admin.counselors.delete.useMutation({
    onSuccess: () => {
      toast.success('Counselor deleted')
      utils.admin.counselors.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to delete counselor'),
  })

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm({
      name: '',
      email: '',
      bio: '',
      expertiseSubjects: '',
      expertiseCountries: '',
      languages: 'English',
      sessionRate: '0',
      calUsername: '',
      isAvailable: true,
      image: '',
    })
  }

  function openCreate() {
    setEditingId(null)
    setForm({
      name: '',
      email: '',
      bio: '',
      expertiseSubjects: '',
      expertiseCountries: '',
      languages: 'English',
      sessionRate: '0',
      calUsername: '',
      isAvailable: true,
      image: '',
    })
    setShowModal(true)
  }

  function openEdit(c: Counselor) {
    setEditingId(c.id)
    setForm({
      name: c.name || '',
      email: c.email || '',
      bio: c.counselorProfile?.bio || '',
      expertiseSubjects: safeArray(c.counselorProfile?.expertiseSubjects).join(', '),
      expertiseCountries: safeArray(c.counselorProfile?.expertiseCountries).join(', '),
      languages: safeArray(c.counselorProfile?.languages).join(', ') || 'English',
      sessionRate: c.counselorProfile?.sessionRate?.toString() || '0',
      calUsername: c.counselorProfile?.calUsername || '',
      isAvailable: c.counselorProfile?.isAvailable ?? true,
      image: c.image || '',
    })
    setShowModal(true)
  }

  function buildData() {
    return {
      name: form.name,
      email: form.email,
      bio: form.bio || undefined,
      expertiseSubjects: form.expertiseSubjects
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      expertiseCountries: form.expertiseCountries
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      languages: form.languages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      sessionRate: Number(form.sessionRate) || 0,
      calUsername: form.calUsername || undefined,
      isAvailable: form.isAvailable,
    }
  }

  function onSave() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    const data = buildData()
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data, image: form.image || undefined })
    } else {
      createMutation.mutate({ ...data, image: form.image || undefined })
    }
  }

  const counselorList: Counselor[] = (counselors as Counselor[]) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Counselors"
        description="Manage counselor accounts and profiles."
        buttonText="Add Counselor"
        onButtonClick={openCreate}
      />

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Counselor</div>
              <div>Expertise</div>
              <div>Languages</div>
              <div>Rating</div>
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
                    className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 dark:border-white/[0.06]"
                  >
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : counselorList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <Users size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No counselors found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add your first counselor to get started.
                </p>
              </div>
            ) : (
              counselorList.map((c) => (
                <div
                  key={c.id}
                  className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="shadow-xs flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
                      style={{ background: 'linear-gradient(135deg, #c41e3a, #a01830)' }}
                    >
                      {c.image ? (
                        <img
                          src={c.image}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="text-sm font-bold text-white">
                          {c.name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || '??'}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{c.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {safeArray(c.counselorProfile?.expertiseSubjects)
                      .slice(0, 2)
                      .map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        >
                          {s}
                        </span>
                      ))}
                    {safeArray(c.counselorProfile?.expertiseSubjects).length === 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {safeArray(c.counselorProfile?.languages).join(', ') || '—'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {c.counselorProfile?.rating?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <div>
                    {c.counselorProfile?.isAvailable !== false ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      <Pencil size={14} />
                    </button>
                    {deleteConfirm === c.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteMutation.mutate({ id: c.id })}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(c.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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

      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Counselor' : 'Add Counselor'}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 overflow-y-auto px-6 py-6">
                <ImageUploader
                  value={form.image}
                  onChange={(v: string) => setForm((p) => ({ ...p, image: v }))}
                  label="Profile Image"
                  previewHeight={120}
                />
                <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expertise Subjects (comma)
                    </label>
                    <input
                      value={form.expertiseSubjects}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, expertiseSubjects: e.target.value }))
                      }
                      placeholder="e.g. MBA, Engineering"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expertise Countries (comma)
                    </label>
                    <input
                      value={form.expertiseCountries}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, expertiseCountries: e.target.value }))
                      }
                      placeholder="e.g. USA, UK"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Languages (comma)
                    </label>
                    <input
                      value={form.languages}
                      onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))}
                      placeholder="English, Bengali"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Session Rate ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.sessionRate}
                      onChange={(e) => setForm((p) => ({ ...p, sessionRate: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cal.com Username
                    </label>
                    <input
                      value={form.calUsername}
                      onChange={(e) => setForm((p) => ({ ...p, calUsername: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <label className="flex cursor-pointer select-none items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.isAvailable}
                        onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available for consultations
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingId
                          ? 'Update Counselor'
                          : 'Create Counselor'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
