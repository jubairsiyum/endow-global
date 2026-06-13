'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Search,
  FileText,
  Send,
  Video,
  Shield,
  Plane,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const roadmapSteps = [
  {
    number: 1,
    title: 'Consultation',
    description: 'Discuss your academic goals with our experienced counselors.',
    detail: 'Free 30-minute session to understand your aspirations, background, and timeline.',
    icon: MessageSquare,
  },
  {
    number: 2,
    title: 'University Matching',
    description: 'Get personalized university recommendations powered by AI.',
    detail: 'Our algorithm analyzes your profile against 500+ universities worldwide.',
    icon: Search,
  },
  {
    number: 3,
    title: 'Document Prep',
    description: 'Prepare all required documents with expert guidance.',
    detail: 'SOPs, LORs, transcripts, and financial documents — we review every page.',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Application',
    description: 'Submit complete applications to your selected universities.',
    detail: 'We ensure every application is polished and submitted before deadlines.',
    icon: Send,
  },
  {
    number: 5,
    title: 'Interview',
    description: 'Prepare and ace your university interviews with mock sessions.',
    detail: 'One-on-one coaching with feedback from former admissions officers.',
    icon: Video,
  },
  {
    number: 6,
    title: 'Visa Processing',
    description: 'Navigate the visa application process with full support.',
    detail: 'Document checklist, mock visa interviews, and embassy coordination.',
    icon: Shield,
  },
  {
    number: 7,
    title: 'Departure',
    description: 'Final preparations and welcome to your new chapter abroad.',
    detail: 'Pre-departure briefing, accommodation help, and airport pickup coordination.',
    icon: Plane,
  },
]

/*
  Road SVG viewBox: 1000 x 340
  Path: M 20 170 C 120 170, 150 40, 280 40 C 410 40, 410 170, 520 170
        C 630 170, 660 300, 790 300 C 920 300, 920 170, 980 170

  Balls placed at points that lie on this curve.
  left% = svgX / 10,  top% = svgY / 3.4
*/
const steps = [
  { svgX: 80,  svgY: 155, side: 'above' as const },
  { svgX: 210, svgY: 42,  side: 'below' as const },
  { svgX: 380, svgY: 95,  side: 'above' as const },
  { svgX: 520, svgY: 170, side: 'below' as const },
  { svgX: 650, svgY: 245, side: 'above' as const },
  { svgX: 800, svgY: 298, side: 'below' as const },
  { svgX: 930, svgY: 205, side: 'above' as const },
]

const floatingDots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 5 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 10,
  delay: Math.random() * 5,
}))

