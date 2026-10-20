'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, Compass, Star } from 'lucide-react'
import Link from 'next/link'

export default function PremiumCTA() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12 text-white sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20">
      {/* ============================================================ */}
      {/* BACKGROUND: Top 30% White BG + Bottom 70% Dark Red Fluted Glass */}
      {/* ============================================================ */}

      {/* 1. Top White Background (positions top ~30% of the foreground card in white) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-white dark:bg-[#09090b] sm:h-[30%] lg:h-[32%]"
        aria-hidden="true"
      />

      {/* 2. Bottom Dark Red Fluted Glass Background (starts at ~30%) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] overflow-hidden bg-[#070608] sm:top-[30%] lg:top-[32%]"
        aria-hidden="true"
      >
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#070608]" />

        {/* Red Radiant Wave & Aura (Undulating light wave behind fluted glass) */}
        <div className="absolute inset-0 select-none overflow-hidden">
          {/* Left low wave crest */}
          <div
            className="absolute -left-16 bottom-0 h-[420px] w-[540px] rounded-full opacity-80 blur-[85px]"
            style={{
              background:
                'radial-gradient(ellipse at center, #FF1744 0%, #C41E3A 38%, #7A0713 70%, transparent 85%)',
            }}
          />

          {/* Center-right rising wave crest (creates the undulating aurora curve) */}
          <div
            className="absolute left-[30%] top-6 h-[480px] w-[700px] rounded-full opacity-75 blur-[95px]"
            style={{
              background:
                'radial-gradient(ellipse at center, #FF2E54 0%, #C41E3A 35%, #5C0510 68%, transparent 82%)',
            }}
          />

          {/* Far-right radiant crest */}
          <div
            className="absolute -right-20 top-0 h-[500px] w-[560px] rounded-full opacity-85 blur-[90px]"
            style={{
              background:
                'radial-gradient(ellipse at center, #E11D48 0%, #9F050F 42%, #3B0208 72%, transparent 85%)',
            }}
          />

          {/* Hot specular cores for vibrant light transmission */}
          <div
            className="absolute bottom-12 left-[20%] h-36 w-72 rounded-full opacity-65 blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, #FFE4E8 0%, #FF4D6D 45%, transparent 75%)',
            }}
          />
          <div
            className="absolute right-[22%] top-12 h-40 w-80 rounded-full opacity-65 blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, #FFE4E8 0%, #FF2E54 45%, transparent 75%)',
            }}
          />
        </div>

        {/* 3. Thicker Vertical Fluted Glass Grating (26px well-defined ribbed columns) */}
        <div
          className="absolute inset-0 select-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.95) 0px,
              rgba(0, 0, 0, 0.4) 4px,
              rgba(40, 40, 50, 0.22) 9px,
              rgba(255, 255, 255, 0.86) 13px,
              rgba(40, 40, 50, 0.22) 17px,
              rgba(0, 0, 0, 0.4) 22px,
              rgba(0, 0, 0, 0.95) 26px
            )`,
            mixBlendMode: 'overlay',
            opacity: 0.92,
          }}
        />

        {/* 4. Fine Glass Glint Diffraction Layer (specular reflection line per rod) */}
        <div
          className="absolute inset-0 select-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 12px,
              rgba(255, 255, 255, 0.35) 13px,
              transparent 14px,
              transparent 26px
            )`,
            mixBlendMode: 'screen',
            opacity: 0.5,
          }}
        />

        {/* 5. Luxury Dark Vignette */}
        <div
          className="absolute inset-0 select-none"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 50% 50%, transparent 25%, rgba(7, 6, 8, 0.5) 65%, #070608 100%),
              linear-gradient(to bottom, #070608 0%, transparent 12%, transparent 85%, #070608 100%),
              linear-gradient(to right, #070608 0%, transparent 10%, transparent 90%, #070608 100%)
            `,
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* FOREGROUND: Frosted Glassmorph Card Container                */}
      {/* ============================================================ */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-full overflow-hidden rounded-[28px] border border-white/[0.16] bg-[#0c0a0e] px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_40px_rgba(196,30,58,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_32px_rgba(255,255,255,0.02)] backdrop-blur-2xl sm:rounded-[34px] sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          {/* Subtle top edge specular reflection line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            aria-hidden="true"
          />

          {/* Internal soft ruby ambient glow */}
          <div
            className="pointer-events-none absolute -bottom-16 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-[#C41E3A]/40 blur-3xl"
            aria-hidden="true"
          />

          {/* 2. TWO-LINE HEADLINE */}
          <h2 className="mt-7 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[46px] lg:leading-[1.12]">
            Your Future Abroad
            <span className="mt-1 block bg-gradient-to-r from-white via-white/95 to-white/75 bg-clip-text text-transparent">
              Study with Confidence
            </span>
          </h2>

          {/* 3. PARAGRAPH */}
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-[17px] sm:leading-7">
            Join thousands of ambitious students securing admissions and scholarships at world-class
            universities with end-to-end guidance.
          </p>

          {/* 4. BUTTONS ROW */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3.5">
            <Link
              href="/courses"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-zinc-950 shadow-[0_4px_20px_rgba(255,255,255,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100 hover:shadow-[0_8px_28px_rgba(255,255,255,0.28)] active:translate-y-0 sm:w-auto sm:text-[15px]"
            >
              <Compass
                size={17}
                className="text-zinc-900 transition-transform duration-200 group-hover:rotate-45"
              />
              Explore Courses
            </Link>

            <Link
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-[14px] font-medium text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12] active:translate-y-0 sm:w-auto sm:text-[15px]"
            >
              <CalendarCheck
                size={17}
                className="text-zinc-300 transition-transform duration-200 group-hover:scale-110"
              />
              Book Consultation
            </Link>
          </div>

          {/* 5. RATING / SOCIAL PROOF PILL */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-black/45 px-4 py-1.5 text-xs text-zinc-300 shadow-inner backdrop-blur-md sm:text-[13px]">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-white">4.9</span>
              <span className="text-zinc-500">→</span>
              <span className="text-zinc-300">From 2600+ Reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
