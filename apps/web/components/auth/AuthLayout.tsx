'use client'

import BackgroundDecor from './BackgroundDecor'
import LeftShowcase from './LeftShowcase'
import UnifiedAuthForm from './UnifiedAuthForm'
import { AuthProvider } from './AuthContext'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function AuthLayout({
  initialMode = 'signin',
}: {
  initialMode?: 'signin' | 'signup'
} = {}) {
  const pathname = usePathname()
  const currentMode = pathname?.startsWith('/register') ? 'signup' : initialMode

  return (
    <AuthProvider initialMode={currentMode}>
      <div className="min-h-screen overflow-x-clip bg-[#f7f2ec] text-slate-950">
        <Navbar />

        <main className="lg:pb-18 relative isolate flex w-full items-center justify-center px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:min-h-[calc(100svh-5rem)] lg:px-8 lg:pt-32">
          <BackgroundDecor />

          <div className="pointer-events-none absolute right-[-140px] top-[-220px] h-[520px] w-[520px] rounded-full bg-red-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-260px] left-[-180px] h-[500px] w-[500px] rounded-full bg-amber-200/35 blur-3xl" />

          <div className="relative z-10 grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.72fr)] lg:gap-12 xl:gap-16">
            <LeftShowcase mode={currentMode} />

            <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center lg:mx-0 lg:justify-self-end">
              <div className="bg-white/88 relative w-full overflow-hidden rounded-3xl border border-white/75 p-5 shadow-[0_28px_90px_rgba(62,35,24,0.16)] backdrop-blur-2xl sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.48),transparent)]" />

                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />

                <div className="relative z-10">
                  <UnifiedAuthForm />
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent" />

        <Footer />
      </div>
    </AuthProvider>
  )
}
