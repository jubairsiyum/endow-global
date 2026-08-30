'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound,
  Briefcase,
  Globe,
  Languages,
  DollarSign,
  CalendarClock,
  ShieldCheck,
  X,
} from 'lucide-react'

import { trpc } from '@/lib/trpc-client'
import { authClient, useSession } from '@/lib/auth-client'
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardState'
import { studentPanel } from '@/components/dashboard/StudentPageHeader'
import { btnPrimary, btnSecondary, input } from '@/components/dashboard/ui'
import { cn, asStringArray } from '@/lib/utils'

type Tab = 'profile' | 'expertise' | 'availability' | 'security'
type SaveState = 'idle' | 'saving' | 'success'

const TABS: { id: Tab; label: string; icon: typeof UserRound }[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'expertise', label: 'Expertise', icon: Briefcase },
  { id: 'availability', label: 'Availability', icon: CalendarClock },
  { id: 'security', label: 'Security', icon: ShieldCheck },
]

const COUNTRIES = [
  'United Kingdom',
  'Australia',
  'Canada',
  'United States',
  'Germany',
  'New Zealand',
  'Malaysia',
  'United Arab Emirates',
  'South Korea',
  'Japan',
  'Singapore',
]

const SUBJECTS = [
  'Computer Science',
  'Business',
  'Engineering',
  'Medicine',
  'Law',
  'Arts',
  'Hospitality',
  'Data Science',
  'Economics',
  'Biology',
]

const LANGUAGES = ['English', 'Bengali', 'Hindi', 'Arabic', 'Vietnamese', 'Korean', 'Japanese', 'French', 'German', 'Spanish', 'Urdu']

function ProfileRing({ progress, image, initials }: { progress: number; image?: string | null; initials?: string }) {
  const radius = 37
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference
  return (
    <div className="relative h-24 w-24 shrink-0" aria-label={`${progress}% profile complete`} role="img">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="7" className="stroke-gray-100" />
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="7" strokeLinecap="round" stroke="#E8A33D" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-700 ease-out" />
      </svg>
      <div className="absolute inset-[6px] overflow-hidden rounded-full">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gray-50 text-lg font-bold text-gray-900">{initials || `${progress}%`}</span>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">{children}</span>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <SectionLabel>{label}</SectionLabel>
      {children}
      {hint && <span className="block text-xs leading-5 text-gray-500">{hint}</span>}
    </div>
  )
}

function Chip({ label, selected, onToggle, disabled }: { label: string; selected: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        selected ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {selected && <Check size={12} className="mr-1" />}
      {label}
    </button>
  )
}

export default function CounselorSettingsPage() {
  return (
    <Suspense fallback={<DashboardLoading rows={5} className="mx-auto max-w-[1200px]" />}>
      <CounselorSettingsContent />
    </Suspense>
  )
}