function StepNode({
  step,
  data,
  isActive,
  onToggle,
}: {
  step: (typeof roadmapSteps)[number]
  data: (typeof steps)[number]
  isActive: boolean
  onToggle: () => void
}) {
  const Icon = step.icon
  const isAbove = data.side === 'above'
  const ballLeft = (data.svgX / 1000) * 100
  const ballTop = (data.svgY / 340) * 100
  const stemLength = 80

  return (
    <div
      className="absolute"
      style={{
        left: `${ballLeft}%`,
        top: `${ballTop}%`,
      }}
    >
      {/* Everything anchored from this point via transform */}
      <div className="relative" style={{ width: 0, height: 0 }}>
        {/* Ball on the road — centered on this point */}
        <motion.div
          animate={isActive ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }}
          className="absolute"
          style={{
            left: -7,
            top: -7,
            width: 14,
            height: 14,
          }}
        >
          <div
            className={`h-full w-full rounded-full border-[2.5px] shadow-md transition-all duration-300 ${
              isActive
                ? 'border-[#C41E3A] bg-[#C41E3A] shadow-[0_0_12px_rgba(196,30,58,0.4)]'
                : 'border-[#C41E3A]/50 bg-white'
            }`}
          />
        </motion.div>

        {/* Stem line — extends up or down from ball center */}
        <div
          className="absolute left-0"
          style={{
            [isAbove ? 'bottom' : 'top']: 7,
            width: 2,
            height: stemLength,
            background: isActive
              ? 'linear-gradient(' + (isAbove ? 'to top' : 'to bottom') + ', rgba(196,30,58,0.5), rgba(196,30,58,0.1))'
              : 'linear-gradient(' + (isAbove ? 'to top' : 'to bottom') + ', rgba(203,213,225,0.7), rgba(203,213,225,0.15))',
            borderRadius: 1,
          }}
        />

        {/* Bubble card — at the end of the stem */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={onToggle}
          className="group absolute cursor-pointer"
          style={{
            left: -75,
            width: 150,
            [isAbove ? 'bottom' : 'top']: 7 + stemLength,
          }}
        >
          {/* Step number badge */}
          <div
            className={`absolute left-1/2 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full text-[9px] font-black transition-all duration-300 ${
              isActive
                ? 'bg-[#C41E3A] text-white shadow-[0_2px_8px_rgba(196,30,58,0.3)]'
                : 'bg-slate-100 text-slate-400'
            }`}
            style={{ [isAbove ? 'bottom' : 'top']: -10 }}
          >
            {step.number}
          </div>

          <div
            className={`rounded-2xl border-2 px-3 py-2.5 transition-all duration-300 ${
              isActive
                ? 'border-[#C41E3A]/30 bg-white shadow-[0_8px_40px_rgba(196,30,58,0.12)]'
                : 'border-slate-100 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.05)] group-hover:border-[#C41E3A]/15 group-hover:shadow-[0_6px_28px_rgba(196,30,58,0.08)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-[#C41E3A]/5 group-hover:text-[#C41E3A]/60'
                }`}
              >
                <Icon size={15} />
              </div>
              <h3
                className={`text-xs font-bold leading-tight transition-colors duration-300 ${
                  isActive ? 'text-slate-950' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {step.title}
              </h3>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#C41E3A]/70">
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ApplicationRoadmap() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf8f4] via-white to-[#fdf8f4] py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#C41E3A]/[0.04] blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-[80px]" />
        {floatingDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-[#C41E3A]/[0.06]"
            style={{ width: dot.size, height: dot.size, left: `${dot.x}%`, top: `${dot.y}%` }}
            animate={{ y: [-8, 8, -8], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#C41E3A 1px, transparent 1px), linear-gradient(90deg, #C41E3A 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/10 bg-[#C41E3A]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#C41E3A]">
            <Sparkles size={14} />
            Your Journey
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.05] tracking-tight text-slate-950">
            Application{' '}
            <span className="text-[#C41E3A]">Roadmap</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            Seven clear steps from consultation to departure. We guide you through every milestone.
          </p>
        </motion.div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="relative mx-auto" style={{ maxWidth: 1100, height: 480 }}>
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 340"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 20 170 C 120 170, 150 40, 280 40 C 410 40, 410 170, 520 170 C 630 170, 660 300, 790 300 C 920 300, 920 170, 980 170"
                stroke="#e4d9ce"
                strokeWidth="28"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 20 170 C 120 170, 150 40, 280 40 C 410 40, 410 170, 520 170 C 630 170, 660 300, 790 300 C 920 300, 920 170, 980 170"
                stroke="#C41E3A"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                fill="none"
                opacity="0.25"
              />
            </svg>

            {roadmapSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: steps[idx].side === 'above' ? -20 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
              >
                <StepNode
                  step={step}
                  data={steps[idx]}
                  isActive={activeStep === step.number}
                  onToggle={() => setActiveStep(activeStep === step.number ? null : step.number)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C41E3A]/20 via-[#C41E3A]/10 to-transparent" />
            <div className="space-y-3">
              {roadmapSteps.map((step, idx) => {
                const Icon = step.icon
                const isActive = activeStep === step.number
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    viewport={{ once: true }}
                    className="relative flex gap-4"
                    onClick={() => setActiveStep(isActive ? null : step.number)}
                  >
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-[#C41E3A] bg-[#C41E3A] shadow-[0_0_16px_rgba(196,30,58,0.25)]'
                          : 'border-slate-200 bg-white'
                      }`}>
                        <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <div className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
                        isActive
                          ? 'border-[#C41E3A]/20 bg-white shadow-[0_4px_24px_rgba(196,30,58,0.1)]'
                          : 'border-slate-100 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                            isActive ? 'bg-[#C41E3A]/10 text-[#C41E3A]' : 'bg-slate-50 text-slate-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <span className={`text-[10px] font-black ${isActive ? 'text-[#C41E3A]' : 'text-slate-300'}`}>
                              STEP {step.number}
                            </span>
                            <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                          </div>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
                                {step.description}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-[#C41E3A]/70">
                                {step.detail}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white px-8 py-6 shadow-[0_4px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:gap-6">
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">Ready to start your journey?</p>
              <p className="text-xs text-slate-400">Average timeline: 3–4 months to departure</p>
            </div>
            <a
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#C41E3A] to-red-600 px-5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(196,30,58,0.2)] transition-all hover:shadow-[0_6px_24px_rgba(196,30,58,0.3)]"
            >
              Get Started
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
