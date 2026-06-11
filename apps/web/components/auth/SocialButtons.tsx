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
        callbackURL: '/dashboard',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleSignIn}
        type="button"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_30px_rgba(15,23,42,0.09)] disabled:pointer-events-none disabled:opacity-60"
      >
        {isLoading ? (
          <Spinner size={18} className="text-slate-600" />
        ) : (
          <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
        )}
        {isLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>
    </div>
  )
}
