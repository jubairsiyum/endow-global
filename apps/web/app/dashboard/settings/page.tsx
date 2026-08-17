'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Bell,
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
} from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { StudentPageHeader, studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, btnSecondary, input } from '@/components/dashboard/ui'
import { cn, asStringArray } from '@/lib/utils'

type Tab = 'personal' | 'study' | 'security'
type SaveState = 'idle' | 'saving' | 'success'

interface Option {
  value: string
  label: string
  search?: string
  flag?: string
}

function flagUrl(code: string) {
  return `https://flagcdn.com/w40/${code}.png`
}

function Flag({ url }: { url?: string }) {
  if (!url) return null
  return <img src={url} alt="" loading="lazy" className="h-4 w-6 shrink-0 rounded-[3px] object-cover ring-1 ring-black/5" />
}

const COUNTRIES: Option[] = [
  { value: 'Bangladesh', label: 'Bangladesh', flag: flagUrl('bd') },
  { value: 'India', label: 'India', flag: flagUrl('in') },
  { value: 'Pakistan', label: 'Pakistan', flag: flagUrl('pk') },
  { value: 'Nepal', label: 'Nepal', flag: flagUrl('np') },
  { value: 'Sri Lanka', label: 'Sri Lanka', flag: flagUrl('lk') },
  { value: 'Nigeria', label: 'Nigeria', flag: flagUrl('ng') },
  { value: 'Kenya', label: 'Kenya', flag: flagUrl('ke') },
  { value: 'Ghana', label: 'Ghana', flag: flagUrl('gh') },
  { value: 'South Korea', label: 'South Korea', flag: flagUrl('kr') },
  { value: 'Japan', label: 'Japan', flag: flagUrl('jp') },
  { value: 'China', label: 'China', flag: flagUrl('cn') },
  { value: 'Malaysia', label: 'Malaysia', flag: flagUrl('my') },
  { value: 'Indonesia', label: 'Indonesia', flag: flagUrl('id') },
  { value: 'Australia', label: 'Australia', flag: flagUrl('au') },
  { value: 'United Kingdom', label: 'United Kingdom', flag: flagUrl('gb') },
  { value: 'United States', label: 'United States', flag: flagUrl('us') },
  { value: 'Canada', label: 'Canada', flag: flagUrl('ca') },
  { value: 'Germany', label: 'Germany', flag: flagUrl('de') },
  { value: 'France', label: 'France', flag: flagUrl('fr') },
  { value: 'UAE', label: 'UAE', flag: flagUrl('ae') },
  { value: 'Saudi Arabia', label: 'Saudi Arabia', flag: flagUrl('sa') },
  { value: 'Ireland', label: 'Ireland', flag: flagUrl('ie') },
  { value: 'New Zealand', label: 'New Zealand', flag: flagUrl('nz') },
  { value: 'Netherlands', label: 'Netherlands', flag: flagUrl('nl') },
]

const PHONE_PREFIXES: Option[] = [
  { value: '+880', label: '+880', search: 'Bangladesh', flag: flagUrl('bd') },
  { value: '+91', label: '+91', search: 'India', flag: flagUrl('in') },
  { value: '+92', label: '+92', search: 'Pakistan', flag: flagUrl('pk') },
  { value: '+977', label: '+977', search: 'Nepal', flag: flagUrl('np') },
  { value: '+61', label: '+61', search: 'Australia', flag: flagUrl('au') },
  { value: '+44', label: '+44', search: 'United Kingdom', flag: flagUrl('gb') },
  { value: '+1', label: '+1', search: 'United States Canada', flag: flagUrl('us') },
  { value: '+82', label: '+82', search: 'South Korea', flag: flagUrl('kr') },
  { value: '+81', label: '+81', search: 'Japan', flag: flagUrl('jp') },
  { value: '+49', label: '+49', search: 'Germany', flag: flagUrl('de') },
]

const EDUCATION_OPTIONS: Option[] = [
  { value: 'HIGH_SCHOOL', label: 'High School', search: 'secondary education' },
  { value: 'BACHELORS', label: "Bachelor's degree", search: 'undergraduate' },
  { value: 'MASTERS', label: "Master's degree", search: 'postgraduate' },
  { value: 'PHD', label: 'PhD', search: 'doctoral research' },
]

const INTAKE_YEARS = ['2025', '2026', '2027', '2028']

const TABS: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: 'personal', label: 'Personal info', icon: UserRound },
  { id: 'study', label: 'Study preferences', icon: GraduationCap },
  { id: 'security', label: 'Security & privacy', icon: ShieldCheck },
]

