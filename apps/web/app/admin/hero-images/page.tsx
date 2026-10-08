'use client'

import { ImageUploader } from '@/components/super-admin/shared/ImageUploader'
import AdminTable from '@/components/ui/AdminTable'
import PageHeader from '@/components/ui/PageHeader'
import { useSession } from '@/lib/auth-client'
import { hasPermission, parsePermissionsJSON } from '@/lib/rbac'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import { Eye, EyeOff, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'

interface HeroImageForm {
  imageUrl: string
  altText: string
  sortOrder: string
  isActive: boolean
}

const emptyForm: HeroImageForm = {
  imageUrl: '',
  altText: 'Homepage hero image',
  sortOrder: '0',
  isActive: true,
}

export default function HeroImagesPage() {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<HeroImageForm>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const role = (session?.user as { role?: UserRole } | undefined)?.role
  const permissions = parsePermissionsJSON(
    (session?.user as { permissions?: unknown } | undefined)?.permissions
  )
  const canManage = role === UserRole.SUPER_ADMIN || hasPermission(permissions, 'hero:manage', role)
  const utils = trpc.useUtils()
  const { data: heroImages, isLoading } = trpc.admin.heroImages.list.useQuery()

  const createMutation = trpc.admin.heroImages.create.useMutation({
    onSuccess: () => {
      toast.success('Hero image added')
      utils.admin.heroImages.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => toast.error(error.message || 'Failed to add hero image'),
  })

  const updateMutation = trpc.admin.heroImages.update.useMutation({
    onSuccess: () => {
      toast.success('Hero image updated')
      utils.admin.heroImages.list.invalidate()
      closeModal()
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => toast.error(error.message || 'Failed to update hero image'),
  })

  const deleteMutation = trpc.admin.heroImages.delete.useMutation({
    onSuccess: () => {
      toast.success('Hero image deleted')
      utils.admin.heroImages.list.invalidate()
      setDeleteConfirm(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => toast.error(error.message || 'Failed to delete hero image'),
  })

  function setField<K extends keyof HeroImageForm>(key: K, value: HeroImageForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(image: NonNullable<typeof heroImages>[number]) {
    setEditingId(image.id)
    setForm({
      imageUrl: image.imageUrl,
      altText: image.altText || 'Homepage hero image',
      sortOrder: String(image.sortOrder),
      isActive: image.isActive,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function onSave() {
    if (!form.imageUrl.trim()) {
      toast.error('Upload an image or provide an image URL')
      return
    }

    const sortOrder = Number.parseInt(form.sortOrder, 10)
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      toast.error('Display order must be a non-negative number')
      return
    }

    const payload = {
      imageUrl: form.imageUrl.trim(),
      altText: form.altText.trim() || 'Homepage hero image',
      sortOrder,
      isActive: form.isActive,
    }

    if (editingId) updateMutation.mutate({ id: editingId, ...payload })
    else createMutation.mutate(payload)
  }

  function toggleActive(image: NonNullable<typeof heroImages>[number]) {
    updateMutation.mutate({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      sortOrder: image.sortOrder,
      isActive: !image.isActive,
    })
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage Hero Images"
        description="Manage the photos shown in the homepage hero carousel. Active images are displayed in sort order."
        buttonText={canManage ? 'Add Image' : undefined}
        onButtonClick={canManage ? openCreate : undefined}
      />

      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
        Upload notice photos in the same portrait format for the most consistent carousel
        presentation. Disabled images remain saved but are hidden from the homepage.
      </div>

      <div className="shadow-xs overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b]">
        <AdminTable>
          <div className="overflow-x-auto">
            <div className="grid min-w-[760px] grid-cols-[96px_1fr_100px_110px_150px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 dark:border-white/[0.08] dark:bg-[#18181b]/80 dark:text-gray-300">
              <div>Preview</div>
              <div>Image</div>
              <div>Order</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
                  />
                ))}
              </div>
            ) : !heroImages?.length ? (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No hero images yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Add the first notice photo to start the homepage carousel.
                </p>
              </div>
            ) : (
              heroImages.map((image) => (
                <div
                  key={image.id}
                  className="grid min-w-[760px] grid-cols-[96px_1fr_100px_110px_150px] items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0 dark:border-white/[0.06]"
                >
                  <div className="h-20 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-white/[0.08] dark:bg-gray-900">
                    {/* Admins may use local uploads or external CDN URLs, so this preview cannot use a fixed Next image domain. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.imageUrl}
                      alt={image.altText}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {image.altText}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">{image.imageUrl}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {image.sortOrder}
                  </span>
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      image.isActive
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {image.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                    {image.isActive ? 'Enabled' : 'Disabled'}
                  </span>
                  {canManage ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleActive(image)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                      >
                        {image.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(image)}
                        aria-label={`Edit ${image.altText}`}
                        className="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(image.id)}
                        aria-label={`Delete ${image.altText}`}
                        className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">View only</span>
                  )}
                </div>
              ))
            )}
          </div>
        </AdminTable>
      </div>

      {showModal &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm sm:py-10">
            <div className="relative max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#18181b] sm:max-h-[calc(100vh-5rem)]">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/[0.08]">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Edit Hero Image' : 'Add Hero Image'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close dialog"
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.06] dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                <ImageUploader
                  key={editingId ?? 'new'}
                  value={form.imageUrl}
                  onChange={(value) => setField('imageUrl', value)}
                  label="Hero Image"
                  previewHeight={220}
                  recommendation="Recommended: portrait photo, JPG/PNG/WebP, up to 8 MB"
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alt text
                  </label>
                  <input
                    value={form.altText}
                    onChange={(event) => setField('altText', event.target.value)}
                    placeholder="Describe the image"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.sortOrder}
                      onChange={(event) => setField('sortOrder', event.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setField('isActive', !form.isActive)}
                    className={`mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
                      form.isActive
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300'
                        : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-white/[0.08] dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        form.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                    {form.isActive ? 'Enabled on homepage' : 'Disabled on homepage'}
                  </button>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.08]">
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
                    disabled={isSaving}
                    style={{ background: '#c41e3a', boxShadow: '0 4px 12px rgba(196,30,58,0.2)' }}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving…' : editingId ? 'Update Image' : 'Add Image'}
                  </button>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete Hero Image?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The image will be permanently removed from the
                carousel.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-300 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
                <button
                  type="button"
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
