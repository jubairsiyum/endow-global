'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight, ArrowLeft, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'
import OtpInput from './OtpInput'

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

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<'sign-in' | 'forgot'>('sign-in')
  const [resetStep, setResetStep] = useState<'email' | 'code'>('email')
  const [resetEmail, setResetEmail] = useState('')
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setInterval(() => setResendTimer((current) => current - 1), 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: normalizedEmail,
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

  const sendPasswordResetCode = async () => {
    const normalizedEmail = resetEmail.trim().toLowerCase()
    if (!normalizedEmail) {
      toast.error('Please enter your email')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.requestPasswordReset({ email: normalizedEmail })
      if (error) {
        toast.error(error.message || 'Unable to send password reset code')
        return
      }
      setResetEmail(normalizedEmail)
      setResetOtp(['', '', '', '', '', ''])
      setResetStep('code')
      setResendTimer(60)
      toast.success('Password reset code sent to your email')
    } catch {
      toast.error('Unable to send password reset code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    const code = resetOtp.join('')

    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email: resetEmail,
        otp: code,
        password: newPassword,
      })
      if (error) {
        toast.error(error.message || 'Invalid or expired reset code')
        return
      }

      toast.success('Password reset successfully. You can now sign in.')
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setResetOtp(['', '', '', '', '', ''])
      setResetStep('email')
      setView('sign-in')
    } catch {
      toast.error('Unable to reset your password. Please try again.')
    } finally {
      setIsLoading(false)
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
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">Student Portal</p>
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {view === 'sign-in' ? (
              <>
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Welcome <span className="text-red-600">back</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Sign in to manage applications, documents, and counselor sessions.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  onClick={() => setView('forgot')}
                  className="mt-4 w-full text-center text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Forgot password?
                </button>

                {/* Google sign-in is temporarily disabled. */}
                <p className="mt-6 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-bold text-red-600 hover:text-red-700">
                    Create one
                  </Link>
                </p>
              </>
            ) : (
              <>
                {resetStep === 'email' ? (
                  <>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      Reset your <span className="text-red-600">password</span>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Enter your email and we&apos;ll send you a password reset code.
                    </p>

                    <form
                      onSubmit={(event) => {
                        event.preventDefault()
                        void sendPasswordResetCode()
                      }}
                      className="mt-6 space-y-4"
                    >
                      <InputField icon={Mail} label="Email Address">
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="you@example.com"
                          disabled={isLoading}
                          autoComplete="email"
                          className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                        />
                      </InputField>
                      <button
                        type="submit"
                        disabled={isLoading || !resetEmail.trim()}
                        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                        {isLoading ? 'Sending...' : 'Send reset code'}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                      Create a new <span className="text-red-600">password</span>
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Enter the 6-digit code sent to{' '}
                      <span className="font-semibold text-slate-900">{resetEmail}</span>.
                    </p>

                    <OtpInput value={resetOtp} onChange={setResetOtp} disabled={isLoading} namePrefix="reset-otp" />

                    <form onSubmit={resetPassword} className="mt-6 space-y-4">
                      <InputField icon={LockKeyhole} label="New Password">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((current) => !current)}
                          className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                          aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </InputField>

                      <InputField icon={LockKeyhole} label="Confirm Password">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                          aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </InputField>

                      <button
                        type="submit"
                        disabled={isLoading || resetOtp.join('').length !== 6 || !newPassword || !confirmPassword}
                        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {isLoading ? <Spinner size={16} className="text-white" /> : <ArrowRight size={16} />}
                        {isLoading ? 'Updating...' : 'Update password'}
                      </button>
                    </form>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setResetStep('email')}
                        className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
                      >
                        <ArrowLeft size={14} />
                        Change email
                      </button>
                      <button
                        type="button"
                        onClick={() => void sendPasswordResetCode()}
                        disabled={resendTimer > 0 || isLoading}
                        className="text-sm font-bold text-red-600 hover:text-red-700 disabled:text-slate-300"
                      >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                      </button>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => { setView('sign-in'); setResetStep('email') }}
                  className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
