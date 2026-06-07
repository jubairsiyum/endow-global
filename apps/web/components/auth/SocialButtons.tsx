'use client'

import Image from 'next/image'
import { authClient } from '@/lib/auth-client'

export default function SocialButtons() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    })
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_30px_rgba(15,23,42,0.09)]"
      >
        <Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
        Continue with Google
      </button>
    </div>
  )
}
