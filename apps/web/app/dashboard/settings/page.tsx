'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Gift,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { authClient, useSession } from '@/lib/auth-client'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, btnSecondary, input } from '@/components/dashboard/ui'
import { cn, asStringArray } from '@/lib/utils'
import { SUBJECT_OPTIONS } from '@/server/utils/courseMatch'
import { COUNTRIES, EDUCATION_DESTINATIONS, type CountryOption } from '@/lib/countries'
import { PHONE_PREFIXES } from '@/lib/phone-codes'
import { SITE_CONFIG } from '@/lib/config/site'

type Tab = 'personal' | 'study' | 'security'
type SaveState = 'idle' | 'saving' | 'success'

interface Option {
  value: string
  label: string
  search?: string
  flag?: string
}

function Flag({ url }: { url?: string }) {
  if (!url) return null
  return <img src={url} alt="" loading="lazy" className="h-4 w-6 shrink-0 rounded-[3px] object-cover ring-1 ring-black/5" />
}

const EDUCATION_OPTIONS: Option[] = [
  { value: 'HIGH_SCHOOL', label: 'High School', search: 'secondary education' },
  { value: 'BACHELORS', label: "Bachelor's degree", search: 'undergraduate' },
  { value: 'MASTERS', label: "Master's degree", search: 'postgraduate' },
  { value: 'PHD', label: 'PhD', search: 'doctoral research' },
]

const INTAKE_YEARS = ['2025', '2026', '2027', '2028']

const BUDGET_OPTIONS: { label: string; value: number | '' }[] = [
  { label: 'No limit', value: '' },
  { label: 'Under $10,000 / year', value: 10000 },
  { label: 'Under $20,000 / year', value: 20000 },
  { label: 'Under $30,000 / year', value: 30000 },
  { label: 'Under $50,000 / year', value: 50000 },
  { label: 'Under $75,000 / year', value: 75000 },
]

const TABS: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: 'personal', label: 'Personal info', icon: UserRound },
  { id: 'study', label: 'Study preferences', icon: GraduationCap },
  { id: 'security', label: 'Security & privacy', icon: ShieldCheck },
]

const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF][A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s'’.-]{1,99}$/

function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, '').replace(/^(?:\+|00)(\d)/, '$1')
}

function isValidPhone(value: string): boolean {
  if (!value) return true
  return /^(?!0+$)\d{7,15}$/.test(normalizePhone(value))
}

type Errors = Partial<Record<'name' | 'phone' | 'nationality' | 'country' | 'gpa' | 'ieltsScore' | 'toeflScore', string>>

function validateProfileFields(fields: {
  name?: string
  phonePrefix?: string
  phone?: string
  nationality?: string
  gpa?: string
  ieltsScore?: string
  toeflScore?: string
}): Errors {
  const errors: Errors = {}

  if (fields.name !== undefined) {
    const trimmedName = fields.name.trim()
    if (!trimmedName) errors.name = 'Full name is required'
    else if (trimmedName.length < 2) errors.name = 'Name must be at least 2 characters'
    else if (trimmedName.length > 100) errors.name = 'Name is too long'
    else if (!NAME_PATTERN.test(trimmedName)) errors.name = 'Use letters, spaces, hyphens or apostrophes only'
  }

  if (fields.nationality !== undefined && !fields.nationality) errors.nationality = 'Nationality is required'

  if (fields.phone !== undefined && fields.phone.trim()) {
    const fullPhone = `${fields.phonePrefix || ''} ${fields.phone}`.trim()
    if (fullPhone.length > 30 || !isValidPhone(fullPhone)) {
      errors.phone = 'Enter a valid phone number'
    }
  }

  const gpaValue = fields.gpa?.trim()
  if (gpaValue && (!/^\d*(\.\d{1,2})?$/.test(gpaValue) || Number(gpaValue) < 0 || Number(gpaValue) > 5)) {
    errors.gpa = 'GPA must be between 0 and 5 (e.g. 3.75)'
  }

  const ieltsValue = fields.ieltsScore?.trim()
  if (ieltsValue && (!/^\d(\.\d)?$/.test(ieltsValue) || Number(ieltsValue) < 0 || Number(ieltsValue) > 9)) {
    errors.ieltsScore = 'IELTS band must be between 0 and 9 (e.g. 6.5)'
  }

  const toeflValue = fields.toeflScore?.trim()
  if (toeflValue && (!/^\d+$/.test(toeflValue) || Number(toeflValue) < 0 || Number(toeflValue) > 120)) {
    errors.toeflScore = 'TOEFL must be a whole number between 0 and 120'
  }

  return errors
}

