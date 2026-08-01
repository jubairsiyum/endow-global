'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'
import PageHeader from '@/components/ui/PageHeader'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Save, User, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  const { data: metrics } = trpc.admin.dashboard.getMetrics.useQuery()

  function handleSave() {
    // In a real app, this would call a tRPC mutation to update admin profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage platform preferences and system settings." />

      {/* THEME */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
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
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Profile</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account information</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Super Admin"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@endowglobal.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-primary dark:border-gray-800 dark:bg-[#11131a] dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#920715]"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* SYSTEM INFO */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1a1d25]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Platform statistics at a glance</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#222530]">
            <p className="text-xs font-medium text-gray-500">Total Students</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{metrics?.students || 0}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#222530]">
            <p className="text-xs font-medium text-gray-500">Total Counselors</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{metrics?.counselors || 0}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#222530]">
            <p className="text-xs font-medium text-gray-500">Total Applications</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.applicationsByStatus?.reduce((sum: number, curr: any) => sum + curr.count, 0) || 0}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#222530]">
            <p className="text-xs font-medium text-gray-500">Active Pipeline</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
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
