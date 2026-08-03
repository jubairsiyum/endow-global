'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { SAButton as Button } from '@/components/super-admin/shared/SAButton'
import { Save, User, Mail, Phone, MapPin, Globe, GraduationCap } from 'lucide-react'

const COUNTRIES = [
  'Bangladesh', 'India', 'Pakistan', 'Nepal', 'Sri Lanka', 'Nigeria', 'Kenya', 'Ghana',
  'South Korea', 'Japan', 'China', 'Malaysia', 'Indonesia', 'Australia', 'United Kingdom',
  'United States', 'Canada', 'Germany', 'France', 'UAE', 'Saudi Arabia',
]

const EDUCATION_LEVELS = ['HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD'] as const

export default function SettingsPage() {
  const { data: session } = useSession()
  const { data: profile, isLoading } = trpc.user.getProfile.useQuery()
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => { toast.success('Profile updated'); utils.user.getProfile.invalidate() },
    onError: (e) => toast.error(e.message),
  })
  const utils = trpc.useUtils()

  const [name, setName] = useState('')
  const [nationality, setNationality] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [education, setEducation] = useState<string>('')
  const [targetCountries, setTargetCountries] = useState<string[]>([])
  const [intakeYear, setIntakeYear] = useState<number>(new Date().getFullYear() + 1)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setNationality((profile.studentProfile as any)?.nationality || '')
      setCountry((profile.studentProfile as any)?.countryOfResidence || '')
      setPhone((profile.studentProfile as any)?.phone || '')
      setEducation((profile.studentProfile as any)?.highestEducation || '')
      setTargetCountries((profile.studentProfile as any)?.targetCountries || [])
      setIntakeYear((profile.studentProfile as any)?.preferredIntakeYear || new Date().getFullYear() + 1)
    }
  }, [profile])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateProfile.mutate({
      name,
      nationality,
      countryOfResidence: country,
      phone,
      highestEducation: education as any,
      targetCountries,
      preferredIntakeYear: intakeYear,
    })
  }

  function toggleCountry(c: string) {
    setTargetCountries(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c].slice(0, 5)
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your personal information and preferences</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#11131a]"
      >
        {/* Personal Info */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User size={15} className="text-primary" /> Personal Information
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Full Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white"
                placeholder="Your name" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</span>
              <input value={session?.user?.email || ''} disabled
                className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-[#1a1d25]/50 dark:text-gray-400"
                placeholder="your@email.com" />
            </label>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Phone size={15} className="text-primary" /> Contact & Location
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white"
                placeholder="+880..." />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Nationality</span>
              <select value={nationality} onChange={(e) => setNationality(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white">
                <option value="">Select...</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Country of Residence</span>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white">
                <option value="">Select...</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Study Preferences */}
        <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap size={15} className="text-primary" /> Study Preferences
          </h2>
          <div className="mt-3 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Highest Education</span>
              <select value={education} onChange={(e) => setEducation(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white">
                <option value="">Select...</option>
                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l.replace(/_/g, ' ')}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Preferred Intake Year</span>
              <input type="number" value={intakeYear} onChange={(e) => setIntakeYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#1a1d25] dark:text-white" />
            </label>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Target Countries (max 5)</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {COUNTRIES.slice(0, 20).map(c => (
                  <button key={c} type="button" onClick={() => toggleCountry(c)}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                      targetCountries.includes(c)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-400'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800">
          <Button type="submit" disabled={updateProfile.isPending} size="md" className="!rounded-lg">
            <Save size={14} />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.form>
    </div>
  )
}
