'use client'

import PageHeader from '@/components/ui/PageHeader'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { trpc } from '@/lib/trpc-client'
import { Save, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ApplicationStatusCount {
  status?: string
  count: number
}

interface DashboardMetrics {
  students?: number
  counselors?: number
  applicationsByStatus?: ApplicationStatusCount[]
}

interface AdminProfile {
  name?: string | null
  email?: string | null
}

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const utils = trpc.useUtils()
  const { data: metricsData } = trpc.admin.dashboard.getMetrics.useQuery()
  const metrics = (metricsData as DashboardMetrics) || {}

  const { data: profileData } = trpc.admin.settings.getProfile.useQuery()
  const profile = profileData as AdminProfile | undefined

  const updateProfile = trpc.admin.settings.updateProfile.useMutation({
    onSuccess: () => {
      utils.admin.settings.getProfile.invalidate()
      toast.success('Profile updated')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
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

  const applicationsList = metrics.applicationsByStatus || []

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage platform preferences and system settings." />

      {/* THEME */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Theme Preferences
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Switch between dark and light mode.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* PROFILE */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c41e3a]/10 text-[#c41e3a]">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Profile</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your account information
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Super Admin"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@endowglobal.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all focus:border-[#c41e3a] dark:border-white/[0.08] dark:bg-[#09090b] dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            style={{ background: '#c41e3a' }}
            className="mt-2 flex w-fit items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <Save size={16} />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* SYSTEM INFO */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Platform statistics at a glance
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.06] dark:bg-[#09090b]/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Students</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.students || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.06] dark:bg-[#09090b]/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Counselors</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.counselors || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.06] dark:bg-[#09090b]/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Applications
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {applicationsList.reduce((sum, curr) => sum + (curr.count || 0), 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/[0.06] dark:bg-[#09090b]/50">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Pipeline</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {(applicationsList.find((s) => s.status === 'IN_PROGRESS')?.count || 0) +
                (applicationsList.find((s) => s.status === 'SUBMITTED')?.count || 0) +
                (applicationsList.find((s) => s.status === 'UNDER_REVIEW')?.count || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
