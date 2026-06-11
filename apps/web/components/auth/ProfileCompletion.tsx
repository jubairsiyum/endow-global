'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft, Check, Globe, Phone, BookOpen, CalendarDays } from 'lucide-react'

import Spinner from '@/components/ui/Spinner'
import { trpc } from '@/lib/trpc-client'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
  'Brazil','Cambodia','Canada','China','Colombia','Denmark','Egypt','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','Hungary','India','Indonesia','Iran','Iraq','Ireland',
  'Italy','Japan','Jordan','Kenya','Kuwait','Lebanon','Malaysia','Mexico','Morocco','Nepal',
  'Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru','Philippines','Poland',
  'Portugal','Qatar','Romania','Russia','Saudi Arabia','Singapore','South Africa','South Korea',
  'Spain','Sri Lanka','Sweden','Switzerland','Taiwan','Thailand','Turkey','UAE','Uganda',
  'Ukraine','United Kingdom','United States','Vietnam','Zimbabwe',
]

const STUDY_LEVELS = [
  { value: 'HIGH_SCHOOL', label: 'High School' },
  { value: 'BACHELORS', label: 'Undergraduate' },
  { value: 'MASTERS', label: 'Postgraduate' },
  { value: 'PHD', label: 'PhD' },
  { value: 'DIPLOMA', label: 'Diploma / EAP / KLP' },
] as const

const START_YEARS = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() + i
  return { value: year.toString(), label: year.toString() }
})

const containerVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function ProfileCompletion() {
  const router = useRouter()
  const { data: profile, isLoading: profileLoading } = trpc.user.getProfile.useQuery()

  // If profile is already complete, redirect to dashboard
  useEffect(() => {
    if (!profileLoading && profile?.studentProfile?.nationality) {
      router.replace('/dashboard')
    }
  }, [profile, profileLoading, router])
  const [step, setStep] = useState<'profile' | 'study'>('profile')
  const [isLoading, setIsLoading] = useState(false)

  // Profile fields
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [nationality, setNationality] = useState('')
  const [phone, setPhone] = useState('')
  const [studyDestination, setStudyDestination] = useState('')

  // Study fields
  const [studyLevel, setStudyLevel] = useState('')
  const [startDate, setStartDate] = useState('')

  const saveProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile completed!')
      router.push('/dashboard')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save profile')
    },
  })

  const handleComplete = useCallback(() => {
    if (!nationality) {
      toast.error('Please select your nationality')
      return
    }
    if (!studyLevel) {
      toast.error('Please select your study level')
      return
    }

    setIsLoading(true)
    saveProfile.mutate({
      nationality,
      countryOfResidence,
      phone,
      targetCountries: studyDestination ? [studyDestination] : [],
      highestEducation: studyLevel as any,
      preferredIntakeYear: startDate && startDate !== 'help-me-decide' ? parseInt(startDate) : undefined,
      preferredIntakeMonth: startDate === 'help-me-decide' ? 'Help me decide' : undefined,
    })
  }, [nationality, countryOfResidence, phone, studyDestination, studyLevel, startDate, saveProfile])

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold bg-gradient-to-r from-slate-950 to-red-900 text-white shadow-lg">
          {step === 'study' ? <Check size={14} /> : 1}
        </div>
        <div className={`h-0.5 w-8 ${step === 'study' ? 'bg-green-500' : 'bg-slate-200'}`} />
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 'study' ? 'bg-gradient-to-r from-slate-950 to-red-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          2
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'profile' && (
          <motion.div
            key="profile"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Complete your profile
              </p>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                Tell us about <span className="text-red-700">yourself</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Help us personalize your experience.
              </p>
            </div>

            <div className="mt-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                    Country You Live In
                  </label>
                  <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                    <Globe className="shrink-0 text-slate-400" size={16} />
                    <select
                      value={countryOfResidence}
                      onChange={(e) => setCountryOfResidence(e.target.value)}
                      className="h-full w-full bg-transparent px-2 text-sm font-medium text-slate-900 outline-none"
                    >
                      <option value="">Select</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                    Nationality
                  </label>
                  <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                    <Globe className="shrink-0 text-slate-400" size={16} />
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="h-full w-full bg-transparent px-2 text-sm font-medium text-slate-900 outline-none"
                    >
                      <option value="">Select</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Phone Number
                </label>
                <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                  <Phone className="text-slate-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Where Do You Wish to Study?
                </label>
                <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                  <Globe className="shrink-0 text-slate-400" size={16} />
                  <select
                    value={studyDestination}
                    onChange={(e) => setStudyDestination(e.target.value)}
                    className="h-full w-full bg-transparent px-2 text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!nationality) { toast.error('Please select your nationality'); return }
                setStep('study')
              }}
              className="mt-5 flex h-[52px] min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)]"
            >
              Save & Continue
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 'study' && (
          <motion.div
            key="study"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Almost done
              </p>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                Study <span className="text-red-700">preferences</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tell us about your academic goals.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Study Level
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {STUDY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setStudyLevel(level.value)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                        studyLevel === level.value
                          ? 'border-red-400 bg-red-50 text-red-700 ring-4 ring-red-100/80'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen size={16} className={studyLevel === level.value ? 'text-red-600' : 'text-slate-400'} />
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Preferred Start Date
                </label>
                <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                  <CalendarDays className="text-slate-400" size={18} />
                  <select
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none"
                  >
                    <option value="">Select year</option>
                    {START_YEARS.map((y) => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                    <option value="help-me-decide">Help me decide</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="flex h-[48px] items-center justify-center gap-1 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={isLoading || !studyLevel}
                className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
              >
                {isLoading ? <Spinner size={18} className="text-white" /> : <Check size={16} />}
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
