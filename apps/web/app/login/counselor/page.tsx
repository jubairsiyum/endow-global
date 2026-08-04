'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { logAuthEvent } from '@/app/actions/audit'

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
    <main className="flex min-h-dvh items-center justify-center px-4" style={{ background: '#0E1220' }}>
      <div className="absolute inset-0 sa-radar-grid opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto" style={{ background: 'rgba(79, 209, 165, 0.08)' }}>
            <GraduationCap size={22} style={{ color: '#4FD1A5' }} />
          </div>
          <h1 className="mt-4 text-[22px] font-bold tracking-tight" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            Counselor Portal
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: '#8890A8' }}>Sign in to manage your students</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4" style={{ background: '#161B2E', borderColor: '#262C42' }}>
          {isLocked ? (
            <div className="rounded-md px-3 py-2 text-[12px] font-medium" style={{ background: 'rgba(240, 98, 91, 0.08)', color: '#F0625B', border: '1px solid rgba(240, 98, 91, 0.15)' }}>
              Account locked. Try again in {remaining}s.
            </div>
          ) : error ? (
            <div className="rounded-md px-3 py-2 text-[12px] font-medium" style={{ background: 'rgba(240, 98, 91, 0.08)', color: '#F0625B', border: '1px solid rgba(240, 98, 91, 0.15)' }}>
              {error}
            </div>
          ) : null}
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required
              className="rounded-md border px-3 py-2 text-[13px] outline-none focus:border-[#E8A33D]/50"
              style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} placeholder="counselor@endow.global" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Password</span>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required
                className="w-full rounded-md border px-3 py-2 pr-9 text-[13px] outline-none focus:border-[#E8A33D]/50"
                style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8890A8' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>
          <button type="submit" disabled={loading || isLocked}
            className="w-full rounded-md py-2 text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#E8A33D', color: '#0E1220' }}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="text-center text-[11px]" style={{ color: '#8890A8' }}>
            <Link href="/login" className="underline-offset-2 hover:underline" style={{ color: '#E8A33D' }}>Back to student login</Link>
          </p>
        </form>
      </motion.div>
    </main>
  )
}
