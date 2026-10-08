'use client'

import { QuillEditor } from '@/components/super-admin/shared/QuillEditor'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { trpc } from '@/lib/trpc-client'
import {
  BookOpen,
  ExternalLink,
  EyeOff,
  FileText,
  Globe,
  Loader2,
  Pencil,
  Search,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

interface ResourceForm {
  type: 'BLOG' | 'FILE'
  title: string
  slug: string
  description: string
  content: string
  coverImage: string
  category: string
  section: string
  tags: string
  author: string
  fileUrl: string
  fileName: string
  mimeType: string
  fileSize: string
  isPublished: boolean
  deadline: string
  metaTitle: string
  metaDescription: string
  keywords: string
  canonicalUrl: string
  ogImageUrl: string
  noIndex: boolean
  featured: boolean
}

interface ResourceItem {
  id: string
  type: 'BLOG' | 'FILE'
  title: string
  slug: string
  description?: string | null
  content?: string | null
  coverImage?: string | null
  category?: string | null
  section?: string | null
  tags?: unknown
  author?: string | null
  fileUrl?: string | null
  fileName?: string | null
  mimeType?: string | null
  fileSize?: number | null
  isPublished: boolean
  deadline?: string | Date | null
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: unknown
  canonicalUrl?: string | null
  ogImageUrl?: string | null
  noIndex?: boolean
  featured?: boolean
  updatedAt?: string | Date | null
}

const SECTIONS = [
  { value: '', label: 'General (no section)' },
  { value: 'trending', label: 'Trending Now' },
  { value: 'scholarship', label: 'Latest Scholarships' },
  { value: 'visa', label: 'Visa Updates' },
  { value: 'featured_university', label: 'Featured University' },
]

function sectionLabel(key: string | null | undefined): string {
  return SECTIONS.find((s) => s.value === key)?.label || ''
}

const emptyForm: ResourceForm = {
  type: 'BLOG',
  title: '',
  slug: '',
  description: '',
  content: '',
  coverImage: '',
  category: '',
  section: '',
  tags: '',
  author: '',
  fileUrl: '',
  fileName: '',
  mimeType: '',
  fileSize: '',
  isPublished: true,
  deadline: '',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  ogImageUrl: '',
  noIndex: false,
  featured: false,
}

function splitComma(s: string): string[] {
  return s
    ? s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    : []
}

function toCommaList(value: unknown): string {
  if (Array.isArray(value))
    return value.filter((v): v is string => typeof v === 'string').join(', ')
  if (typeof value === 'string') {
    const s = value.trim()
    if (!s) return ''
    try {
      const p = JSON.parse(s)
      if (Array.isArray(p)) return p.filter((v): v is string => typeof v === 'string').join(', ')
      if (typeof p === 'string') return p
    } catch {
      return value
    }
  }
  return ''
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BLOG' | 'FILE'>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ResourceForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const utils = trpc.useUtils()
  const { data: resources, isLoading } = trpc.resource.admin.list.useQuery({
    search: search || undefined,
    type: typeFilter === 'ALL' ? undefined : typeFilter,
  })

  const createMutation = trpc.resource.admin.create.useMutation({
    onSuccess: () => {
      toast.success('Resource created')
      utils.resource.admin.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to create resource'),
  })
  const updateMutation = trpc.resource.admin.update.useMutation({
    onSuccess: () => {
      toast.success('Resource updated')
      utils.resource.admin.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to update resource'),
  })
  const deleteMutation = trpc.resource.admin.delete.useMutation({
    onSuccess: () => {
      toast.success('Resource deleted')
      utils.resource.admin.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => toast.error(e?.message || 'Failed to delete resource'),
  })

  function setF(key: string, value: unknown) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(r: ResourceItem) {
    setEditingId(r.id)
    setForm({
      type: r.type || 'BLOG',
      title: r.title || '',
      slug: r.slug || '',
      description: r.description || '',
      content: r.content || '',
      coverImage: r.coverImage || '',
      category: r.category || '',
      section: r.section || '',
      tags: toCommaList(r.tags),
      author: r.author || '',
      fileUrl: r.fileUrl || '',
      fileName: r.fileName || '',
      mimeType: r.mimeType || '',
      fileSize: r.fileSize?.toString() || '',
      isPublished: r.isPublished ?? true,
      deadline: r.deadline ? new Date(r.deadline).toISOString().slice(0, 10) : '',
      metaTitle: r.metaTitle || '',
      metaDescription: r.metaDescription || '',
      keywords: toCommaList(r.keywords),
      canonicalUrl: r.canonicalUrl || '',
      ogImageUrl: r.ogImageUrl || '',
      noIndex: r.noIndex ?? false,
      featured: r.featured ?? false,
    })
    setShowModal(true)
  }

  function onTitleChange(v: string) {
    setF('title', v)
    if (!editingId) setF('slug', slugify(v))
  }

  async function uploadFile(file: File, target: 'cover' | 'file') {
    if (target === 'cover') setUploadingCover(true)
    else setUploadingFile(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-file', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error || 'Upload failed')
      if (target === 'cover') {
        setF('coverImage', json.url)
        if (!form.ogImageUrl) setF('ogImageUrl', json.url)
      } else {
        setF('fileUrl', json.url)
        setF('fileName', json.name || file.name)
        setF('mimeType', json.type || file.type || '')
        setF('fileSize', String(json.size ?? file.size ?? ''))
        if (!form.title) setF('title', file.name)
      }
      toast.success('File uploaded')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      if (target === 'cover') setUploadingCover(false)
      else setUploadingFile(false)
    }
  }

  function isValidUrlOrPath(val: string) {
    if (!val) return true
    if (val.startsWith('/')) return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }

  function onSave() {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required')
      return
    }

    if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens')
      return
    }

    if (form.coverImage && !isValidUrlOrPath(form.coverImage.trim())) {
      toast.error('Feature Image must be a valid URL or relative path (e.g., /uploads/...)')
      return
    }
    if (form.fileUrl && !isValidUrlOrPath(form.fileUrl.trim())) {
      toast.error('File URL must be a valid URL or relative path')
      return
    }

    if (form.isPublished) {
      if (!form.coverImage?.trim()) {
        toast.error('Feature Image is required to publish this resource')
        return
      }
      if (form.type === 'BLOG' && !form.content?.trim()) {
        toast.error('Content is required to publish a blog')
        return
      }
      if (form.type === 'FILE' && !form.fileUrl?.trim()) {
        toast.error('File URL is required to publish a file')
        return
      }
    }

    const payload = {
      type: form.type,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description?.trim() || null,
      content: form.content?.trim() || null,
      coverImage: form.coverImage?.trim() || null,
      category: form.category?.trim() || null,
      section: form.section?.trim() || null,
      tags: splitComma(form.tags),
      author: form.author?.trim() || null,
      fileUrl: form.fileUrl?.trim() || null,
      fileName: form.fileName?.trim() || null,
      mimeType: form.mimeType?.trim() || null,
      fileSize: form.fileSize ? parseInt(form.fileSize, 10) : null,
      isPublished: form.isPublished,
      deadline: form.deadline ? new Date(form.deadline) : null,
      publishedAt: form.isPublished ? new Date() : null,
      metaTitle: form.metaTitle?.trim() || null,
      metaDescription: form.metaDescription?.trim() || null,
      keywords: splitComma(form.keywords),
      canonicalUrl: form.canonicalUrl?.trim() || null,
      ogImageUrl: form.ogImageUrl?.trim() || null,
      noIndex: form.noIndex,
      featured: form.featured,
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300'
  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white'

  const resourceList: ResourceItem[] = (resources as ResourceItem[]) || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Management"
        description="Manage blogs and downloadable files with SEO metadata."
        buttonText="Add Resource"
        onButtonClick={openCreate}
      />

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or file name…"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-5 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#18181b] dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'BLOG' | 'FILE')}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 outline-none dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-200 lg:w-44"
        >
          <option value="ALL">All Types</option>
          <option value="BLOG">Blogs</option>
          <option value="FILE">Files</option>
        </select>
      </div>

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[800px] grid-cols-6 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Resource</div>
              <div>Type</div>
              <div>Category</div>
              <div>Status</div>
              <div>Updated</div>
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
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : resourceList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <FileText size={48} className="mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No resources found
                </p>
                <p className="text-sm text-gray-500">
                  Add your first blog post or file to get started.
                </p>
              </div>
            ) : (
              resourceList.map((r) => (
                <div
                  key={r.id}
                  className="grid min-w-[800px] grid-cols-6 items-center border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.02]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        r.type === 'BLOG'
                          ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      {r.type === 'BLOG' ? <BookOpen size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold text-gray-900 dark:text-white">
                          {r.title}
                        </span>
                        {r.featured && <Star size={13} className="shrink-0 text-amber-500" />}
                      </div>
                      <div className="truncate text-xs text-gray-400">/{r.slug}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        r.type === 'BLOG'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      {r.type === 'BLOG' ? 'Blog' : 'File'}
                    </span>
                  </div>
                  <div className="truncate text-sm text-gray-600 dark:text-gray-300">
                    {r.category || '—'}
                    {r.section && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {sectionLabel(r.section)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {r.isPublished ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <EyeOff size={11} />
                        Draft
                      </span>
                    )}
                    {r.noIndex && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        title="No-index"
                      >
                        noindex
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {r.updatedAt
                      ? new Date(r.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                    >
                      <Pencil size={14} />
                    </button>
                    {r.fileUrl && (
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        rel="noopener"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-400 dark:hover:bg-white/[0.06]"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(r.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
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
      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Resource' : 'Add Resource'}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
                  {/* Type */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Type</label>
                    <div className="flex gap-2">
                      {(['BLOG', 'FILE'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setF('type', t)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                            form.type === t
                              ? 'border-[#c41e3a] bg-[#c41e3a]/10 text-[#c41e3a]'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                          }`}
                        >
                          {t === 'BLOG' ? <BookOpen size={15} /> : <FileText size={15} />}
                          {t === 'BLOG' ? 'Blog Post' : 'File / Document'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => onTitleChange(e.target.value)}
                      placeholder="e.g. Complete Guide to Studying in South Korea"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>URL Slug *</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setF('slug', slugify(e.target.value))}
                      placeholder="auto-generated"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <input
                      value={form.category}
                      onChange={(e) => setF('category', e.target.value)}
                      placeholder="e.g. Study Abroad"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Author</label>
                    <input
                      value={form.author}
                      onChange={(e) => setF('author', e.target.value)}
                      placeholder="e.g. Endow Team"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Tags (comma-separated)</label>
                    <input
                      value={form.tags}
                      onChange={(e) => setF('tags', e.target.value)}
                      placeholder="korea, scholarship, guide"
                      className={inputCls}
                    />
                  </div>

                  {/* Blog fields */}
                  {form.type === 'BLOG' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Description / Excerpt</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setF('description', e.target.value)}
                          rows={2}
                          placeholder="Short summary shown in listings and search results."
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Section</label>
                        <select
                          value={form.section}
                          onChange={(e) => setF('section', e.target.value)}
                          className={inputCls}
                        >
                          {SECTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Deadline (for scholarships)</label>
                        <input
                          type="date"
                          value={form.deadline}
                          onChange={(e) => setF('deadline', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <button
                          type="button"
                          onClick={() => setF('featured', !form.featured)}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                            form.featured
                              ? 'border-[#c41e3a]/40 bg-[#c41e3a]/10 text-[#c41e3a]'
                              : 'border-gray-200 bg-white text-gray-500 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                          }`}
                        >
                          <Star size={14} /> Feature on blog hero
                        </button>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Content</label>
                        <QuillEditor
                          value={form.content}
                          onChange={(v: string) => setF('content', v)}
                          placeholder="Write the article content…"
                          minHeight={240}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Cover Image</label>
                        <div className="flex items-center gap-2">
                          <input
                            value={form.coverImage}
                            onChange={(e) => setF('coverImage', e.target.value)}
                            placeholder="https://… or upload"
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploadingCover}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                          >
                            {uploadingCover ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Upload size={15} />
                            )}{' '}
                            Upload
                          </button>
                          <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) uploadFile(f, 'cover')
                              e.target.value = ''
                            }}
                          />
                        </div>
                        {form.coverImage && (
                          <img
                            src={form.coverImage}
                            alt="cover preview"
                            className="mt-2 h-32 w-56 rounded-lg border border-gray-200 object-cover dark:border-white/[0.08]"
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* File fields */}
                  {form.type === 'FILE' && (
                    <>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>File *</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingFile}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                          >
                            {uploadingFile ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Upload size={15} />
                            )}{' '}
                            {uploadingFile ? 'Uploading…' : 'Choose file'}
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0]
                              if (f) uploadFile(f, 'file')
                              e.target.value = ''
                            }}
                          />
                          {form.fileName && (
                            <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                              {form.fileName}{' '}
                              {form.fileSize
                                ? `(${(Number(form.fileSize) / 1024).toFixed(1)} KB)`
                                : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>File URL (or paste directly)</label>
                        <input
                          value={form.fileUrl}
                          onChange={(e) => setF('fileUrl', e.target.value)}
                          placeholder="/uploads/… or https://…"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>File Name</label>
                        <input
                          value={form.fileName}
                          onChange={(e) => setF('fileName', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>MIME Type</label>
                        <input
                          value={form.mimeType}
                          onChange={(e) => setF('mimeType', e.target.value)}
                          placeholder="application/pdf"
                          className={inputCls}
                        />
                      </div>
                    </>
                  )}

                  {/* Publishing */}
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-white/[0.08] sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setF('isPublished', !form.isPublished)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.isPublished
                          ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300'
                          : 'border-gray-200 bg-white text-gray-500 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          form.isPublished ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      {form.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  {/* SEO */}
                  <div className="mb-1 flex items-center gap-2 pt-2 sm:col-span-2">
                    <Globe size={15} className="text-[#c41e3a]" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      SEO Options
                    </h3>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Meta Title</label>
                    <input
                      value={form.metaTitle}
                      onChange={(e) => setF('metaTitle', e.target.value)}
                      placeholder="Overrides the page title (defaults to resource title)."
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Meta Description</label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setF('metaDescription', e.target.value)}
                      rows={2}
                      placeholder="For search engine snippet (defaults to description)."
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Keywords (comma-separated)</label>
                    <input
                      value={form.keywords}
                      onChange={(e) => setF('keywords', e.target.value)}
                      placeholder="korea, study abroad, scholarship"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Canonical URL</label>
                    <input
                      value={form.canonicalUrl}
                      onChange={(e) => setF('canonicalUrl', e.target.value)}
                      placeholder="https://…"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>OG Image URL</label>
                    <input
                      value={form.ogImageUrl}
                      onChange={(e) => setF('ogImageUrl', e.target.value)}
                      placeholder="https://… (social share image)"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setF('noIndex', !form.noIndex)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        form.noIndex
                          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'border-gray-200 bg-white text-gray-500 dark:border-white/[0.08] dark:bg-[#09090b] dark:text-gray-400'
                      }`}
                    >
                      <Tag size={14} /> No-index (hide from search engines)
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
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
                        ? 'Saving…'
                        : editingId
                          ? 'Update Resource'
                          : 'Create Resource'}
                    </button>
                  </div>
                </div>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Resource?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The resource will be permanently removed.
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
