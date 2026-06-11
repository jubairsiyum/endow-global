'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { User, Mail, LockKeyhole } from 'lucide-react'

import SocialButtons from './SocialButtons'
import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'

export default function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/dashboard',
      })

      if (error) {
        toast.error(error.message || 'Failed to create account')
        return
      }

      toast.success('Account created! Check your email to verify.')
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="text-left">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-700">
          Start your journey
        </p>

        <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
          Create your <span className="text-red-700">account</span>
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Build your profile and let our counselors help map your best-fit university options.
        </p>
      </div>

      <div className="mt-6 space-y-3.5">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Name
          </label>

          <div className="mt-1 flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <User className="text-slate-400" size={18} />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Email
          </label>

          <div className="mt-1 flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <Mail className="text-slate-400" size={18} />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Password
          </label>

          <div className="mt-1 flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <LockKeyhole className="text-slate-400" size={18} />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
            Confirm
          </label>

          <div className="mt-1 flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100/80">
            <LockKeyhole className="text-slate-400" size={18} />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={isLoading}
              className="h-full w-full bg-transparent px-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 text-sm leading-5 text-slate-600">
        <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-red-700" />

        <p>
          I agree to the <span className="font-bold text-red-700">Terms & Conditions</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)] disabled:pointer-events-none disabled:opacity-60"
      >
        {isLoading && <Spinner size={18} className="text-white" />}
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <div className="mt-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">or</span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialButtons />
    </form>
  )
}
