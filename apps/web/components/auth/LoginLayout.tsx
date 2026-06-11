'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SignInForm from './SignInForm'
import AuthBackground from './AuthBackground'

export default function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec] text-slate-950">
      <Navbar />

      <main className="relative isolate flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <AuthBackground />

        <div className="relative z-10 w-full max-w-lg">
          <SignInForm />
        </div>
      </main>

      <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />
      <Footer />
    </div>
  )
}
