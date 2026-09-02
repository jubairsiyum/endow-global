import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PremiumCTA() {
  return (
    <section
      className="relative overflow-hidden py-28 text-center text-white lg:py-40"
      style={{ background: '#0A090B' }}
    >
      {/* Subtle architectural line texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 88px)' }}
      />
      {/* Restrained deep burgundy glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#C41E3A]/[0.12] blur-[120px]" />

      <div className="relative mx-auto max-w-[900px] px-6 sm:px-8">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E05266]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#E05266] sm:text-xs">
            Start today
          </span>
          <span className="h-px w-8 bg-[#E05266]" />
        </div>

        <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
          Your future abroad
          <br />
          <span style={{ color: '#E05266' }}>starts with one step.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Join thousands of students who have already started their journey to study abroad.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#0A090B] transition-all hover:-translate-y-0.5 hover:bg-gray-100 sm:w-auto"
          >
            Create free account
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Book a consultation
          </Link>
        </div>

        {/* Trust line */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/10 pt-8">
          <span className="font-mono text-[13px] text-white/50">
            <span className="font-semibold text-white">2,000+</span> students guided
          </span>
          <span className="h-1 w-1 rounded-full bg-[#E05266]" />
          <span className="font-mono text-[13px] text-white/50">
            <span className="font-semibold text-white">98%</span> visa success
          </span>
          <span className="h-1 w-1 rounded-full bg-[#E05266]" />
          <span className="font-mono text-[13px] text-white/50">Free initial consultation</span>
        </div>
      </div>
    </section>
  )
}
