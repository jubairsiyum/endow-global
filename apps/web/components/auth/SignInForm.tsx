'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, LockKeyhole } from 'lucide-react'

import SocialButtons from './SocialButtons'
import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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

      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col justify-center">
      <div className="text-left">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
          Student portal
        </p>

        <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Welcome back</h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Access your applications, documents, counselor messages, and next steps in one place.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Email
          </label>

          <div className="mt-1 flex h-[52px] min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <Mail className="text-slate-400" size={19} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Password
          </label>

          <div className="mt-1 flex h-[52px] min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <LockKeyhole className="text-slate-400" size={19} />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-red-700" />
          Remember me
        </label>

        <button type="button" className="text-sm font-bold text-red-700 hover:text-red-800">
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 flex h-[52px] min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
      >
        {isLoading && <Spinner size={18} className="text-white" />}
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">or</span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialButtons />
    </form>
  )
}
