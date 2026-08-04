'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { Mail, LockKeyhole, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react'
import Link from 'next/link'
import { logAuthEvent } from '@/app/actions/audit'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 300

function useLockoutTimer(lockoutUntil: number | null) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!lockoutUntil) {
      setRemaining(null)
      return
    }

    setRemaining(Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000)))

    if (lockoutUntil <= Date.now()) {
      setRemaining(null)
      return
    }

    const interval = setInterval(() => {
      const diff = Math.ceil((lockoutUntil - Date.now()) / 1000)
      if (diff <= 0) {
        setRemaining(null)
        clearInterval(interval)
      } else {
        setRemaining(diff)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockoutUntil])

  return { remaining, isLocked: remaining !== null && remaining > 0 }
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

export default function CounselorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const { remaining, isLocked } = useLockoutTimer(lockoutUntil)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (isLocked) {
      setError(`Too many attempts. Please wait ${remaining}s.`)
      return
    }

    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: '/counselor',
      })

      if (res.error) {
        setAttemptCount((prev) => {
          const next = prev + 1
          if (next >= MAX_ATTEMPTS) {
            setLockoutUntil(Date.now() + LOCKOUT_DURATION * 1000)
          }
          return next
        })
        setError(res.error.message || 'Invalid credentials')
        return
      }

      const { data: session } = await authClient.getSession()
      if (
        !session ||
        ((session.user as unknown as { role: string }).role !== 'COUNSELOR' &&
          (session.user as unknown as { role: string }).role !== 'ADMIN' &&
          (session.user as unknown as { role: string }).role !== 'SUPER_ADMIN')
      ) {
        await authClient.signOut()
        setError('Access denied. Counselor role required.')
        return
      }

      logAuthEvent('login.success', {
        id: session.user.id,
        email: session.user.email,
        role: (session.user as unknown as { role: string }).role,
      }).catch(() => {})

      setAttemptCount(0)
      router.push('/counselor')
    } catch {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec] text-slate-950">
      <Navbar />

      <main className="relative isolate flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-3xl border border-white/60 bg-white/80 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">
                    Counselor Portal
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Shield size={14} />
                  Secure
                </div>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-slate-950 to-red-700" />
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Student <span className="text-red-600">Guidance</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Sign in to manage students, sessions, and applications.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {isLocked && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      Account temporarily locked. Try again in {remaining}s.
                    </div>
                  )}
                  {error && !isLocked && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  <InputField icon={Mail} label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="counselor@endow.global"
                      disabled={loading}
                      autoComplete="email"
                      autoFocus
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                  </InputField>

                  <InputField icon={LockKeyhole} label="Password">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                      autoComplete="current-password"
                      className="h-full w-full bg-transparent px-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputField>

                  {attemptCount > 0 && !isLocked && (
                    <p className="text-xs font-medium text-slate-400">
                      {MAX_ATTEMPTS - attemptCount} attempt{MAX_ATTEMPTS - attemptCount !== 1 ? 's' : ''} remaining
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || isLocked || !email || !password}
                      className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all hover:shadow-xl hover:shadow-red-900/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
                    >
                      {loading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                      {loading ? 'Verifying credentials...' : 'Sign In'}
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  <Link
                    href="/login"
                    className="font-bold text-red-600 hover:text-red-700"
                  >
                    Back to student login
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />
      <Footer />
    </div>
  )
}
