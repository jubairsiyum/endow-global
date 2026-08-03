'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, LockKeyhole, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

import SocialButtons from './SocialButtons'
import Spinner from '@/components/ui/Spinner'
import { authClient } from '@/lib/auth-client'

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
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
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
                  className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
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
        </div>
      </div>
    </div>
  )
}