function ProfileRing({ progress }: { progress: number }) {
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
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white">{progress}%</span>
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
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <SectionLabel required={required}>{label}</SectionLabel>
      {children}
      {hint && <span className="block text-xs leading-5 text-gray-500 dark:text-gray-400">{hint}</span>}
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

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className={cn(input, 'flex items-center justify-between text-left')}
      >
        <span className={cn('flex min-w-0 items-center gap-2', selected ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
          <Flag url={selected?.flag} />
          <span className="truncate">{selected?.label || placeholder}</span>
        </span>
        <ChevronDown size={16} className={cn('shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-[#12141c]">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 dark:bg-[#1a1d25]">
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
          <ul role="listbox" aria-labelledby={id} className="mt-1 max-h-52 overflow-y-auto">
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
        <span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { data: profile, isLoading, isError, refetch } = trpc.user.getProfile.useQuery()
  const dashboard = trpc.dashboard.overview.useQuery()
  const updateProfile = trpc.user.updateProfile.useMutation()
  const setPassword = trpc.user.setPassword.useMutation()
  const utils = trpc.useUtils()

  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const [name, setName] = useState('')
  const [nationality, setNationality] = useState('')
  const [country, setCountry] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+880')
  const [phone, setPhone] = useState('')
  const [education, setEducation] = useState('')
  const [targetCountries, setTargetCountries] = useState<string[]>([])
  const [intakeYear, setIntakeYear] = useState('2026')
  const [countrySearch, setCountrySearch] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [preferences, setPreferences] = useState({ updates: true, messages: true, recommendations: false })

  useEffect(() => {
    if (profile) {
      const student = profile.studentProfile as any
      const storedPhone = student?.phone || ''
      const storedPrefix = PHONE_PREFIXES.find((option) => storedPhone.startsWith(`${option.value} `))
      setName(profile.name || '')
      setNationality(student?.nationality || '')
      setCountry(student?.countryOfResidence || '')
      setPhone(storedPrefix ? storedPhone.slice(storedPrefix.value.length).trim() : storedPhone)
      if (storedPrefix) setPhonePrefix(storedPrefix.value)
      setEducation(student?.highestEducation || '')
      setTargetCountries(asStringArray(student?.targetCountries))
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
  const completion = useMemo(() => {
    const completed = [name.trim(), nationality, country, phone.trim(), education, intakeYear, targetCountries.length > 0].filter(Boolean).length
    return Math.round((completed / 7) * 100)
  }, [name, nationality, country, phone, education, intakeYear, targetCountries.length])
  const filteredCountries = COUNTRIES.filter((option) => `${option.label} ${option.search || ''}`.toLowerCase().includes(countrySearch.toLowerCase()))
  const unreadMessages = dashboard.data?.stats?.unreadMessages || 0

  const saveProfile = useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault()
    setSaveState('saving')
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        nationality: nationality || undefined,
        countryOfResidence: country || undefined,
        phone: phone ? `${phonePrefix} ${phone}` : undefined,
        highestEducation: education || undefined,
        targetCountries: asStringArray(targetCountries),
        preferredIntakeYear: intakeYear ? Number(intakeYear) : undefined,
      } as any)
      await utils.user.getProfile.invalidate()
      setSaveState('success')
      toast.success('Profile updated successfully')
      window.setTimeout(() => setSaveState('idle'), 2200)
    } catch (error: any) {
      setSaveState('idle')
      toast.error(error.message || 'Could not save your profile')
    }
  }, [country, education, intakeYear, name, nationality, phone, phonePrefix, targetCountries, updateProfile, utils.user.getProfile])

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
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className={`${studentPanel} p-5`}>
            <div className="flex items-center gap-4">
              <ProfileRing progress={completion} />
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-gray-900 dark:text-white">{userName}</p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || 'Student account'}</p>
                <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">{completion >= 80 ? 'Profile ready' : 'Keep completing it'}</p>
              </div>
            </div>
            <button type="button" onClick={() => setActiveTab('personal')} className="mt-5 w-full rounded-xl border border-rose-200 px-3 py-2.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-500/10">
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
                  onClick={() => setActiveTab(tab.id)}
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
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={cn('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose-600 sm:px-4 sm:text-sm', activeTab === tab.id ? 'bg-rose-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white')}>
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
              <form onSubmit={saveProfile} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Full name" required>
                  <input aria-label="Full name" aria-required="true" value={name} onChange={(event) => setName(event.target.value)} className={input} placeholder="Your full name" />
                </Field>
                <Field label="Email address" hint="Your sign-in email cannot be changed here.">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input aria-label="Email address" aria-readonly="true" value={session?.user?.email || ''} readOnly className={cn(input, 'cursor-not-allowed pl-10 pr-28 text-gray-500')} />
                    <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} /> Verified</span>
                  </div>
                </Field>
                <Field label="Phone number">
                  <div className="flex h-11 overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-150 focus-within:border-rose-500 dark:border-gray-700 dark:bg-[#12141c] dark:focus-within:border-rose-400">
                    <div className="w-[108px] shrink-0 border-r border-gray-200 dark:border-gray-700"><SearchableCombobox id="phone-prefix" value={phonePrefix} options={PHONE_PREFIXES} onChange={setPhonePrefix} placeholder="Code" ariaLabel="Phone country code" /></div>
                    <input aria-label="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="1 234 567 890" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none dark:text-white" />
                  </div>
                </Field>
                <Field label="Nationality" required>
                  <SearchableCombobox id="nationality" value={nationality} options={COUNTRIES} onChange={setNationality} placeholder="Select nationality" ariaLabel="Nationality" />
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
                  <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Target countries">
                    {filteredCountries.map((option) => { const selected = targetCountries.includes(option.value); const limitReached = targetCountries.length >= 5 && !selected; return <button key={option.value} type="button" aria-pressed={selected} disabled={limitReached} onClick={() => toggleCountry(option.value)} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600', selected ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300' : limitReached ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600' : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:bg-rose-50 dark:border-gray-700 dark:bg-[#1a1d25] dark:text-gray-300')}><Flag url={option.flag} />{option.label}</button> })}
                  </div>
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
