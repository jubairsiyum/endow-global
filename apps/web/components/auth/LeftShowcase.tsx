'use client'

import { motion } from 'framer-motion'

import { Globe, MessageCircleMore, BadgeCheck, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

const showcaseCopy = {
  signin: {
    eyebrow: 'Student portal',
    title: 'Pick up your study plan exactly where you left it.',
    description:
      'Sign in to manage applications, documents, counselor sessions, and university shortlists from one polished workspace.',
    trust: 'Your applications, sessions, and next steps stay organized in one place.',
  },
  signup: {
    eyebrow: 'Start your journey',
    title: 'Build your global education profile with expert guidance.',
    description:
      'Register to create your profile, compare suitable universities, and get support from counselors who know the application path.',
    trust: 'Trusted guidance for applications across leading study destinations.',
  },
} as const

export default function LeftShowcase({ mode }: { mode: 'signin' | 'signup' }) {
  const copy = showcaseCopy[mode]

  return (
    <div className="relative hidden w-[55%] flex-col justify-center px-4 lg:flex">
      {/* Logo */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="inline-flex w-fit items-center gap-3 rounded-full border border-white/60 bg-white/55 px-4 py-2 shadow-[0_14px_40px_rgba(127,29,29,0.08)] backdrop-blur-xl"
      >

      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.2,
        }}
        className="mt-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/65 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-red-800 shadow-sm backdrop-blur">
          <Sparkles size={14} />
          {copy.eyebrow}
        </div>

        <h2 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950">
          {copy.title}
        </h2>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.4,
        }}
        className="mt-5 max-w-lg text-lg leading-8 text-slate-700"
      >
        {copy.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.6,
        }}
        className="mt-8 grid max-w-xl grid-cols-3 gap-3"
      >
        <Feature icon={<Globe size={18} />} title="Global" subtitle="Opportunities" />

        <Feature icon={<MessageCircleMore size={18} />} title="Expert" subtitle="Counselors" />

        <Feature icon={<BadgeCheck size={18} />} title="End-to-End" subtitle="Support" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.75,
        }}
        className="mt-8 flex w-fit items-center gap-3 rounded-3xl border border-white/65 bg-white/55 p-3 pr-5 shadow-[0_18px_48px_rgba(62,35,24,0.10)] backdrop-blur-xl"
      >
        <div className="flex -space-x-3">
          {['UK', 'AU', 'CA'].map((label) => (
            <div
              key={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[10px] font-black text-white"
            >
              {label}
            </div>
          ))}
        </div>
        <p className="max-w-[230px] text-sm font-semibold leading-5 text-slate-700">{copy.trust}</p>
      </motion.div>
    </div>
  )
}

function Feature({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className="flex flex-col items-center"
    >
      <div className="bg-white/72 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/70 text-red-700 shadow-[0_14px_34px_rgba(62,35,24,0.10)] backdrop-blur-xl">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>

      <p className="text-center text-xs font-medium text-slate-500">{subtitle}</p>
    </motion.div>
  )
}
