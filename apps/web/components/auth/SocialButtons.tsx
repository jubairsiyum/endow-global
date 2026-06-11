'use client'

import Image from 'next/image'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import Spinner from '@/components/ui/Spinner'

export default function SocialButtons() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/onboarding',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      disabled={isLoading}
      className="flex h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60"
    >
      {isLoading ? (
        <Spinner size={16} className="text-slate-600" />
      ) : (
        <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
      )}
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  )
}
