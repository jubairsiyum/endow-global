'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Users, Star, Globe, BookOpen } from 'lucide-react'

interface CounselorForm {
  name: string
  email: string
  bio: string
  expertiseCountries: string
  expertiseSubjects: string
  languages: string
  calUsername: string
  sessionRate: string
  isAvailable: boolean
}

const emptyForm: CounselorForm = {
  name: '', email: '', bio: '', expertiseCountries: '', expertiseSubjects: '',
  languages: 'English', calUsername: '', sessionRate: '0', isAvailable: true,
}

export default function CounselorsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CounselorForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const { data: counselors, isLoading } = trpc.admin.counselors.list.useQuery()

  const createMutation = trpc.admin.counselors.create.useMutation({
    onSuccess: () => {
      utils.admin.counselors.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.counselors.update.useMutation({
    onSuccess: () => {
      utils.admin.counselors.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.counselors.delete.useMutation({
    onSuccess: () => {
      utils.admin.counselors.list.invalidate()
      setDeleteConfirm(null)
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(c: any) {
    setEditingId(c.id)
    setForm({
      name: c.name || '',
      email: c.email || '',
      bio: c.counselorProfile?.bio || '',
      expertiseCountries: Array.isArray(c.counselorProfile?.expertiseCountries) ? c.counselorProfile.expertiseCountries.join(', ') : '',
      expertiseSubjects: Array.isArray(c.counselorProfile?.expertiseSubjects) ? c.counselorProfile.expertiseSubjects.join(', ') : '',
      languages: Array.isArray(c.counselorProfile?.languages) ? c.counselorProfile.languages.join(', ') : 'English',
      calUsername: c.counselorProfile?.calUsername || '',
      sessionRate: c.counselorProfile?.sessionRate?.toString() || '0',
      isAvailable: c.counselorProfile?.isAvailable ?? true,
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      name: form.name,
      email: form.email,
      bio: form.bio || undefined,
      expertiseCountries: form.expertiseCountries ? form.expertiseCountries.split(',').map(s => s.trim()).filter(Boolean) : [],
      expertiseSubjects: form.expertiseSubjects ? form.expertiseSubjects.split(',').map(s => s.trim()).filter(Boolean) : [],
      languages: form.languages ? form.languages.split(',').map(s => s.trim()).filter(Boolean) : ['English'],
      calUsername: form.calUsername || undefined,
      sessionRate: Number(form.sessionRate),
      isAvailable: form.isAvailable,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Counselors"
        description="Manage counselor accounts and profiles."
        buttonText="Add Counselor"
        onButtonClick={openCreate}
      />

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
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
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                </div>
              ))}
            </div>
          ) : (counselors || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No counselors found</p>
              <p className="text-sm">Add your first counselor to get started.</p>
            </div>
          ) : (
            (counselors || []).map((c: any) => (
              <div
                key={c.id}
                className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                    {c.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.email}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(c.counselorProfile?.expertiseSubjects) && c.counselorProfile.expertiseSubjects.length > 0 ? (
                    c.counselorProfile.expertiseSubjects.slice(0, 2).map((s: string, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Array.isArray(c.counselorProfile?.languages) ? c.counselorProfile.languages.join(', ') : '—'}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {c.counselorProfile?.rating?.toFixed(1) || '—'}
                  </span>
                </div>
                <div>
                  {c.counselorProfile?.isAvailable !== false ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Available</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">Unavailable</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]"
                  >
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === c.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate({ id: c.id })}
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
                      onClick={() => setDeleteConfirm(c.id)}
                      className="rounded-xl bg-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-12 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Counselor' : 'Add Counselor'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#222530]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Expertise Subjects (comma-separated)</label>
                <input value={form.expertiseSubjects} onChange={e => setForm({ ...form, expertiseSubjects: e.target.value })} placeholder="e.g. MBA, Engineering" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Expertise Countries (comma-separated)</label>
                <input value={form.expertiseCountries} onChange={e => setForm({ ...form, expertiseCountries: e.target.value })} placeholder="e.g. USA, UK, Canada" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Languages (comma-separated)</label>
                <input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Session Rate ($)</label>
                <input type="number" min="0" value={form.sessionRate} onChange={e => setForm({ ...form, sessionRate: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Cal.com Username</label>
                <input value={form.calUsername} onChange={e => setForm({ ...form, calUsername: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 rounded border-gray-300 accent-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for consultations</span>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Counselor' : 'Create Counselor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
