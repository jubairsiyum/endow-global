'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight, ArrowLeft, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import SocialButtons from './SocialButtons'
import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'

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

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
}

export default function SignInForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'password' | 'otp'>('password')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email')
  const [slideDir, setSlideDir] = useState(1)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const checkEmailExists = trpc.user.checkEmailExists.useMutation()

  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const switchMode = useCallback((next: 'password' | 'otp') => {
    setSlideDir(next === 'otp' ? 1 : -1)
    setMode(next)
    if (next === 'otp') setOtpStep('email')
  }, [])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      })

      if (error) {
        toast.error(error.message || 'Invalid email or password')
        return
      }

      // Role-aware redirect — prevents URL confusion (e.g., admin landing on student /dashboard)
      try {
        const sess = await authClient.getSession()
        const role = (sess?.data?.user as any)?.role as string | undefined
        const map: Record<string, string> = {
          STUDENT: '/dashboard',
          COUNSELOR: '/counselor',
          ADMIN: '/admin',
          SUPER_ADMIN: '/admin',
        }
        router.push(map[role ?? 'STUDENT'] || '/dashboard')
      } catch {
        router.push('/dashboard')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendOtp = useCallback(async () => {
    if (!email) { toast.error('Please enter your email'); return }
    setIsLoading(true)
    try {
      const { exists } = await checkEmailExists.mutateAsync({ email })
      if (!exists) {
        toast.error('No account found with this email. Please create one first.')
        return
      }
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      })
      if (error) { toast.error(error.message || 'Failed to send OTP'); return }
      setOtp(['', '', '', '', '', ''])
      toast.success('Verification code sent to your email')
      setSlideDir(1)
      setOtpStep('code')
      setResendTimer(60)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, checkEmailExists])

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
      toast.success('Signed in successfully')
      try {
        const sess = await authClient.getSession()
        const role = (sess?.data?.user as any)?.role as string | undefined
        const map: Record<string, string> = {
          STUDENT: '/dashboard',
          COUNSELOR: '/counselor',
          ADMIN: '/admin',
          SUPER_ADMIN: '/admin',
        }
        router.push(map[role ?? 'STUDENT'] || '/dashboard')
      } catch {
        router.push('/dashboard')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [otp, email, router])

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

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Glass card */}
      <div className="rounded-3xl border border-white/60 bg-white/80 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                Student Portal
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Shield size={14} />
              Secure
            </div>
          </div>

          {/* Decorative bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-slate-950 to-red-700" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <AnimatePresence mode="wait" custom={slideDir}>
            {mode === 'password' ? (
              <motion.div
                key="password"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Welcome <span className="text-red-600">back</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Sign in to manage applications, documents, and counselor sessions.
                </p>

                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                  <InputField icon={Mail} label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </InputField>

                  <InputField icon={LockKeyhole} label="Password">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputField>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !email || !password}
                      className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] motion-reduce:active:scale-100"
                    >
                      {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>
                </form>

                <button
                  type="button"
                  onClick={() => switchMode('otp')}
                  className="mt-3 w-full text-center text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Sign in with a code instead
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <SocialButtons />

                <p className="mt-6 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-bold text-red-600 hover:text-red-700">
                    Create one
                  </Link>
                </p>
              </motion.div>
            ) : otpStep === 'email' ? (
              <motion.div
                key="otp-email"
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Sign in with a <span className="text-red-600">code</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Enter your email and we&apos;ll send you a sign-in code.
                </p>

                <div className="mt-6">
                  <InputField icon={Mail} label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                      onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </InputField>
                </div>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isLoading || !email}
                  className="mt-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                  {isLoading ? 'Sending...' : 'Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('password')}
                  className="mt-3 w-full text-center text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Use password instead
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp-code"
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
                  className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] motion-reduce:active:scale-100"
                >
                  {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setSlideDir(-1); setOtpStep('email') }}
                    className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft size={14} />
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-sm font-bold text-red-600 hover:text-red-700 disabled:text-slate-300"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
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
