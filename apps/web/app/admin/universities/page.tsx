'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, Building2, Globe, MapPin, Hash, ExternalLink, EyeOff } from 'lucide-react'

interface UniForm {
  name: string
  slug: string
  country: string
  city: string
  description: string
  logo: string
  coverImage: string
  ranking: string
  website: string
  established: string
  totalStudents: string
  internationalPercent: string
  isActive: boolean
}

const emptyForm: UniForm = {
  name: '', slug: '', country: '', city: '', description: '',
  logo: '', coverImage: '', ranking: '', website: '', established: '',
  totalStudents: '', internationalPercent: '', isActive: true,
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function UniversitiesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UniForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [countryFilter, setCountryFilter] = useState('')

  const utils = trpc.useUtils()

  const { data: universities, isLoading } = trpc.admin.universities.list.useQuery({
    search: debouncedSearch || undefined,
    country: countryFilter || undefined,
  })

  const createMutation = trpc.admin.universities.create.useMutation({
    onSuccess: () => {
      utils.admin.universities.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.universities.update.useMutation({
    onSuccess: () => {
      utils.admin.universities.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.universities.delete.useMutation({
    onSuccess: () => {
      utils.admin.universities.list.invalidate()
      setDeleteConfirm(null)
    },
  })

  const countries = [...new Set((universities || []).map(u => u.country).filter(Boolean))].sort()

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(u: any) {
    setEditingId(u.id)
    setForm({
      name: u.name || '', slug: u.slug || '', country: u.country || '',
      city: u.city || '', description: u.description || '',
      logo: u.logo || '', coverImage: u.coverImage || '',
      ranking: u.ranking?.toString() || '', website: u.website || '',
      established: u.established?.toString() || '',
      totalStudents: u.totalStudents?.toString() || '',
      internationalPercent: u.internationalPercent?.toString() || '',
      isActive: u.isActive ?? true,
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      ...form,
      ranking: form.ranking ? Number(form.ranking) : undefined,
      established: form.established ? Number(form.established) : undefined,
      totalStudents: form.totalStudents ? Number(form.totalStudents) : undefined,
      internationalPercent: form.internationalPercent ? Number(form.internationalPercent) : undefined,
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      createMutation.mutate(data as any)
    }
  }

  function updateField(field: keyof UniForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Universities"
        description="Manage partner universities. Changes reflect immediately on the frontend."
        buttonText="Add University"
        onButtonClick={openCreate}
      />

      {/* SEARCH + FILTER */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white"
          />
        </div>
        <select
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white lg:w-48"
        >
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>University</div>
            <div>Country / City</div>
            <div>Ranking</div>
            <div>Courses</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                  <div className="space-y-2"><div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" /></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-[#222530]" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-[#222530]" />
                </div>
              ))}
            </div>
          ) : (universities || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Building2 size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No universities found</p>
              <p className="text-sm">Add your first university to get started.</p>
            </div>
          ) : (
            (universities || []).map(u => (
              <div
                key={u.id}
                className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                  {u.website && (
                    <a href={u.website} target="_blank" rel="noopener" className="mt-0.5 flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink size={10} /> Website
                    </a>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Globe size={13} className="text-gray-400" />
                    {u.country}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin size={11} /> {u.city}
                  </div>
                </div>
                <div>
                  {u.ranking ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <Hash size={11} /> #{u.ranking}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(u.courses || []).length} programs
                </div>
                <div>
                  {u.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                      <EyeOff size={11} /> Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
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
                {editingId ? 'Edit University' : 'Add University'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#222530]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">University Name *</label>
                <input required value={form.name} onChange={e => { updateField('name', e.target.value); updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) }} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Slug *</label>
                <input required value={form.slug} onChange={e => updateField('slug', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Country *</label>
                <input required value={form.country} onChange={e => updateField('country', e.target.value)} placeholder="e.g. South Korea" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">City *</label>
                <input required value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="e.g. Seoul" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Ranking</label>
                <input type="number" value={form.ranking} onChange={e => updateField('ranking', e.target.value)} placeholder="e.g. 150" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Logo URL</label>
                <input value={form.logo} onChange={e => updateField('logo', e.target.value)} placeholder="/universities/university.png" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                <input value={form.website} onChange={e => updateField('website', e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Established (Year)</label>
                <input type="number" value={form.established} onChange={e => updateField('established', e.target.value)} placeholder="e.g. 1978" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Total Students</label>
                <input type="number" value={form.totalStudents} onChange={e => updateField('totalStudents', e.target.value)} placeholder="e.g. 15000" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Intl. Student %</label>
                <input type="number" step="0.1" value={form.internationalPercent} onChange={e => updateField('internationalPercent', e.target.value)} placeholder="e.g. 15.5" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                <textarea required value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                <input value={form.coverImage} onChange={e => updateField('coverImage', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => updateField('isActive', e.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-primary" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active (visible on frontend)</span>
                </label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update University' : 'Create University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete University?</h3>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone. All associated courses will also be removed.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">Cancel</button>
              <button onClick={() => deleteMutation.mutate({ id: deleteConfirm })} disabled={deleteMutation.isPending} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
