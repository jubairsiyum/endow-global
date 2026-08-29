'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Camera, Check, Eye, EyeOff, KeyRound, Mail, Shield, User, X } from 'lucide-react'

import { authClient, useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { UserRole } from '@endow/types'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { AdminClientLayout } from '@/components/admin/layout/AdminClientLayout'
import { CounselorShell } from '@/components/counselor/layout/Shell'

const ROLE_META: Record<string, { label: string; cls: string }> = {
  STUDENT: { label: 'Student', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  COUNSELOR: { label: 'Counselor', cls: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300' },
  ADMIN: { label: 'Admin', cls: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
  SUPER_ADMIN: { label: 'Super Admin', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
}

export default function ProfilePage() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const { data: session, isPending: sessionLoading, refetch: refetchSession } = useSession()

  const [name, setName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [savingName, setSavingName] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (session) {
      setName((session.user as any)?.name || '')
      const img = (session.user as any)?.image ?? null
      setImage(img)
      setPreview(img)
    }
  }, [session])

  useEffect(() => {
    if (!sessionLoading && !session) {
      const cb = typeof window !== 'undefined' ? window.location.pathname : '/profile'
      router.replace(`/login?callbackUrl=${encodeURIComponent(cb)}`)
    }
  }, [session, sessionLoading, router])

  // Refresh everything that reads the signed-in user's name/avatar so the
  // change propagates to the navbar, dashboard shells, sidelines and settings.
  function propagate() {
    utils.user.getProfile.invalidate()
    utils.dashboard.overview.invalidate()
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image must be smaller than 4 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      // Auth update persists to `users.image` AND re-issues the session cookie,
      // so the fresh image reaches every consumer (navbar, shells, sidebar).
      const { error } = await authClient.updateUser({ image: data.url })
      if (error) throw new Error(error.message || 'Failed to save photo')
      setImage(data.url)
      setPreview(data.url)
      await refetchSession()
      propagate()
      toast.success('Photo updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
      setPreview(image)
    } finally {
      setUploading(false)
    }
  }

  async function removeImage() {
    try {
      const { error } = await authClient.updateUser({ image: null })
      if (error) throw new Error(error.message || 'Failed to remove photo')
      setImage(null)
      setPreview(null)
      await refetchSession()
      propagate()
      toast.success('Photo removed')
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove photo')
    }
  }

  async function saveName() {
    if (savingName) return
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    setSavingName(true)
    try {
      // updateUser re-issues the session cookie so the name updates everywhere.
      const { error } = await authClient.updateUser({ name: trimmed })
      if (error) throw new Error(error.message || 'Failed to update name')
      await refetchSession()
      propagate()
      toast.success('Name updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update name')
    } finally {
      setSavingName(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (changingPassword) return
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setChangingPassword(true)
    try {
      const { error } = await authClient.changePassword({ currentPassword, newPassword })
      if (error) throw new Error(error.message || 'Failed to change password')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (err: any) {
      toast.error(err.message || 'Could not update password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f2ec]">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-[#C41E3A] border-t-transparent" />
      </div>
    )
  }

  if (!session) return null

  const user = session.user as any
  const role = user?.role as string
  const roleMeta = ROLE_META[role as string] ?? ROLE_META.STUDENT

  const inputShell =
    'flex min-h-[44px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'

  const content = (
    <div className="mx-auto w-full max-w-lg space-y-4 pb-6">
      {/* Profile */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">My Profile</p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${roleMeta.cls}`}>{roleMeta.label}</span>
        </div>
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-slate-950 to-red-700" />
        </div>

        <div className="mt-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-xl font-bold text-slate-500">
              {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : (user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <label className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-md transition-colors hover:bg-red-700">
              <Camera size={14} />
              <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} disabled={uploading} aria-label="Upload profile photo" />
            </label>
            {preview && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-600 text-white shadow-md transition-colors hover:bg-gray-700"
                aria-label="Remove profile photo"
              >
                <X size={12} />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-slate-950">{user?.name || 'Your name'}</p>
            <p className="truncate text-sm text-slate-500">{user?.email}</p>
            {user?.createdAt && (
              <p className="mt-0.5 text-xs text-slate-400">
                Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Full name</label>
          <div className="flex items-center gap-2">
            <div className={`${inputShell} flex-1`}>
              <User size={16} className="shrink-0 text-slate-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Your full name" className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
            </div>
            <button
              type="button"
              onClick={saveName}
              disabled={savingName}
              className="flex h-[44px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 px-4 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {savingName ? '...' : (<><Check size={14} /> Save</>)}
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Email address</label>
          <div className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
            <Mail size={16} className="shrink-0 text-slate-400" />
            <span className="flex-1 truncate text-sm text-slate-600">{user?.email}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><Check size={12} /> Verified</span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">Security</p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">Change password</h2>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Current password</label>
            <div className={inputShell}>
              <KeyRound size={16} className="shrink-0 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" autoComplete="current-password" className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">New password</label>
            <div className={inputShell}>
              <KeyRound size={16} className="shrink-0 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Confirm password</label>
            <div className={inputShell}>
              <Shield size={16} className="shrink-0 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={changingPassword || !currentPassword || newPassword.length < 8 || newPassword !== confirmPassword}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
          >
            {changingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return <AdminClientLayout userRole={role as UserRole}>{content}</AdminClientLayout>
  }
  if (role === UserRole.COUNSELOR) {
    return <CounselorShell>{content}</CounselorShell>
  }
  return <DashboardShell>{content}</DashboardShell>
}
