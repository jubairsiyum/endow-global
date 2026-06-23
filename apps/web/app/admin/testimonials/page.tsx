'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import { Star, Plus, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react'

interface TestimonialForm {
  name: string
  program: string
  university: string
  country: string
  quote: string
  rating: number
  initials: string
  isPublished: boolean
}

const emptyForm: TestimonialForm = {
  name: '',
  program: '',
  university: '',
  country: '',
  quote: '',
  rating: 5,
  initials: '',
  isPublished: true,
}

export default function TestimonialsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TestimonialForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const { data: testimonials, isLoading } = trpc.testimonial.admin.list.useQuery()

  const createMutation = trpc.testimonial.admin.create.useMutation({
    onSuccess: () => {
      utils.testimonial.admin.list.invalidate()
      utils.testimonial.published.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.testimonial.admin.update.useMutation({
    onSuccess: () => {
      utils.testimonial.admin.list.invalidate()
      utils.testimonial.published.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.testimonial.admin.delete.useMutation({
    onSuccess: () => {
      utils.testimonial.admin.list.invalidate()
      utils.testimonial.published.invalidate()
      setDeleteConfirm(null)
    },
  })

  const togglePublishMutation = trpc.testimonial.admin.update.useMutation({
    onSuccess: () => {
      utils.testimonial.admin.list.invalidate()
      utils.testimonial.published.invalidate()
    },
  })

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(t: {
    id: string
    name: string
    program: string
    university: string
    country: string
    quote: string
    rating: number
    initials: string
    isPublished: boolean
  }) {
    setEditingId(t.id)
    setForm({
      name: t.name,
      program: t.program,
      university: t.university,
      country: t.country,
      quote: t.quote,
      rating: t.rating,
      initials: t.initials,
      isPublished: t.isPublished,
    })
    setShowModal(true)
  }

  function handleSubmit() {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form })
    } else {
      createMutation.mutate(form)
    }
  }

  function handleDelete(id: string) {
    deleteMutation.mutate({ id })
  }

  function handleTogglePublish(id: string, current: boolean) {
    togglePublishMutation.mutate({ id, isPublished: !current })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage student testimonials displayed on the homepage."
        buttonText="Add Testimonial"
        onButtonClick={openCreate}
      />

      {/* TABLE */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Student</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">University</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Country</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              )}
              {!isLoading && testimonials?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No testimonials yet. Add one to get started.</td>
                </tr>
              )}
              {testimonials?.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-bold text-white">
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.program}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.university}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.country}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(t.id, t.isPublished)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        t.isPublished
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {t.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                      {t.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                      >
                        <Pencil size={14} />
                      </button>
                      {deleteConfirm === t.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(t.id)}
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
                          onClick={() => setDeleteConfirm(t.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1a1d25]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                    placeholder="Priya Sharma"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Initials</label>
                  <input
                    type="text"
                    value={form.initials}
                    onChange={(e) => setForm({ ...form, initials: e.target.value.slice(0, 4) })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                    placeholder="PS"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Program</label>
                  <input
                    type="text"
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                    placeholder="MBA"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">University</label>
                  <input
                    type="text"
                    value={form.university}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                    placeholder="Kyung Hee University"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                    placeholder="South Korea"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
                  placeholder="What the student said..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-600 dark:text-gray-400">
                  Published on homepage
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-[#C41E3A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A01830] disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingId
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
