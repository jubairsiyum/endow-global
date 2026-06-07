'use client'

import SocialButtons from './SocialButtons'
import AuthTabToggle from './AuthTabToggle'

import { Mail, LockKeyhole } from 'lucide-react'

export default function SignInForm() {
  return (
    <div className="flex h-full flex-col justify-center">
      <AuthTabToggle />

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
              placeholder="Enter your email"
              className="h-full w-full bg-transparent px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
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
              placeholder="Enter your password"
              className="h-full w-full bg-transparent px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
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
        type="button"
        className="mt-5 flex h-[52px] min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-slate-950 via-red-950 to-red-800 text-sm font-black tracking-wide text-white shadow-[0_18px_36px_rgba(127,29,29,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.30)]"
      >
        Sign In
      </button>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">or</span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <SocialButtons />
    </div>
  )
}
