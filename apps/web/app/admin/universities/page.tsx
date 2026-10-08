'use client'

import { ImageUploader } from '@/components/super-admin/shared/ImageUploader'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import {
  Building2,
  ExternalLink,
  EyeOff,
  Globe,
  Hash,
  MapPin,
  Pencil,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface UniForm {
  name: string
  slug: string
  country: string
  city: string
  description: string
  logo: string
  coverImage: string
  ranking: string
  koreaRanking: string
  website: string
  established: string
  totalStudents: string
  internationalStudents: string
  isActive: boolean
}

const emptyForm: UniForm = {
  name: '',
  slug: '',
  country: '',
  city: '',
  description: '',
  logo: '',
  coverImage: '',
  ranking: '',
  koreaRanking: '',
  website: '',
  established: '',
  totalStudents: '',
  internationalStudents: '',
  isActive: true,
}

interface UniversityItem {
  id: string
  name?: string | null
  slug?: string | null
  country?: string | null
  city?: string | null
  description?: string | null
  logo?: string | null
  coverImage?: string | null
  ranking?: string | number | null
  koreaRanking?: number | null
  website?: string | null
  established?: number | null
  totalStudents?: number | null
  internationalStudents?: number | null
  isActive?: boolean | null
  programCount?: number | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  courses?: any[] | null
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()

  const {
    data: universitiesData,
    isLoading,
    isError,
    error: universitiesError,
  } = trpc.admin.universities.list.useQuery({
    search: debouncedSearch || undefined,
    country: countryFilter || undefined,
  })

  const universities = (universitiesData as UniversityItem[]) || []

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

  const countries = Array.from(
    new Set(universities.map((u) => u.country).filter(Boolean))
  ).sort() as string[]

  function openCreate() {
    createMutation.reset()
    updateMutation.reset()
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(u: UniversityItem) {
    createMutation.reset()
    updateMutation.reset()
    setEditingId(u.id)
    setForm({
      name: u.name || '',
      slug: u.slug || '',
      country: u.country || '',
      city: u.city || '',
      description: u.description || '',
      logo: u.logo || '',
      coverImage: u.coverImage || '',
      ranking: u.ranking?.toString() || '',
      koreaRanking: u.koreaRanking?.toString() || '',
      website: u.website || '',
      established: u.established?.toString() || '',
      totalStudents: u.totalStudents?.toString() || '',
      internationalStudents: u.internationalStudents?.toString() || '',
      isActive: u.isActive ?? true,
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      name: form.name,
      slug: form.slug,
      country: form.country,
      city: form.city,
      description: form.description,
      isActive: form.isActive,
      ...(form.logo ? { logo: form.logo } : {}),
      ...(form.coverImage ? { coverImage: form.coverImage } : {}),
      ...(form.website ? { website: form.website } : {}),
      ...(form.ranking ? { ranking: form.ranking.trim() } : {}),
      ...(form.koreaRanking ? { koreaRanking: Number(form.koreaRanking) } : {}),
      ...(form.established ? { established: Number(form.established) } : {}),
      ...(form.totalStudents ? { totalStudents: Number(form.totalStudents) } : {}),
      ...(form.internationalStudents
        ? { internationalStudents: Number(form.internationalStudents) }
        : {}),
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutation.mutate(data as any)
    }
  }

  function updateField(field: keyof UniForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 lg:w-48"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
        >
          Unable to load universities.{' '}
          {(universitiesError as { message?: string } | null)?.message ||
            'Please check the database connection and try again.'}
        </div>
      )}

      {/* TABLE */}
      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
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
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 dark:border-white/[0.06]"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-400">
              <Building2 size={48} className="mb-3" />
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                Unable to load universities
              </p>
              <p className="text-sm text-red-500">
                Use the error above to identify the configuration issue.
              </p>
            </div>
          ) : universities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <Building2 size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                No universities found
              </p>
              <p className="text-sm">Add your first university to get started.</p>
            </div>
          ) : (
            universities.map((u) => (
              <div
                key={u.id}
                className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                  {u.website && (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 flex items-center gap-1 text-xs text-[#c41e3a] hover:underline"
                    >
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
                <div className="flex flex-wrap gap-1.5">
                  {u.ranking ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      <Hash size={11} /> QS {u.ranking}
                    </span>
                  ) : null}
                  {u.koreaRanking ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <Hash size={11} /> KR #{u.koreaRanking}
                    </span>
                  ) : null}
                  {!u.ranking && !u.koreaRanking && (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Number(u.programCount ?? (u.courses || []).length)}{' '}
                  {Number(u.programCount ?? (u.courses || []).length) === 1
                    ? 'program'
                    : 'programs'}
                </div>
                <div>
                  {u.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <EyeOff size={11} /> Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(u.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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
      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit University' : 'Add University'}
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

              <div className="min-h-0 overflow-y-auto">
                {(createMutation.isError || updateMutation.isError) && (
                  <div
                    role="alert"
                    className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
                  >
                    {(createMutation.error as { message?: string } | null)?.message ||
                      (updateMutation.error as { message?: string } | null)?.message ||
                      'Unable to save this university. Please try again.'}
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      University Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => {
                        updateField('name', e.target.value)
                        updateField(
                          'slug',
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '')
                        )
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <input
                      required
                      value={form.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country *
                    </label>
                    <input
                      required
                      value={form.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      placeholder="e.g. South Korea"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City *
                    </label>
                    <input
                      required
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="e.g. Seoul"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      QS Ranking
                    </label>
                    <input
                      type="text"
                      value={form.ranking}
                      onChange={(e) => updateField('ranking', e.target.value)}
                      placeholder="e.g. 1001-1100"
                      maxLength={50}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ranking in Korea
                    </label>
                    <input
                      type="number"
                      value={form.koreaRanking}
                      onChange={(e) => updateField('koreaRanking', e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ImageUploader
                      value={form.logo}
                      onChange={(v) => updateField('logo', v)}
                      label="University Logo"
                      previewHeight={120}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Website
                    </label>
                    <input
                      value={form.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Established (Year)
                    </label>
                    <input
                      type="number"
                      value={form.established}
                      onChange={(e) => updateField('established', e.target.value)}
                      placeholder="e.g. 1978"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Students
                    </label>
                    <input
                      type="number"
                      value={form.totalStudents}
                      onChange={(e) => updateField('totalStudents', e.target.value)}
                      placeholder="e.g. 8500"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Intl. Students
                    </label>
                    <input
                      type="number"
                      value={form.internationalStudents}
                      onChange={(e) => updateField('internationalStudents', e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description *
                    </label>
                    <textarea
                      required
                      value={form.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ImageUploader
                      value={form.coverImage}
                      onChange={(v) => updateField('coverImage', v)}
                      label="Cover Image"
                      previewHeight={100}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 dark:border-white/[0.08] dark:bg-[#09090b]/50 sm:col-span-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Frontend visibility
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {form.isActive
                          ? 'This university is visible to students.'
                          : 'This university is hidden from the frontend.'}
                      </p>
                    </div>
                    <label className="inline-flex shrink-0 cursor-pointer items-center gap-2.5">
                      <span
                        className={`text-xs font-semibold ${
                          form.isActive ? 'text-[#c41e3a]' : 'text-gray-500'
                        }`}
                      >
                        {form.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => updateField('isActive', e.target.checked)}
                        aria-label="Toggle frontend visibility"
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="relative h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-[#c41e3a] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#c41e3a]/40 peer-focus-visible:ring-offset-2 dark:bg-gray-700"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
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
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? 'Saving...'
                        : editingId
                          ? 'Update University'
                          : 'Create University'}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete University?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. All associated courses will also be removed.
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