function ProfileRing({ progress, image, initials }: { progress: number; image?: string | null; initials?: string }) {
  const radius = 37
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference

  return (
    <div className="relative h-24 w-24 shrink-0" aria-label={`${progress}% profile complete`} role="img">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="7" className="stroke-gray-100 dark:stroke-gray-800" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke="#e11d48"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-[6px] overflow-hidden rounded-full">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gray-50 text-lg font-bold text-gray-900 dark:bg-gray-800 dark:text-white">
            {initials || `${progress}%`}
          </span>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
      {children} {required && <span className="text-rose-600" aria-hidden>*</span>}
    </span>
  )
}

function Field({
  label,
  hint,
  error,
  errorId,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  errorId?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <SectionLabel required={required}>{label}</SectionLabel>
      {children}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-rose-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <span className="block text-xs leading-5 text-gray-500 dark:text-gray-400">{hint}</span>
      ) : null}
    </div>
  )
}

function SearchableCombobox({
  id,
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
}: {
  id: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)
  const filtered = options.filter((option) => `${option.label} ${option.search || ''}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function toggleOpen() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 260)
    }
    setOpen((current) => !current)
  }

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggleOpen}
        className={cn(input, 'flex items-center justify-between text-left')}
      >
        <span className={cn('flex min-w-0 items-center gap-2', selected ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
          <Flag url={selected?.flag} />
          <span className="truncate">{selected?.label || placeholder}</span>
        </span>
        <ChevronDown size={16} className={cn('shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div
          className={cn(
            'absolute inset-x-0 z-30 flex max-h-64 flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#12141c]',
            openUp ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
          )}
        >
          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 m-2 mb-0 dark:bg-[#1a1d25]">
            <Search size={14} className="text-gray-400" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              aria-label={`Search ${ariaLabel}`}
              className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none dark:text-white"
            />
          </div>
          <ul role="listbox" aria-labelledby={id} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-gray-500">No matches</li>
            ) : filtered.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); setQuery('') }}
                  className={cn('w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-300', option.value === value && 'bg-rose-50 font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300')}
                >
                  <span className="flex items-center gap-2">
                    <Flag url={option.flag} />
                    {option.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50/60 dark:border-gray-800 dark:hover:bg-gray-800/40">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600', checked ? 'bg-rose-600' : 'bg-gray-200 dark:bg-gray-700')}
      >
        <span className={cn('absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<DashboardLoading rows={5} className="mx-auto max-w-[1200px]" />}>
      <SettingsContent />
    </Suspense>
  )
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const { data: session, refetch: refetchSession } = useSession()
  const { data: profile, isLoading, isError, refetch } = trpc.user.getProfile.useQuery()
  const dashboard = trpc.dashboard.overview.useQuery()
  const { data: universityCountries } = trpc.university.countries.useQuery(undefined, { staleTime: Infinity })
  const updateProfile = trpc.user.updateProfile.useMutation()
  const setPassword = trpc.user.setPassword.useMutation()
  const utils = trpc.useUtils()

  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    tabParam === 'study' || tabParam === 'security' || tabParam === 'personal' ? tabParam : 'personal'
  )

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (tab === 'personal') params.delete('tab')
      else params.set('tab', tab)
      const qs = params.toString()
      window.history.replaceState(window.history.state, '', `/dashboard/settings${qs ? `?${qs}` : ''}`)
    }
  }, [])

  const [name, setName] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [nationality, setNationality] = useState('')
  const [country, setCountry] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+880')
  const [phone, setPhone] = useState('')
  const [education, setEducation] = useState('')
  const [targetCountries, setTargetCountries] = useState<string[]>([])
  const [targetSubjects, setTargetSubjects] = useState<string[]>([])
  const [budgetMax, setBudgetMax] = useState<number | ''>('')
  const [gpa, setGpa] = useState('')
  const [ieltsScore, setIeltsScore] = useState('')
  const [toeflScore, setToeflScore] = useState('')
  const [intakeYear, setIntakeYear] = useState('2026')
  const [countrySearch, setCountrySearch] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [preferences, setPreferences] = useState({ updates: true, messages: true, recommendations: false })

  const [uploading, setUploading] = useState(false)

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image must be smaller than 4 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImage(data.url)
      setImagePreview(data.url)
      await updateProfile.mutateAsync({ image: data.url })
      await refetchSession()
      utils.user.getProfile.invalidate()
      toast.success('Profile photo updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
      setImagePreview(image)
    } finally {
      setUploading(false)
    }
  }

  async function removeImage() {
    setImage(null)
    setImagePreview(null)
    try {
      await updateProfile.mutateAsync({ image: '' })
      await refetchSession()
      utils.user.getProfile.invalidate()
      toast.success('Profile photo removed')
    } catch {
      toast.error('Failed to remove photo')
    }
  }

  useEffect(() => {
    if (profile) {
      const student = profile.studentProfile as any
      const storedPhone = student?.phone || ''
      const storedPrefix = PHONE_PREFIXES.find((option) => storedPhone.startsWith(`${option.value} `))
      setName(profile.name || '')
      setImage(profile.image || null)
      setImagePreview(profile.image || null)
      setNationality(student?.nationality || '')
      setCountry(student?.countryOfResidence || '')
      setPhone(storedPrefix ? storedPhone.slice(storedPrefix.value.length).trim() : storedPhone)
      if (storedPrefix) setPhonePrefix(storedPrefix.value)
      setEducation(student?.highestEducation || '')
      setTargetCountries(asStringArray(student?.targetCountries))
      setTargetSubjects(asStringArray(student?.targetSubjects))
      setBudgetMax(typeof student?.budgetMax === 'number' ? student.budgetMax : '')
      setGpa(student?.gpa != null ? String(student.gpa) : '')
      setIeltsScore(student?.ieltsScore != null ? String(student.ieltsScore) : '')
      setToeflScore(student?.toeflScore != null ? String(student.toeflScore) : '')
      setIntakeYear(String(student?.preferredIntakeYear || '2026'))
    }
  }, [profile])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('endow-notification-preferences')
      if (stored) setPreferences(JSON.parse(stored))
    } catch {}
  }, [])

  const student = profile?.studentProfile as any
  const referralCode = student?.referralCode || ''
  const referralBalance = student?.referralBalance || 0
  const userName = profile?.name || session?.user?.name || 'Student'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const completion = useMemo(() => {
    const completed = [name.trim(), nationality, country, phone.trim(), education, intakeYear, targetCountries.length > 0, image].filter(Boolean).length
    return Math.round((completed / 8) * 100)
  }, [name, nationality, country, phone, education, intakeYear, targetCountries.length, image])
  // Education-offering destinations only (South Korea pinned first), merging
  // the static list with the served countries and any active university
  // countries so newly added partners appear automatically.
  const destinationCountries = useMemo(() => {
    const names = new Set<string>(EDUCATION_DESTINATIONS)
    for (const country of SITE_CONFIG.servedCountries) if (country) names.add(country)
    for (const row of universityCountries ?? []) if (row.country) names.add(row.country)
    names.delete('Bangladesh')

    const byName = new Map(COUNTRIES.map((option) => [option.value, option]))
    const build = (name: string): CountryOption =>
      byName.get(name) ?? { value: name, label: name, code: '', flag: undefined }
    const rest = Array.from(names)
      .filter((name) => name !== 'South Korea')
      .sort((a, b) => a.localeCompare(b))
    return [build('South Korea'), ...rest.map(build)]
  }, [universityCountries])

  const filteredCountries = destinationCountries.filter((option) => `${option.label} ${option.code}`.toLowerCase().includes(countrySearch.toLowerCase()))
  const unreadMessages = dashboard.data?.stats?.unreadMessages || 0

  const saveProfile = useCallback(async (tab: Tab = activeTab) => {
    const fieldsToValidate = tab === 'personal'
      ? { name, phonePrefix, phone, nationality, gpa, ieltsScore, toeflScore }
      : { gpa, ieltsScore, toeflScore }
    const validationErrors = validateProfileFields(fieldsToValidate)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the highlighted fields')
      return
    }

    setSaveState('saving')
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        image: image || undefined,
        nationality: nationality || undefined,
        countryOfResidence: country || undefined,
        phone: phone ? `${phonePrefix} ${phone}` : undefined,
        highestEducation: education || undefined,
        targetCountries: asStringArray(targetCountries),
        targetSubjects: asStringArray(targetSubjects),
        budgetMax: budgetMax === '' ? null : Number(budgetMax),
        gpa: gpa.trim() ? Number(gpa) : null,
        ieltsScore: ieltsScore.trim() ? Number(ieltsScore) : null,
        toeflScore: toeflScore.trim() ? Number(toeflScore) : null,
        preferredIntakeYear: intakeYear ? Number(intakeYear) : undefined,
      } as any)

      // Keep the auth session in sync so every surface that reads the signed-in
      // user (nav bar, dashboard header/sidebar, messages…) shows the new name
      // immediately instead of the stale value cached in the session cookie.
      const newName = name.trim()
      if (newName && newName !== (session?.user?.name || '')) {
        try {
          await authClient.updateUser({ name: newName })
          await refetchSession()
        } catch {
          // The profile is already saved; the session will refresh on its own
          // (better-auth re-issues the cookie) even if this call fails.
        }
      }

      await utils.user.getProfile.invalidate()
      utils.dashboard.overview.invalidate()
      setSaveState('success')
      toast.success('Profile updated successfully')
      window.setTimeout(() => setSaveState('idle'), 2200)
    } catch (error: any) {
      setSaveState('idle')
      toast.error(error.message || 'Could not save your profile')
    }
  }, [activeTab, country, education, image, intakeYear, name, nationality, phone, phonePrefix, targetCountries, targetSubjects, budgetMax, gpa, ieltsScore, toeflScore, session, refetchSession, updateProfile, utils])

  async function changePassword(event: React.FormEvent) {
    event.preventDefault()
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters')
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match')
    try {
      await setPassword.mutateAsync({ password: newPassword })
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (error: any) {
      toast.error(error.message || 'Could not update your password')
    }
  }

  function togglePreference(key: keyof typeof preferences, value: boolean) {
    const next = { ...preferences, [key]: value }
    setPreferences(next)
    window.localStorage.setItem('endow-notification-preferences', JSON.stringify(next))
  }

  function toggleCountry(value: string) {
    setTargetCountries((current) => current.includes(value) ? current.filter((countryValue) => countryValue !== value) : current.length < 5 ? [...current, value] : current)
  }

  function toggleSubject(value: string) {
    setTargetSubjects((current) => current.includes(value) ? current.filter((subject) => subject !== value) : current.length < 5 ? [...current, value] : current)
  }

  async function copyReferral() {
    if (!referralCode) return toast.error('Referral code is not available yet')
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      toast.success('Referral code copied')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy the referral code')
    }
  }

  async function shareReferral() {
    if (!referralCode) return toast.error('Referral code is not available yet')
    const text = `Join me on Endow Global with my referral code: ${referralCode}`
    if (navigator.share) {
      await navigator.share({ text }).catch(() => undefined)
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Referral message copied')
    }
  }

  if (isLoading) return <DashboardLoading rows={5} className="mx-auto max-w-[1200px]" />
  if (isError) return <DashboardError onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <StudentPageHeader
        eyebrow="Account settings"
        title="Settings"
        description="Keep your details current so Endow can recommend better courses and guide your application."
        action={
          <button
            type="button"
            onClick={() => saveProfile()}
            disabled={saveState === 'saving'}
            className={cn(btnPrimary, 'min-w-[140px]')}
          >
            {saveState === 'saving' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : saveState === 'success' ? <Check size={17} /> : null}
            {saveState === 'saving' ? 'Saving...' : saveState === 'success' ? 'Saved' : 'Save changes'}
          </button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className={`${studentPanel} p-5`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProfileRing progress={completion} image={imagePreview} initials={userInitials} />
                <label className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-md transition-colors hover:bg-rose-700 dark:border-[#12141c]">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} disabled={uploading} aria-label="Upload profile photo" />
                </label>
                {imagePreview && (
                  <button type="button" onClick={removeImage} className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-600 text-white shadow-md transition-colors hover:bg-gray-700 dark:border-[#12141c]" aria-label="Remove profile photo">
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
                <p className="truncate text-base font-bold text-gray-900 dark:text-white">{userName}</p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || 'Student account'}</p>
                <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">{completion >= 80 ? 'Profile ready' : 'Keep completing it'}</p>
              </div>
            </div>
            <button type="button" onClick={() => selectTab('personal')} className="mt-5 w-full rounded-xl border border-rose-200 px-3 py-2.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">
              Complete profile
            </button>
          </div>

          <nav className={`${studentPanel} p-2`} aria-label="Settings sections">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(tab.id)}
                  className={cn('relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600', active ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white')}
                >
                  {active && <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full bg-rose-600" aria-hidden />}
                  <Icon size={18} aria-hidden />
                  <span>{tab.label}</span>
                  {tab.id === 'security' && unreadMessages > 0 && <span className="ml-auto rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadMessages}</span>}
                </button>
              )
            })}
          </nav>

          <div className={`${studentPanel} p-4 text-xs text-gray-500 dark:text-gray-400`}>
            <p className="truncate">{session?.user?.email}</p>
            <button type="button" onClick={() => toast.info('Use the dashboard menu to sign out')} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-300">
              <LockKeyhole size={13} /> Account security
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-800 dark:bg-[#12141c]" role="tablist" aria-label="Settings tabs">
            {TABS.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => selectTab(tab.id)} className={cn('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 sm:px-4 sm:text-sm', activeTab === tab.id ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white')}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'personal' && (
            <section className={`${studentPanel} p-5 sm:p-6`} role="tabpanel">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-lg bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"><UserRound size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal information</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This is the information your counselor uses to support you.</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); saveProfile() }} noValidate className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Full name" required error={errors.name} errorId="name-error">
                  <input
                    aria-label="Full name"
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-error"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    className={cn(input, errors.name && 'border-rose-500 focus:border-rose-500')}
                    placeholder="Your full name"
                    maxLength={100}
                  />
                </Field>
                <Field label="Email address" hint="Your sign-in email cannot be changed here.">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input aria-label="Email address" aria-readonly="true" value={session?.user?.email || ''} readOnly className={cn(input, 'cursor-not-allowed pl-10 pr-28 text-gray-500')} />
                    <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} /> Verified</span>
                  </div>
                </Field>
                <Field label="Phone number" error={errors.phone}>
                  <div className={cn('flex h-11 rounded-xl border bg-white transition duration-150 focus-within:border-rose-500 dark:bg-[#12141c] dark:focus-within:border-rose-400', errors.phone ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700')}>
                    <div className="w-[108px] shrink-0 border-r border-gray-200 dark:border-gray-700"><SearchableCombobox id="phone-prefix" value={phonePrefix} options={PHONE_PREFIXES} onChange={setPhonePrefix} placeholder="Code" ariaLabel="Phone country code" /></div>
                    <input
                      aria-label="Phone number"
                      aria-invalid={Boolean(errors.phone)}
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value.replace(/[^0-9\s.-]/g, ''))
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                      }}
                      placeholder="1 234 567 890"
                      inputMode="tel"
                      maxLength={20}
                      className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none dark:text-white"
                    />
                  </div>
                </Field>
                <Field label="Nationality" required error={errors.nationality}>
                  <SearchableCombobox
                    id="nationality"
                    value={nationality}
                    options={COUNTRIES}
                    onChange={(value) => {
                      setNationality(value)
                      if (errors.nationality) setErrors((prev) => ({ ...prev, nationality: undefined }))
                    }}
                    placeholder="Select nationality"
                    ariaLabel="Nationality"
                  />
                </Field>
                <Field label="Country of residence">
                  <SearchableCombobox id="residence" value={country} options={COUNTRIES} onChange={setCountry} placeholder="Select country" ariaLabel="Country of residence" />
                </Field>
              </form>
            </section>
          )}

          {activeTab === 'study' && (
            <section className="space-y-6" role="tabpanel">
              <div className={`${studentPanel} p-5 sm:p-6`}>
                <div className="mb-6 flex items-start gap-3"><div className="rounded-lg bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"><GraduationCap size={18} /></div><div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Study preferences</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tell us what you want to study and where you want to go.</p></div></div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Highest education" required><SearchableCombobox id="education" value={education} options={EDUCATION_OPTIONS} onChange={setEducation} placeholder="Select education level" ariaLabel="Highest education" /></Field>
                  <Field label="Preferred intake year" hint="Choose the year you want to start studying.">
                    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Preferred intake year">
                      {INTAKE_YEARS.map((year) => <button key={year} type="button" role="radio" aria-checked={intakeYear === year} onClick={() => setIntakeYear(year)} className={cn('h-11 rounded-xl border text-sm font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600', intakeYear === year ? 'border-rose-600 bg-rose-600 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300 dark:hover:bg-rose-500/10')}>{year}</button>)}
                    </div>
                  </Field>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><SectionLabel>Target countries</SectionLabel><p id="country-hint" className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose up to 5 destinations.</p></div><span className="text-xs font-bold text-gray-500">{targetCountries.length} / 5 selected</span></div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><div className="h-full rounded-full bg-rose-600 transition-all duration-300" style={{ width: `${(targetCountries.length / 5) * 100}%` }} /></div>
                  <div className="relative mt-4"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden /><input aria-label="Search target countries" aria-describedby="country-hint" value={countrySearch} onChange={(event) => setCountrySearch(event.target.value)} placeholder="Search countries" className={cn(input, 'pl-10')} /></div>
                  <div className="mt-4 max-h-56 overflow-y-auto overscroll-contain pr-1" data-lenis-prevent><div className="flex flex-wrap gap-2" role="group" aria-label="Target countries">
                    {filteredCountries.map((option) => { const selected = targetCountries.includes(option.value); const limitReached = targetCountries.length >= 5 && !selected; return <button key={option.value} type="button" aria-pressed={selected} disabled={limitReached} onClick={() => toggleCountry(option.value)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600', selected ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300' : limitReached ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300')}><Flag url={option.flag} />{option.label}</button> })}
                  </div></div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><SectionLabel>Fields of interest</SectionLabel><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose up to 5 subjects you want to study.</p></div><span className="text-xs font-bold text-gray-500">{targetSubjects.length} / 5 selected</span></div>
                  <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Target subjects">
                    {SUBJECT_OPTIONS.map((subject) => { const selected = targetSubjects.includes(subject); const limitReached = targetSubjects.length >= 5 && !selected; return <button key={subject} type="button" aria-pressed={selected} disabled={limitReached} onClick={() => toggleSubject(subject)} className={cn('inline-flex items-center rounded-full border px-3 py-2 text-xs font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600', selected ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300' : limitReached ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300')}>{subject}</button> })}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2 dark:border-gray-800">
                  <Field label="Maximum budget" hint="Used to filter courses within your budget.">
                    <select value={budgetMax === '' ? '' : String(budgetMax)} onChange={(event) => setBudgetMax(event.target.value === '' ? '' : Number(event.target.value))} className={input}>
                      {BUDGET_OPTIONS.map((option) => <option key={option.label} value={option.value === '' ? '' : String(option.value)}>{option.label}</option>)}
                    </select>
                  </Field>
                  <Field label="GPA" hint="Your current grade point average (e.g. 3.75)." error={errors.gpa}>
                    <input
                      aria-invalid={Boolean(errors.gpa)}
                      value={gpa}
                      onChange={(event) => {
                        setGpa(event.target.value.replace(/[^0-9.]/g, ''))
                        if (errors.gpa) setErrors((prev) => ({ ...prev, gpa: undefined }))
                      }}
                      inputMode="decimal"
                      placeholder="e.g. 3.75"
                      maxLength={5}
                      className={cn(input, errors.gpa && 'border-rose-500 focus:border-rose-500')}
                    />
                  </Field>
                  <Field label="IELTS band" hint="Overall band score (0–9), if taken." error={errors.ieltsScore}>
                    <input
                      aria-invalid={Boolean(errors.ieltsScore)}
                      value={ieltsScore}
                      onChange={(event) => {
                        setIeltsScore(event.target.value.replace(/[^0-9.]/g, ''))
                        if (errors.ieltsScore) setErrors((prev) => ({ ...prev, ieltsScore: undefined }))
                      }}
                      inputMode="decimal"
                      placeholder="e.g. 6.5"
                      maxLength={4}
                      className={cn(input, errors.ieltsScore && 'border-rose-500 focus:border-rose-500')}
                    />
                  </Field>
                  <Field label="TOEFL score" hint="Total score (0–120), if taken." error={errors.toeflScore}>
                    <input
                      aria-invalid={Boolean(errors.toeflScore)}
                      value={toeflScore}
                      onChange={(event) => {
                        setToeflScore(event.target.value.replace(/\D/g, ''))
                        if (errors.toeflScore) setErrors((prev) => ({ ...prev, toeflScore: undefined }))
                      }}
                      inputMode="numeric"
                      placeholder="e.g. 90"
                      maxLength={3}
                      className={cn(input, errors.toeflScore && 'border-rose-500 focus:border-rose-500')}
                    />
                  </Field>
                </div>

              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="space-y-6" role="tabpanel">
              <div className={`${studentPanel} p-5 sm:p-6`}>
                <div className="mb-6 flex items-start gap-3"><div className="rounded-lg bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"><ShieldCheck size={18} /></div><div><h2 className="text-lg font-bold text-gray-900 dark:text-white">Security &amp; privacy</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Control your password, messages, and account preferences.</p></div></div>
                <form onSubmit={changePassword} className="grid grid-cols-1 gap-6 border-b border-gray-100 pb-6 md:grid-cols-2 dark:border-gray-800">
                  <Field label="New password" hint="Use at least 8 characters."><div className="relative"><KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden /><input aria-label="New password" aria-describedby="new-password-hint" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={cn(input, 'pl-10 pr-10')} placeholder="Create a new password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus-visible:outline-2 focus-visible:outline-rose-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>
                  <Field label="Confirm password"><input aria-label="Confirm password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={input} placeholder="Repeat your new password" /></Field>
                  <div className="md:col-span-2"><button type="submit" disabled={setPassword.isPending || !newPassword || !confirmPassword} className={cn(btnSecondary)}>{setPassword.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-600/30 border-t-rose-600" /> : <LockKeyhole size={15} />} {setPassword.isPending ? 'Updating...' : 'Update password'}</button></div>
                </form>
                <div className="mt-6 space-y-3"><div className="flex items-center gap-2"><Bell size={17} className="text-rose-600" /><h3 className="text-sm font-bold text-gray-900 dark:text-white">Notification preferences</h3></div><Toggle label="Application updates" description="Get notified when your application status changes." checked={preferences.updates} onChange={(value) => togglePreference('updates', value)} /><Toggle label="Messages" description="Know when your counselor sends you a message." checked={preferences.messages} onChange={(value) => togglePreference('messages', value)} /><Toggle label="Recommendations" description="Receive new course and destination suggestions." checked={preferences.recommendations} onChange={(value) => togglePreference('recommendations', value)} /></div>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm sm:p-6 dark:border-rose-900/40 dark:from-rose-500/10 dark:to-[#12141c]"><div className="flex items-start gap-3"><Gift size={18} className="mt-0.5 text-rose-600" /><div><h2 className="text-base font-bold text-gray-900 dark:text-white">Refer a friend</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Share Endow and earn credits when your friend joins.</p></div></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><code className="flex h-11 flex-1 items-center rounded-xl border border-rose-100 bg-white px-4 text-sm font-bold tracking-[0.18em] text-rose-700 dark:border-rose-900 dark:bg-[#1a1d25] dark:text-rose-300">{referralCode || 'Generating code...'}</code><button type="button" onClick={copyReferral} className={cn(btnPrimary, 'h-11')}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy code'}</button><button type="button" onClick={shareReferral} className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">Share</button></div>{referralBalance > 0 && <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-300">Available balance: {referralBalance.toLocaleString()} credits</p>}</div>

              <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6 dark:border-red-900/70 dark:bg-[#12141c]"><div className="flex items-start gap-3"><Trash2 size={18} className="mt-0.5 text-red-600" /><div><h2 className="text-base font-bold text-red-700 dark:text-red-300">Danger zone</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Account deletion is permanent. Contact support so we can verify and process your request safely.</p></div></div><a href="mailto:contact@endowglobaledu.com?subject=Account%20deletion%20request" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-500/10">Request account deletion</a></div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
