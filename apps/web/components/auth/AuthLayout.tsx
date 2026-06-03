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
  const currentMode = pathname?.includes('/sign-up') ? 'signup' : initialMode

  return (
    <AuthProvider initialMode={currentMode}>
      <div className="min-h-screen bg-[#f7f2ec]">
        <Navbar />

        <main className="relative flex w-full items-center justify-center overflow-x-hidden bg-[#f7f2ec] px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-16 lg:pt-32">
          {/* Background - Full Viewport Coverage */}
          <BackgroundDecor />

          {/* Blur Glow - Top Right */}
          <div className="pointer-events-none absolute right-[-140px] top-[-220px] h-[520px] w-[520px] rounded-full bg-red-200/45 blur-3xl" />

          {/* Blur Glow - Bottom Left */}
          <div className="pointer-events-none absolute bottom-[-260px] left-[-180px] h-[500px] w-[500px] rounded-full bg-amber-200/35 blur-3xl" />

          <div className="relative z-10 flex min-h-[calc(100vh-14rem)] w-full max-w-7xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
            <LeftShowcase />

            <div className="relative flex w-full items-center justify-center lg:w-[45%]">
              <div className="bg-white/88 relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_28px_90px_rgba(62,35,24,0.16)] backdrop-blur-2xl sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.48),transparent)]" />

                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />

                <div className="relative z-10">
                  <UnifiedAuthForm />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  )
}
