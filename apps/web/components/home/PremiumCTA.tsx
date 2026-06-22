import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { FadeUp } from '@/components/home/FadeUp'

export default function PremiumCTA() {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-20 lg:py-28">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C41E3A]/20 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
            <Sparkles size={15} />
            Start Today
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Your future abroad
            <br />
            starts with one step
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Join thousands of students who found their perfect university match in South Korea and Australia. Free consultation, zero hidden fees.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 text-[15px] font-bold text-gray-950 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              Create Free Account
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/courses" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-7 text-[15px] font-semibold text-white/80 transition-all duration-300 hover:border-white/25 hover:bg-white/5 hover:text-white">
              Browse Courses
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/30">No credit card required · Free forever for students</p>
        </FadeUp>
      </div>
    </section>
  )
}
