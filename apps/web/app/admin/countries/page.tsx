'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, Globe } from 'lucide-react'

interface CountryForm {
  code: string
  name: string
  flagUrl: string
  continent: string
}

const emptyForm: CountryForm = {
  code: '', name: '', flagUrl: '', continent: '',
}

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica']

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function CountriesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [form, setForm] = useState<CountryForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const { data: countries, isLoading } = trpc.admin.countries.list.useQuery({
    search: debouncedSearch || undefined,
  })

  const createMutation = trpc.admin.countries.create.useMutation({
    onSuccess: () => {
      utils.admin.countries.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.countries.update.useMutation({
    onSuccess: () => {
      utils.admin.countries.list.invalidate()
      setShowModal(false)
      setEditingCode(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.countries.delete.useMutation({
    onSuccess: () => {
      utils.admin.countries.list.invalidate()
      setDeleteConfirm(null)
    },
  })

  function openCreate() {
    setEditingCode(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(c: any) {
    setEditingCode(c.code)
    setForm({
      code: c.code || '',
      name: c.name || '',
      flagUrl: c.flagUrl || '',
      continent: c.continent || '',
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      name: form.name,
      flagUrl: form.flagUrl || undefined,
      continent: form.continent || undefined,
    }
    if (editingCode) {
      updateMutation.mutate({ code: editingCode, ...data })
    } else {
      createMutation.mutate({ code: form.code.toUpperCase(), ...data })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Countries"
        description="Manage country reference data used across the platform."
        buttonText="Add Country"
        onButtonClick={openCreate}
      />

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white"
        />
      </div>

      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[600px] grid-cols-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>Country</div>
            <div>Code</div>
            <div>Continent</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            </div>
          ) : (countries || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Globe size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No countries found</p>
              <p className="text-sm">Add your first country to get started.</p>
            </div>
          ) : (
            (countries || []).map((c: any) => (
              <div
                key={c.code}
                className="grid min-w-[600px] grid-cols-4 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div className="flex items-center gap-3">
                  {c.flagUrl && <img src={c.flagUrl} alt={c.name} className="h-5 w-8 rounded object-cover" />}
                  <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                </div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{c.code}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{c.continent || '—'}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(c)} className="rounded-xl bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === c.code ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteMutation.mutate({ code: c.code })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(c.code)} className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </AdminTable>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#1a1d25]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingCode ? 'Edit Country' : 'Add Country'}</h2>
              <button onClick={() => { setShowModal(false); setEditingCode(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#222530]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Country Code (2 letters) *</label>
                <input required maxLength={2} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!editingCode} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm uppercase outline-none focus:border-primary disabled:opacity-50 dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="US" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Country Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="United States" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Continent</label>
                <select value={form.continent} onChange={e => setForm({ ...form, continent: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white">
                  <option value="">Select Continent</option>
                  {continents.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Flag URL</label>
                <input value={form.flagUrl} onChange={e => setForm({ ...form, flagUrl: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" placeholder="https://flagcdn.com/w320/us.png" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingCode(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingCode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
