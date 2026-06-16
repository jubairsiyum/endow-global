import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { FadeUp } from '@/components/home/FadeUp'

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#C41E3A] via-[#A01830] to-[#7A0713] py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur">
            <Sparkles size={16} />
            Start Today
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your future abroad
            <br />
            starts with one step
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Join 2,500+ students who found their perfect university match. Free consultation,
            zero hidden fees.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-white px-8 text-base font-bold text-[#C41E3A] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
            >
              Create Free Account
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/courses"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              Browse Courses
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/50">
            No credit card required · Free forever for students
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
