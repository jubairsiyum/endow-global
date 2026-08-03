'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { Eye, EyeOff, UserCog } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      const res = await authClient.signIn.email({ email, password, callbackURL: '/admin' })
      if (res.error) { setError(res.error.message || 'Invalid credentials'); return }
      router.push('/admin')
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto" style={{ background: 'rgba(232, 163, 61, 0.08)' }}>
            <UserCog size={22} style={{ color: '#E8A33D' }} />
          </div>
          <h1 className="mt-4 text-[22px] font-bold tracking-tight" style={{ color: '#E8EAF2', fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Portal
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: '#8890A8' }}>Sign in to manage platform resources</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4" style={{ background: '#161B2E', borderColor: '#262C42' }}>
          {error && (
            <div className="rounded-md px-3 py-2 text-[12px] font-medium" style={{ background: 'rgba(240, 98, 91, 0.08)', color: '#F0625B', border: '1px solid rgba(240, 98, 91, 0.15)' }}>
              {error}
            </div>
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium" style={{ color: '#8890A8' }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required
              className="rounded-md border px-3 py-2 text-[13px] outline-none focus:border-[#E8A33D]/50"
              style={{ background: '#0E1220', borderColor: '#262C42', color: '#E8EAF2' }} placeholder="admin@endow.global" />
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
          <button type="submit" disabled={loading}
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