function CounselorSettingsContent() {
  const searchParams = useSearchParams()
  const { data: session, refetch: refetchSession } = useSession()
  const { data: profileData, isLoading, isError, refetch } = trpc.counselor.getProfile.useQuery()
  const updateProfile = trpc.counselor.updateProfile.useMutation()
  const setPassword = trpc.user.setPassword.useMutation()
  const utils = trpc.useUtils()

  const tabParam = searchParams.get('tab') as Tab | null
  const [activeTab, setActiveTab] = useState<Tab>(() => (tabParam && ['profile', 'expertise', 'availability', 'security'].includes(tabParam) ? (tabParam as Tab) : 'profile'))

  const selectTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(window.location.search)
    if (tab === 'profile') params.delete('tab')
    else params.set('tab', tab)
    const qs = params.toString()
    window.history.replaceState(window.history.state, '', `/counselor/settings${qs ? `?${qs}` : ''}`)
  }, [])

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bio, setBio] = useState('')
  const [expertiseCountries, setExpertiseCountries] = useState<string[]>([])
  const [expertiseSubjects, setExpertiseSubjects] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [calUsername, setCalUsername] = useState('')
  const [sessionRate, setSessionRate] = useState<string>('')
  const [isAvailable, setIsAvailable] = useState(true)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [uploading, setUploading] = useState(false)

  // Populate from profile
  useEffect(() => {
    if (profileData) {
      const user: any = (profileData as any).user || {}
      const p: any = profileData as any
      setName(user.name || session?.user?.name || '')
      setEmail(user.email || session?.user?.email || '')
      setImage(user.image || (session?.user as any)?.image || null)
      setImagePreview(user.image || (session?.user as any)?.image || null)
      setBio(p.bio || '')
      setExpertiseCountries(asStringArray(p.expertiseCountries))
      setExpertiseSubjects(asStringArray(p.expertiseSubjects))
      setLanguages(asStringArray(p.languages).length ? asStringArray(p.languages) : ['English'])
      setCalUsername(p.calUsername || '')
      setSessionRate(p.sessionRate != null ? String(p.sessionRate) : '')
      setIsAvailable(p.isAvailable ?? true)
    }
  }, [profileData, session])

  const userName = name || session?.user?.name || 'Counselor'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const completion = useMemo(() => {
    const filled = [name.trim(), email.trim(), bio.trim(), expertiseCountries.length, expertiseSubjects.length, languages.length, image].filter(Boolean).length
    return Math.round((filled / 7) * 100)
  }, [name, email, bio, expertiseCountries.length, expertiseSubjects.length, languages.length, image])

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
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
      await updateProfile.mutateAsync({ image: data.url } as any)
      await refetchSession()
      utils.counselor.getProfile.invalidate()
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
      await updateProfile.mutateAsync({ image: null } as any)
      await refetchSession()
      utils.counselor.getProfile.invalidate()
      toast.success('Profile photo removed')
    } catch {
      toast.error('Failed to remove photo')
    }
  }

  async function saveProfileTab() {
    setSaveState('saving')
    try {
      await updateProfile.mutateAsync({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        image: image ?? undefined,
        bio: bio.trim() || null,
      } as any)
      if (name.trim() && name.trim() !== (session?.user?.name || '')) {
        try {
          await authClient.updateUser({ name: name.trim() })
          await refetchSession()
        } catch {}
      }
      await utils.counselor.getProfile.invalidate()
      setSaveState('success')
      toast.success('Profile updated')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (e: any) {
      setSaveState('idle')
      toast.error(e.message || 'Could not save profile')
    }
  }

  async function saveExpertiseTab() {
    setSaveState('saving')
    try {
      await updateProfile.mutateAsync({
        expertiseCountries,
        expertiseSubjects,
        languages,
      } as any)
      await utils.counselor.getProfile.invalidate()
      setSaveState('success')
      toast.success('Expertise updated')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (e: any) {
      setSaveState('idle')
      toast.error(e.message || 'Could not save expertise')
    }
  }

  async function saveAvailabilityTab() {
    setSaveState('saving')
    try {
      await updateProfile.mutateAsync({
        calUsername: calUsername.trim() || null,
        sessionRate: sessionRate.trim() ? Number(sessionRate) : 0,
        isAvailable,
      } as any)
      await utils.counselor.getProfile.invalidate()
      setSaveState('success')
      toast.success('Availability updated')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (e: any) {
      setSaveState('idle')
      toast.error(e.message || 'Could not save')
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters')
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match')
    try {
      await setPassword.mutateAsync({ password: newPassword })
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (e: any) {
      toast.error(e.message || 'Could not update password')
    }
  }

  function toggleArray(setter: React.Dispatch<React.SetStateAction<string[]>>, value: string, max = 10) {
    setter((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : cur.length < max ? [...cur, value] : cur))
  }

  if (isLoading) return <DashboardLoading rows={5} className="mx-auto max-w-[1200px]" />
  if (isError) return <DashboardError onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Counselor settings</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-[28px]">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile, expertise and availability.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (activeTab === 'profile') saveProfileTab()
            else if (activeTab === 'expertise') saveExpertiseTab()
            else if (activeTab === 'availability') saveAvailabilityTab()
          }}
          disabled={saveState === 'saving'}
          className={cn(btnPrimary, 'min-w-[140px]')}
        >
          {saveState === 'saving' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : saveState === 'success' ? <Check size={17} /> : null}
          {saveState === 'saving' ? 'Saving...' : saveState === 'success' ? 'Saved' : 'Save changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className={`${studentPanel} p-5`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProfileRing progress={completion} image={imagePreview} initials={userInitials} />
                <label className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-md hover:bg-amber-600">
                  <Camera size={14} />
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageSelect} disabled={uploading} aria-label="Upload photo" />
                </label>
                {imagePreview && (
                  <button type="button" onClick={removeImage} className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-600 text-white shadow-md hover:bg-gray-700" aria-label="Remove photo">
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
                <p className="truncate text-base font-bold text-gray-900">{userName}</p>
                <p className="truncate text-xs text-gray-500">{session?.user?.email || ''}</p>
                <p className="mt-1 text-xs font-semibold text-amber-600">{completion}% complete</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span className={isAvailable ? 'text-emerald-700 font-medium' : 'text-gray-500'}>{isAvailable ? 'Available for students' : 'Unavailable'}</span>
            </div>
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
                  className={cn('relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors', active ? 'bg-amber-50 text-amber-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}
                >
                  {active && <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full bg-amber-500" aria-hidden />}
                  <Icon size={18} aria-hidden />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border bg-white p-1.5 shadow-sm" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => selectTab(tab.id)}
                className={cn('whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors sm:px-4 sm:text-sm', activeTab === tab.id ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <section className={`${studentPanel} p-5 sm:p-6`} role="tabpanel">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-lg bg-amber-50 p-2.5 text-amber-700"><UserRound size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Profile</h2>
                  <p className="mt-1 text-sm text-gray-500">Your public counselor profile seen by students.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Full name">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={input} maxLength={100} />
                </Field>
                <Field label="Email address" hint="Contact support to change email if needed.">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className={cn(input, 'pl-10')} />
                  </div>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Bio" hint="Short introduction for students (max 2000 chars).">
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Experienced counselor passionate about guiding students..." rows={4} maxLength={2000} className={cn(input, 'h-auto min-h-[100px] resize-none py-3')} />
                    <span className="text-[11px] text-gray-400">{bio.length}/2000</span>
                  </Field>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'expertise' && (
            <section className="space-y-6" role="tabpanel">
              <div className={`${studentPanel} p-5 sm:p-6`}>
                <div className="mb-6 flex items-start gap-3"><div className="rounded-lg bg-amber-50 p-2.5 text-amber-700"><Globe size={18} /></div><div><h2 className="text-lg font-bold text-gray-900">Expertise</h2><p className="mt-1 text-sm text-gray-500">Choose countries, subjects and languages you support.</p></div></div>

                <Field label="Expertise countries" hint="Select up to 10.">
                  <div className="flex flex-wrap gap-2">
                    {COUNTRIES.map((c) => (
                      <Chip key={c} label={c} selected={expertiseCountries.includes(c)} onToggle={() => toggleArray(setExpertiseCountries, c, 10)} />
                    ))}
                  </div>
                </Field>

                <div className="mt-6">
                  <Field label="Expertise subjects" hint="Select up to 10.">
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => (
                        <Chip key={s} label={s} selected={expertiseSubjects.includes(s)} onToggle={() => toggleArray(setExpertiseSubjects, s, 10)} />
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Languages" hint="Select up to 10.">
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((l) => (
                        <Chip key={l} label={l} selected={languages.includes(l)} onToggle={() => toggleArray(setLanguages, l, 10)} />
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'availability' && (
            <section className={`${studentPanel} p-5 sm:p-6`} role="tabpanel">
              <div className="mb-6 flex items-start gap-3"><div className="rounded-lg bg-amber-50 p-2.5 text-amber-700"><CalendarClock size={18} /></div><div><h2 className="text-lg font-bold text-gray-900">Availability & rates</h2><p className="mt-1 text-sm text-gray-500">Manage how students book you.</p></div></div>

              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Available for new students</p>
                    <p className="text-xs text-gray-500">When off, you will not be auto-assigned new students and students see you as unavailable.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAvailable}
                    onClick={() => setIsAvailable((v) => !v)}
                    className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', isAvailable ? 'bg-amber-500' : 'bg-gray-200')}
                  >
                    <span className={cn('absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', isAvailable ? 'translate-x-5' : 'translate-x-0')} />
                  </button>
                </div>

                <Field label="Cal.com username" hint="Used to generate your scheduling link (e.g. https://cal.com/yourname).">
                  <div className="relative">
                    <CalendarClock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input value={calUsername} onChange={(e) => setCalUsername(e.target.value)} placeholder="your-cal-username" className={cn(input, 'pl-10')} />
                  </div>
                </Field>

                <Field label="Session rate" hint="In your local currency, per 60-min session. 0 = free.">
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input value={sessionRate} onChange={(e) => setSessionRate(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 2500" inputMode="numeric" className={cn(input, 'pl-10')} />
                  </div>
                </Field>
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="space-y-6" role="tabpanel">
              <div className={`${studentPanel} p-5 sm:p-6`}>
                <div className="mb-6 flex items-start gap-3"><div className="rounded-lg bg-amber-50 p-2.5 text-amber-700"><ShieldCheck size={18} /></div><div><h2 className="text-lg font-bold text-gray-900">Security</h2><p className="mt-1 text-sm text-gray-500">Update your password.</p></div></div>
                <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="New password" hint="At least 8 characters.">
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                      <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a new password" className={cn(input, 'pl-10 pr-10')} />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                  </Field>
                  <Field label="Confirm password">
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className={input} />
                  </Field>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={setPassword.isPending || !newPassword || !confirmPassword} className={cn(btnSecondary)}>
                      {setPassword.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" /> : <LockKeyhole size={15} />} {setPassword.isPending ? 'Updating...' : 'Update password'}
                    </button>
                  </div>
                </form>
              </div>

              <div className={`${studentPanel} p-5 sm:p-6`}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900"><Bell size={16} className="text-amber-600" /> Notifications</h3>
                <p className="mt-1 text-xs text-gray-500">You will receive email notifications for new assigned students and booked sessions (via SMTP).</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
