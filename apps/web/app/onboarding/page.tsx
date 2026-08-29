import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import AuthBackground from '@/components/auth/AuthBackground'
import ProfileCompletion from '@/components/auth/ProfileCompletion'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f2ec] text-slate-950">
      <Navbar />

      <main className="relative isolate flex flex-1 flex-col items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <AuthBackground />

        <div className="relative z-10 w-full max-w-lg">
          <Suspense>
            <ProfileCompletion />
          </Suspense>
        </div>
      </main>

      <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />
      <Footer />
    </div>
  )
}
