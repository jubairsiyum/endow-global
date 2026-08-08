'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import AdminTable from '@/components/ui/AdminTable'
import { Plus, Pencil, Trash2, X, Search, Layers } from 'lucide-react'

interface DepartmentForm {
  universityId: string
  name: string
  code: string
  description: string
}

const emptyForm: DepartmentForm = {
  universityId: '', name: '', code: '', description: '',
}

export default function DepartmentsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<DepartmentForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [universityFilter, setUniversityFilter] = useState<string>('')

  const utils = trpc.useUtils()

  const { data: departments, isLoading } = trpc.admin.departments.list.useQuery({
    universityId: universityFilter ? Number(universityFilter) : undefined,
  })

  const { data: universities } = trpc.admin.departments.getCatalogUniversities.useQuery()

  const createMutation = trpc.admin.departments.create.useMutation({
    onSuccess: () => {
      utils.admin.departments.list.invalidate()
      setShowModal(false)
      setForm(emptyForm)
    },
  })

  const updateMutation = trpc.admin.departments.update.useMutation({
    onSuccess: () => {
      utils.admin.departments.list.invalidate()
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = trpc.admin.departments.delete.useMutation({
    onSuccess: () => {
      utils.admin.departments.list.invalidate()
      setDeleteConfirm(null)
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
      universityId: d.universityId?.toString() || '',
      name: d.name || '',
      code: d.code || '',
      description: d.description || '',
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      universityId: Number(form.universityId),
      name: form.name,
      code: form.code || undefined,
      description: form.description || undefined,
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
        title="Departments"
        description="Manage university departments."
        buttonText="Add Department"
        onButtonClick={openCreate}
      />

      <div className="flex flex-col gap-3 lg:flex-row">
        <select
          value={universityFilter}
          onChange={e => setUniversityFilter(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none dark:border-gray-800 dark:bg-[#1a1d25] dark:text-white lg:w-64"
        >
          <option value="">All Universities</option>
          {(universities || []).map((u: any) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <AdminTable>
        <div className="overflow-x-auto">
          <div className="grid min-w-[700px] grid-cols-5 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-[#222530] dark:text-gray-300">
            <div>Department</div>
            <div>Code</div>
            <div>University</div>
            <div>Description</div>
            <div>Actions</div>
          </div>

          {isLoading ? (
            <div className="py-10">
              <div className="flex justify-center pb-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            </div>
          ) : (departments || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Layers size={48} className="mb-3" />
              <p className="text-lg font-semibold text-gray-500">No departments found</p>
              <p className="text-sm">Add your first department to get started.</p>
            </div>
          ) : (
            (departments || []).map((d: any) => (
              <div
                key={d.id}
                className="grid min-w-[700px] grid-cols-5 items-center border-b border-gray-100 px-6 py-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-[#1a1d25]"
              >
                <div className="font-medium text-gray-900 dark:text-white">{d.name}</div>
                <div className="text-sm font-mono text-gray-500">{d.code || '—'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{d.university?.name || '—'}</div>
                <div className="truncate text-sm text-gray-500 max-w-[200px]">{d.description || '—'}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(d)} className="rounded-xl bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-[#222530] dark:text-white dark:hover:bg-[#2d3340]">
                    <Pencil size={14} />
                  </button>
                  {deleteConfirm === d.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => deleteMutation.mutate({ id: d.id })} className="rounded-lg bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(d.id)} className="rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-[#222530]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">University *</label>
                <select required value={form.universityId} onChange={e => setForm({ ...form, universityId: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white">
                  <option value="">Select University</option>
                  {(universities || []).map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Department Name *</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-[#222530]">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#920715] disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
