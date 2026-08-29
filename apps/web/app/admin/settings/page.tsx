'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Save, User, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const utils = trpc.useUtils()
  const { data: _metrics } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = _metrics as any
  const { data: profile } = trpc.admin.settings.getProfile.useQuery()
  const updateProfile = trpc.admin.settings.updateProfile.useMutation({
    onSuccess: () => {
      utils.admin.settings.getProfile.invalidate()
      toast.success('Profile updated')
    },
    onError: (err) => {
      toast.error(err.message || 'Could not update profile')
    },
  })

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setEmail(profile.email || '')
    }
  }, [profile])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    updateProfile.mutate({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage platform preferences and system settings." />

      {/* THEME */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Theme Preferences</h2>
            <p className="mt-1 text-sm text-gray-500">Switch between dark and light mode.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* PROFILE */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Admin Profile</h2>
            <p className="text-sm text-gray-500">Update your account information</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Super Admin"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@endowglobal.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="mt-2 flex w-fit items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#920715] disabled:opacity-50"
          >
            <Save size={16} />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* SYSTEM INFO */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
            <p className="text-sm text-gray-500">Platform statistics at a glance</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Total Students</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{metrics?.students || 0}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Total Counselors</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{metrics?.counselors || 0}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Total Applications</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {metrics?.applicationsByStatus?.reduce((sum: number, curr: any) => sum + curr.count, 0) || 0}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Active Pipeline</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {(metrics?.applicationsByStatus?.find((s: any) => s.status === 'IN_PROGRESS')?.count || 0) +
                (metrics?.applicationsByStatus?.find((s: any) => s.status === 'SUBMITTED')?.count || 0) +
                (metrics?.applicationsByStatus?.find((s: any) => s.status === 'UNDER_REVIEW')?.count || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
