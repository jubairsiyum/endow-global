'use client'

import { SAButton } from '@/components/super-admin/shared/SAButton'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import { Globe, Pencil, RefreshCw, Search, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

interface CountryItem {
  code: string
  name: string
  flagUrl?: string | null
  continent?: string | null
}

interface CountryFormState {
  code: string
  name: string
  flagUrl: string
  continent: string
}

export default function SACountriesPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<CountryFormState>({
    code: '',
    name: '',
    flagUrl: '',
    continent: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const {
    data: countryList,
    isLoading,
    error,
  } = trpc.admin.countries.list.useQuery({ search: search || undefined })

  const createMutation = trpc.admin.countries.create.useMutation({
    onSuccess: () => {
      toast.success('Country created')
      utils.admin.countries.list.invalidate()
      resetForm()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to create country'),
  })

  const updateMutation = trpc.admin.countries.update.useMutation({
    onSuccess: () => {
      toast.success('Country updated')
      utils.admin.countries.list.invalidate()
      resetForm()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update country'),
  })

  const deleteMutation = trpc.admin.countries.delete.useMutation({
    onSuccess: () => {
      toast.success('Country deleted')
      utils.admin.countries.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to delete country'),
  })

  function resetForm() {
    setShowForm(false)
    setEditingCode(null)
    setForm({ code: '', name: '', flagUrl: '', continent: '' })
  }

  function startEdit(c: CountryItem) {
    setEditingCode(c.code)
    setForm({
      code: c.code || '',
      name: c.name || '',
      flagUrl: c.flagUrl || '',
      continent: c.continent || '',
    })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingCode) {
      updateMutation.mutate({
        code: editingCode,
        name: form.name,
        flagUrl: form.flagUrl || undefined,
        continent: form.continent || undefined,
      })
    } else {
      createMutation.mutate({
        code: form.code,
        name: form.name,
        flagUrl: form.flagUrl || undefined,
        continent: form.continent || undefined,
      })
    }
  }

  const countries: CountryItem[] = (countryList as CountryItem[]) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Countries"
        description="Manage study destination countries."
        buttonText="Add Country"
        onButtonClick={() => {
          resetForm()
          setShowForm(true)
        }}
      />

      {/* SEARCH + RESET */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <SAButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch('')
            utils.admin.countries.list.invalidate()
          }}
        >
          <RefreshCw size={12} /> Reset
        </SAButton>
      </div>

      {/* TABLE */}
      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[700px] grid-cols-[1fr_2fr_1.5fr_1fr] border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Code</div>
              <div>Name</div>
              <div>Continent</div>
              <div>Actions</div>
            </div>

            {isLoading ? (
              <div className="py-10">
                <div className="flex justify-center pb-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#c41e3a]" />
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-red-400">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Failed to load countries
                </p>
                <SAButton
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => utils.admin.countries.list.invalidate()}
                >
                  Retry
                </SAButton>
              </div>
            ) : countries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <Globe size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No countries found
                </p>
                <p className="text-sm">Add your first country to get started.</p>
              </div>
            ) : (
              countries.map((c) => (
                <div
                  key={c.code}
                  className="grid min-w-[700px] grid-cols-[1fr_2fr_1.5fr_1fr] items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: '#E8A33D', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {c.code}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ background: 'rgba(79,209,165,0.08)' }}
                      >
                        <Globe size={14} style={{ color: '#4FD1A5' }} />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {c.continent || '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(c.code)}
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
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingCode ? 'Edit Country' : 'Add Country'}
                </h2>
                <button
                  onClick={resetForm}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
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
                      label: 'ISO Code *',
                      key: 'code',
                      required: true,
                      maxLength: 2,
                      placeholder: 'e.g. KR',
                    },
                    { label: 'Name *', key: 'name', required: true },
                    { label: 'Flag URL', key: 'flagUrl', placeholder: 'https://...' },
                  ].map((f) => (
                    <label
                      key={f.key}
                      className={`flex flex-col gap-1.5 ${f.key === 'name' ? 'sm:col-span-2' : ''}`}
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.label}
                      </span>
                      <input
                        value={(form as unknown as Record<string, string>)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        required={f.required}
                        maxLength={f.maxLength}
                        placeholder={f.placeholder || f.label}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
                      />
                    </label>
                  ))}
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Continent
                    </span>
                    <select
                      value={form.continent}
                      onChange={(e) => setForm({ ...form, continent: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    >
                      <option value="">Select Continent...</option>
                      {CONTINENTS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={resetForm}
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
                        : editingCode
                          ? 'Update Country'
                          : 'Create Country'}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Country?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The country will be permanently removed.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate({ code: deleteConfirm })}
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
