'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, ArrowRight, ArrowLeft, Check, User, Phone, Globe, BookOpen, CalendarDays } from 'lucide-react'

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

export default function RegistrationWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Profile fields (Step 3)
  const [name, setName] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [nationality, setNationality] = useState('')
  const [phone, setPhone] = useState('')
  const [studyDestination, setStudyDestination] = useState('')

  // Study fields (Step 4)
  const [studyLevel, setStudyLevel] = useState('')
  const [startDate, setStartDate] = useState('')

  const updateProfile = trpc.user.updateProfile.useMutation()

  // Resend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const sendOtp = useCallback(async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      })
      if (error) {
        toast.error(error.message || 'Failed to send OTP')
        return
      }
      toast.success('Verification code sent to your email')
      setStep('otp')
      setResendTimer(60)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email])

  const verifyOtp = useCallback(async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }
    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.checkVerificationOtp({
        email,
        otp: code,
        type: 'email-verification',
      })
      if (error) {
        toast.error(error.message || 'Invalid verification code')
        return
      }
      setOtpVerified(true)
      toast.success('Email verified!')
      setStep('profile')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [otp, email])

  const completeRegistration = useCallback(async () => {
    if (!name.trim()) {
      toast.error('Please enter your full name')
      return
    }
    if (!nationality) {
      toast.error('Please select your nationality')
      return
    }
    if (!studyLevel) {
      toast.error('Please select your study level')
      return
    }

    setIsLoading(true)
    try {
      // Generate a random password (user will use OTP to sign in)
      const randomPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 16)

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password: randomPassword,
        callbackURL: '/dashboard',
      })

      if (error) {
        toast.error(error.message || 'Failed to create account')
        return
      }

      // Sign in to get a session, then update profile
      const signInResult = await authClient.signIn.emailOtp({
        email,
        otp: otp.join(''),
      })

      if (!signInResult.error) {
        // Save profile data
        updateProfile.mutate(
          {
            nationality,
            countryOfResidence,
            phone,
            targetCountries: studyDestination ? [studyDestination] : [],
            highestEducation: studyLevel as any,
            preferredIntakeYear: startDate && startDate !== 'help-me-decide' ? parseInt(startDate) : undefined,
            preferredIntakeMonth: startDate === 'help-me-decide' ? 'Help me decide' : undefined,
          },
          {
            onSuccess: () => {
              toast.success('Account created successfully!')
              router.push('/dashboard')
            },
            onError: () => {
              // Profile saved is best-effort; account is created regardless
              toast.success('Account created successfully!')
              router.push('/dashboard')
            },
          }
        )
      } else {
        router.push('/login')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, otp, name, nationality, studyLevel, startDate, phone, countryOfResidence, studyDestination, router, updateProfile])

  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
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

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i < stepIndex
                  ? 'bg-green-500 text-white'
                  : i === stepIndex
                    ? 'bg-gradient-to-r from-slate-950 to-red-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < stepIndex ? <Check size={14} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 ${i < stepIndex ? 'bg-green-500' : 'bg-slate-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Email */}
        {step === 'email' && (
          <motion.div
            key="email"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Start your journey
              </p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                Enter your <span className="text-red-700">email</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We&apos;ll send you a verification code to get started.
              </p>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Email
              </label>
              <div className="mt-1 flex h-[52px] min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                <Mail className="text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                  className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={sendOtp}
              disabled={isLoading || !email}
              className="mt-5 flex h-[52px] min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? <Spinner size={18} className="text-white" /> : <ArrowRight size={16} />}
              {isLoading ? 'Sending...' : 'Continue'}
            </button>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <SocialButtons />
          </motion.div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Check your email
              </p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                Enter the <span className="text-red-700">code</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We sent a 6-digit code to <span className="font-semibold text-slate-900">{email}</span>
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-2">
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
                  className="h-14 w-12 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-red-400 focus:ring-4 focus:ring-red-100/80 sm:h-16 sm:w-14"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={verifyOtp}
              disabled={isLoading || otp.join('').length !== 6}
              className="mt-6 flex h-[52px] min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? <Spinner size={18} className="text-white" /> : <ArrowRight size={16} />}
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft size={14} />
                Change email
              </button>

              <button
                type="button"
                onClick={sendOtp}
                disabled={resendTimer > 0}
                className="text-sm font-bold text-red-700 hover:text-red-800 disabled:text-slate-400"
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
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Almost there
              </p>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                Tell us about <span className="text-red-700">yourself</span>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Help us personalize your experience.
              </p>
            </div>

            <div className="mt-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                  Full Name
                </label>
                <div className="mt-1 flex min-h-[48px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
                  <User className="text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

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

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setStep('otp')}
                className="flex h-[48px] items-center justify-center gap-1 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) { toast.error('Please enter your name'); return }
                  if (!nationality) { toast.error('Please select your nationality'); return }
                  setStep('study')
                }}
                className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)]"
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
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
                Final step
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
                onClick={completeRegistration}
                disabled={isLoading || !studyLevel}
                className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
              >
                {isLoading ? <Spinner size={18} className="text-white" /> : <Check size={16} />}
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
