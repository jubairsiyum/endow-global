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

export default function ApplicationRoadmap() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf8f4] via-white to-[#fdf8f4] py-20 lg:py-28">
      {/* Background decor */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#C41E3A]/[0.04] blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-amber-100/40 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
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

        {/* Desktop: Winding Road */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Road SVG */}
            <svg
              className="absolute left-0 top-0 h-full w-full"
              viewBox="0 0 1200 420"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Road body */}
              <path
                d="M 60 210 C 200 210, 200 70, 340 70 C 480 70, 480 210, 620 210 C 760 210, 760 350, 900 350 C 1040 350, 1040 210, 1140 210"
                stroke="#e2d6cc"
                strokeWidth="40"
                strokeLinecap="round"
                fill="none"
              />
              {/* Center dashed line */}
              <path
                d="M 60 210 C 200 210, 200 70, 340 70 C 480 70, 480 210, 620 210 C 760 210, 760 350, 900 350 C 1040 350, 1040 210, 1140 210"
                stroke="#C41E3A"
                strokeWidth="2"
                strokeDasharray="10 8"
                strokeLinecap="round"
                fill="none"
                opacity="0.35"
              />
            </svg>

            {/* Step markers */}
            <div className="relative grid grid-cols-7 gap-2">
              {roadmapSteps.map((step, idx) => {
                const Icon = step.icon
                const isActive = activeStep === step.number
                const positions = [
                  'mt-32',
                  'mt-0',
                  'mt-32',
                  'mt-0',
                  'mt-32',
                  'mt-0',
                  'mt-32',
                ]

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    className={`relative flex flex-col items-center ${positions[idx]}`}
                    onMouseEnter={() => setActiveStep(step.number)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    {/* Connector */}
                    <div className={`h-8 w-px transition-colors duration-300 ${
                      isActive ? 'bg-[#C41E3A]' : 'bg-slate-200'
                    }`} />

                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`relative w-full cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                        isActive
                          ? 'border-[#C41E3A]/20 bg-white shadow-[0_8px_40px_rgba(196,30,58,0.1)]'
                          : 'border-slate-100 bg-white/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]'
                      }`}
                    >
                      {/* Number */}
                      <div className={`absolute -top-3 left-5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C41E3A] text-white shadow-[0_4px_12px_rgba(196,30,58,0.3)]'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-[#C41E3A]/10 text-[#C41E3A]'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        <Icon size={20} />
                      </div>

                      {/* Text */}
                      <h3 className={`mb-1 text-sm font-bold transition-colors duration-300 ${
                        isActive ? 'text-slate-950' : 'text-slate-700'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {step.description}
                      </p>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 border-t border-slate-100 pt-3">
                              <p className="text-xs leading-relaxed text-[#C41E3A]/70">
                                {step.detail}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Road */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical road */}
            <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#C41E3A]/20 via-[#C41E3A]/10 to-transparent" />
            <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-[repeating-linear-gradient(to_bottom,rgba(196,30,58,0.2)_0px,rgba(196,30,58,0.2)_6px,transparent_6px,transparent_12px)]" />

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
                    {/* Road marker */}
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-[#C41E3A] bg-[#C41E3A] shadow-[0_0_16px_rgba(196,30,58,0.25)]'
                          : 'border-slate-200 bg-white'
                      }`}>
                        <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 rounded-xl border p-4 transition-all duration-300 ${
                      isActive
                        ? 'border-[#C41E3A]/15 bg-white shadow-[0_4px_20px_rgba(196,30,58,0.08)]'
                        : 'border-slate-100 bg-white/60'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black ${isActive ? 'text-[#C41E3A]' : 'text-slate-300'}`}>
                          STEP {step.number}
                        </span>
                        <span className="text-[10px] text-slate-300">/ 7</span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-slate-800">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.description}</p>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-[#C41E3A]/70">
                              {step.detail}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
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
