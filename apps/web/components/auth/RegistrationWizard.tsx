'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, ArrowRight, ArrowLeft, Check, User, Phone, Globe, BookOpen, CalendarDays, Shield } from 'lucide-react'

import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import SocialButtons from './SocialButtons'

const STEPS = ['email', 'otp', 'profile', 'study'] as const
type Step = (typeof STEPS)[number]

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
  { value: 'HIGH_SCHOOL', label: 'High School', desc: 'Secondary education' },
  { value: 'BACHELORS', label: 'Undergraduate', desc: "Bachelor's degree" },
  { value: 'MASTERS', label: 'Postgraduate', desc: "Master's degree" },
  { value: 'PHD', label: 'PhD', desc: 'Doctoral research' },
  { value: 'DIPLOMA', label: 'Diploma / EAP / KLP', desc: 'Pathway programs' },
] as const

const START_YEARS = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() + i
  return { value: year.toString(), label: year.toString() }
})

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
}

function InputField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</label>
      <div className="mt-1.5 flex min-h-[48px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
        <Icon className="shrink-0 text-slate-400" size={16} />
        {children}
      </div>
    </div>
  )
}

export default function RegistrationWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [slideDir, setSlideDir] = useState(1)

  const [name, setName] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [nationality, setNationality] = useState('')
  const [phone, setPhone] = useState('')
  const [studyDestination, setStudyDestination] = useState('')

  const [studyLevel, setStudyLevel] = useState('')
  const [startDate, setStartDate] = useState('')

  const updateProfile = trpc.user.updateProfile.useMutation()

  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const goTo = useCallback((next: Step) => {
    setSlideDir(STEPS.indexOf(next) > STEPS.indexOf(step) ? 1 : -1)
    setStep(next)
  }, [step])

  const sendOtp = useCallback(async () => {
    if (!email) { toast.error('Please enter your email'); return }
    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      })
      if (error) { toast.error(error.message || 'Failed to send OTP'); return }
      toast.success('Verification code sent to your email')
      goTo('otp')
      setResendTimer(60)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, goTo])

  const verifyOtp = useCallback(async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Please enter the 6-digit code'); return }
    setIsLoading(true)
    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp: code,
      })
      if (result.error) {
        toast.error(result.error.message || 'Invalid or expired verification code')
        return
      }
      setOtpVerified(true)
      goTo('profile')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [otp, email, goTo])

  const completeRegistration = useCallback(async () => {
    if (!name.trim()) { toast.error('Please enter your full name'); return }
    if (!nationality) { toast.error('Please select your nationality'); return }
    if (!studyLevel) { toast.error('Please select your study level'); return }

    setIsLoading(true)
    try {
      updateProfile.mutate(
        {
          name: name.trim(),
          nationality,
          countryOfResidence,
          phone,
          targetCountries: studyDestination ? [studyDestination] : [],
          highestEducation: studyLevel as any,
          preferredIntakeYear: startDate && startDate !== 'help-me-decide' ? parseInt(startDate) : undefined,
          preferredIntakeMonth: startDate === 'help-me-decide' ? 'Help me decide' : undefined,
        },
        {
          onSuccess: () => { toast.success('Account created successfully!'); router.push('/dashboard') },
          onError: () => { toast.success('Account created successfully!'); router.push('/dashboard') },
        }
      )
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [name, nationality, studyLevel, startDate, phone, countryOfResidence, studyDestination, router, updateProfile])

  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const next = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement
      next?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement
      prev?.focus()
    }
  }

  const stepIndex = STEPS.indexOf(step)

  const selectClass =
    'h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none'

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Glass card */}
      <div className="rounded-3xl border border-white/60 bg-white/80 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        {/* Header with step progress */}
        <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                {step === 'email' && 'Step 1 of 4'}
                {step === 'otp' && 'Step 2 of 4'}
                {step === 'profile' && 'Step 3 of 4'}
                {step === 'study' && 'Step 4 of 4'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Shield size={14} />
              Secure
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-slate-950 to-red-700"
              initial={false}
              animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Step dots */}
          <div className="mt-3 flex items-center justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (i < stepIndex) {
                    const target = STEPS[i]
                    goTo(target)
                  }
                }}
                disabled={i > stepIndex}
                className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                  i < stepIndex
                    ? 'cursor-pointer text-green-600 hover:text-green-700'
                    : i === stepIndex
                      ? 'text-slate-900'
                      : 'cursor-default text-slate-300'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    i < stepIndex
                      ? 'bg-green-500 text-white'
                      : i === stepIndex
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {i < stepIndex ? <Check size={10} /> : i + 1}
                </span>
                <span className="hidden sm:inline">
                  {s === 'email' && 'Email'}
                  {s === 'otp' && 'Verify'}
                  {s === 'profile' && 'Profile'}
                  {s === 'study' && 'Study'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <AnimatePresence mode="wait" custom={slideDir}>
            {/* STEP 1: Email */}
            {step === 'email' && (
              <motion.div
                key="email"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Start your <span className="text-red-600">journey</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Enter your email and we&apos;ll send you a verification code.
                </p>

                <div className="mt-6">
                  <InputField icon={Mail} label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </InputField>
                </div>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isLoading || !email}
                  className="mt-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                  {isLoading ? 'Sending...' : 'Continue'}
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <SocialButtons />

                <p className="mt-5 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <a href="/login" className="font-bold text-red-600 hover:text-red-700">
                    Sign in
                  </a>
                </p>
              </motion.div>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Check your <span className="text-red-600">inbox</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-slate-900">{email}</span>
                </p>

                <div className="mt-7 flex justify-center gap-2.5 sm:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      name={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-13 w-11 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100 sm:h-14 sm:w-12"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={isLoading || otp.join('').length !== 6}
                  className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                  {isLoading ? 'Signing in...' : 'Verify'}
                </button>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goTo('email')}
                    className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft size={14} />
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={resendTimer > 0}
                    className="text-sm font-bold text-red-600 hover:text-red-700 disabled:text-slate-300"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Profile Info */}
            {step === 'profile' && (
              <motion.div
                key="profile"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Tell us about <span className="text-red-600">yourself</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Help us personalize your study abroad experience.
                </p>

                <div className="mt-6 space-y-4">
                  <InputField icon={User} label="Full Name">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </InputField>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField icon={Globe} label="Country You Live In">
                      <select
                        value={countryOfResidence}
                        onChange={(e) => setCountryOfResidence(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </InputField>

                    <InputField icon={Globe} label="Nationality">
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select nationality</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </InputField>
                  </div>

                  <InputField icon={Phone} label="Phone Number">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </InputField>

                  <InputField icon={Globe} label="Where Do You Wish to Study?">
                    <select
                      value={studyDestination}
                      onChange={(e) => setStudyDestination(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </InputField>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => goTo('otp')}
                    className="flex h-[48px] items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!name.trim()) { toast.error('Please enter your name'); return }
                      if (!nationality) { toast.error('Please select your nationality'); return }
                      goTo('study')
                    }}
                    className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30"
                  >
                    Save & Continue
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Study Preferences */}
            {step === 'study' && (
              <motion.div
                key="study"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Study <span className="text-red-600">preferences</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Tell us about your academic goals.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Study Level
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {STUDY_LEVELS.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setStudyLevel(level.value)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                            studyLevel === level.value
                              ? 'border-red-300 bg-red-50 ring-2 ring-red-100'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <BookOpen
                            size={16}
                            className={studyLevel === level.value ? 'text-red-600' : 'text-slate-400'}
                          />
                          <div>
                            <div className={`text-sm font-semibold ${studyLevel === level.value ? 'text-red-700' : 'text-slate-800'}`}>
                              {level.label}
                            </div>
                            <div className="text-[11px] text-slate-400">{level.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <InputField icon={CalendarDays} label="Preferred Start Date">
                    <select
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select year</option>
                      {START_YEARS.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                      <option value="help-me-decide">Help me decide</option>
                    </select>
                  </InputField>
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={() => goTo('profile')}
                    className="flex h-[48px] items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={completeRegistration}
                    disabled={isLoading || !studyLevel}
                    className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isLoading ? <Spinner size={16} className="text-white" /> : <Check size={16} />}
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
