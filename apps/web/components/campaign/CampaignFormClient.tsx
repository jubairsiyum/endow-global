'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { trpc } from '@/lib/trpc-client'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Send,
  ExternalLink,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'

// Available Degree Programs
const PROGRAM_OPTIONS = [
  { id: 'bachelors', label: "Bachelor's Degree", sub: 'Undergraduate study (3-4 years)', icon: '🎓' },
  { id: 'masters', label: "Master's Degree", sub: 'Postgraduate study (1-2 years)', icon: '🏛️' },
  { id: 'phd', label: 'PhD / Doctorate', sub: 'Research-focused doctoral study', icon: '🔬' },
  { id: 'diploma', label: 'Diploma / Certificate', sub: 'Short-term or vocational courses', icon: '📜' },
  { id: 'language', label: 'Language Course', sub: 'Korean, English or foundation track', icon: '🗣️' },
  { id: 'other', label: 'Other Program', sub: 'Custom or dual-degree path', icon: '✨' },
]

// Available Country Destinations with flag on left & Short Name
const COUNTRY_OPTIONS = [
  { name: 'South Korea', shortName: 'South Korea', flag: '🇰🇷' },
  { name: 'United States', shortName: 'USA', flag: '🇺🇸' },
  { name: 'United Kingdom', shortName: 'UK', flag: '🇬🇧' },
  { name: 'Canada', shortName: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', shortName: 'Australia', flag: '🇦🇺' },
  { name: 'Germany', shortName: 'Germany', flag: '🇩🇪' },
  { name: 'Japan', shortName: 'Japan', flag: '🇯🇵' },
  { name: 'Malaysia', shortName: 'Malaysia', flag: '🇲🇾' },
  { name: 'Other', shortName: 'Other', flag: '🌍' },
]

// Intake Years - current academic years starting from current (2026) and upcoming
const INTAKE_OPTIONS = [
  { year: '2026', desc: 'Fall / Winter 2026 (Immediate Intake)' },
  { year: '2027', desc: 'Spring or Fall 2027 (Upcoming Regular Intake)' },
  { year: '2028', desc: 'Spring or Fall 2028' },
  { year: '2029 or Later', desc: 'Long-term future planning' },
  { year: 'Not Sure Yet', desc: 'Flexible / Seeking counselor recommendation' },
]

// Reason Prompt Suggestions
const REASON_PROMPTS = [
  'Full/Partial Scholarship seeker',
  'Career growth in tech/engineering',
  'Post-study work visa opportunities',
  'English-medium curriculum preferred',
  'Top ranking university target',
]

const STORAGE_KEY = 'endow_campaign_lead_id'

/**
 * Normalizes phone numbers (especially Bangladesh numbers) so:
 * +8801891787808, 8801891787808, +881891787808, 01891787808, 1891787808
 * all normalize to the canonical 11-digit representation: "01891787808".
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return ''
  let digits = rawPhone.replace(/\D/g, '')

  // 1) Starts with Bangladesh country code 880 (e.g. 8801891787808 -> 13 digits)
  if (digits.startsWith('880')) {
    digits = digits.slice(2) // removes '88', keeps '01891787808' (11 digits)
  }
  // 2) Starts with 88 followed directly by 1 (e.g. 881891787808 -> 12 digits)
  else if (digits.startsWith('88') && digits.length === 12 && digits.charAt(2) === '1') {
    digits = '0' + digits.slice(2) // '01891787808'
  }

  // 3) Entered without leading zero (10 digits starting with 1, e.g. 1891787808)
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits // becomes '01891787808' (11 digits)
  }

  return digits
}

export default function CampaignFormClient() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 forward, -1 backward
  const [leadId, setLeadId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interestedProgram, setInterestedProgram] = useState('')
  const [customProgram, setCustomProgram] = useState('')
  const [interestedCountry, setInterestedCountry] = useState('')
  const [customCountry, setCustomCountry] = useState('')
  const [intakeYear, setIntakeYear] = useState('')
  const [reason, setReason] = useState('')

  // Validation & UI states
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)

  // UTM Parameters
  const [utm, setUtm] = useState({
    source: 'qr-campaign',
    medium: '',
    campaign: '',
  })

  // Autofocus ref for text fields
  const inputRef = useRef<HTMLInputElement>(null)
  const utils = trpc.useUtils()

  // tRPC Mutation for progressive saving
  const saveStepMutation = trpc.campaign.saveStep.useMutation({
    onSuccess: (data) => {
      if (data?.leadId && !leadId) {
        setLeadId(data.leadId)
        try {
          localStorage.setItem(STORAGE_KEY, data.leadId)
        } catch {}
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setLastSavedTime(timeStr)
    },
    onError: (err) => {
      console.warn('Autosave notice:', err.message)
    },
  })

  // Initialize UTM and ensure clean fresh session
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search)
      setUtm({
        source: searchParams.get('utm_source') || 'qr-campaign',
        medium: searchParams.get('utm_medium') || '',
        campaign: searchParams.get('utm_campaign') || '',
      })

      // Clean up previous test ids from localStorage
      localStorage.removeItem(STORAGE_KEY)
      setLeadId(null)
    } catch {}
    setIsInitialized(true)
  }, [])

  // Auto-focus input on step change
  useEffect(() => {
    if (step <= 2) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [step])

  // Clear error when user changes inputs
  useEffect(() => {
    if (errorMsg) setErrorMsg(null)
  }, [name, email, phone, interestedProgram, interestedCountry, intakeYear, reason])

  // Get active values (resolving custom fields)
  const activeProgram = interestedProgram === 'other' ? customProgram : interestedProgram
  const activeCountry = interestedCountry === 'Other' ? customCountry : interestedCountry

  // Progressive save helper
  const triggerSave = async (targetStep: number, customPayload: Record<string, any> = {}) => {
    try {
      const payload: any = {
        leadId: leadId || undefined,
        step: targetStep,
        utmSource: utm.source,
        utmMedium: utm.medium || undefined,
        utmCampaign: utm.campaign || undefined,
        ...customPayload,
      }
      return await saveStepMutation.mutateAsync(payload)
    } catch (e: any) {
      console.error('Save failed:', e)
      const rawMsg = String(e?.message || '')
      if (
        rawMsg.toLowerCase().includes('already submitted') ||
        rawMsg.toLowerCase().includes('conflict') ||
        rawMsg.toLowerCase().includes('phone')
      ) {
        setErrorMsg('This phone is already submitted.')
      } else {
        setErrorMsg(rawMsg || 'Failed to save information. Please try again.')
      }
      return null
    }
  }

  // Next Step Action with Validation and Progressive Save
  const handleNext = async () => {
    setErrorMsg(null)

    if (step === 1) {
      if (!name || name.trim().length < 2) {
        setErrorMsg('Please enter your full name (at least 2 letters)')
        return
      }
      // Progressive save Step 1
      const res = await triggerSave(1, { name: name.trim() })
      if (!res) return
      setDirection(1)
      setStep(2)
      return
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid email address')
        return
      }
      if (!phone || phone.trim().length < 6) {
        setErrorMsg('Please enter your phone number')
        return
      }

      // Check Bangladesh phone validity (11 digits starting with 01)
      const normalized = normalizePhoneNumber(phone.trim())
      if (normalized.startsWith('01')) {
        if (normalized.length !== 11) {
          setErrorMsg('Please enter a valid 11-digit Bangladesh phone number (e.g. 01891787808 or +8801891787808)')
          return
        }
      } else if (normalized.length < 7) {
        setErrorMsg('Please enter a valid phone number with at least 7 digits')
        return
      }

      // Real-time pre-check phone duplicate
      try {
        const checkRes = await utils.campaign.checkPhone.fetch({
          phone: phone.trim(),
          leadId: leadId || undefined,
        })
        if (checkRes?.isDuplicate) {
          setErrorMsg('This phone is already submitted.')
          return
        }
      } catch (checkErr: any) {
        const checkMsg = String(checkErr?.message || '')
        if (checkMsg.toLowerCase().includes('already submitted') || checkMsg.toLowerCase().includes('conflict')) {
          setErrorMsg('This phone is already submitted.')
          return
        }
      }

      // Progressive save Step 2 (includes authoritative duplicate check on backend)
      const res = await triggerSave(2, { email: email.trim(), phone: phone.trim() })
      if (!res) {
        // Backend rejected (e.g. duplicate phone number)
        return
      }
      setDirection(1)
      setStep(3)
      return
    }

    if (step === 3) {
      if (!activeProgram || activeProgram.trim() === '') {
        setErrorMsg('Please select your interested program or specify one')
        return
      }
      // Progressive save Step 3
      const res = await triggerSave(3, { interestedProgram: activeProgram })
      if (!res) return
      setDirection(1)
      setStep(4)
      return
    }

    if (step === 4) {
      if (!activeCountry || activeCountry.trim() === '') {
        setErrorMsg('Please select your preferred study country')
        return
      }
      // Progressive save Step 4
      const res = await triggerSave(4, { interestedCountry: activeCountry })
      if (!res) return
      setDirection(1)
      setStep(5)
      return
    }

    if (step === 5) {
      if (!intakeYear || intakeYear.trim() === '') {
        setErrorMsg('Please select your preferred intake year')
        return
      }
      // Progressive save Step 5
      const res = await triggerSave(5, { intakeYear: intakeYear.trim() })
      if (!res) return
      setDirection(1)
      setStep(6)
      return
    }

    if (step === 6) {
      // Final submission (step 6 complete)
      const res = await triggerSave(6, { reason: reason.trim() })
      if (!res) return
      setDirection(1)
      setStep(7) // Success page
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
    }
  }

  const handlePrev = () => {
    if (step > 1 && step <= 6) {
      setErrorMsg(null)
      setDirection(-1)
      setStep((prev) => prev - 1)
    }
  }

  // Keypress Enter handler to advance form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < 6) {
      e.preventDefault()
      handleNext()
    }
  }

  // Animation variants
  const slideVariants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? 35 : -35,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -35 : 35,
      opacity: 0,
      transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const progressPercent = Math.min(100, Math.round(((step - 1) / 5) * 100))

  return (
    <div className="relative min-h-screen bg-[#F5F6F9] text-gray-900 flex flex-col justify-between selection:bg-[#AD0819] selection:text-white overflow-hidden font-body">
      {/* ── Exact Homepage Hero Section Background ── */}
      <Image
        src="/images/signin-bg.png"
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-25"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fdf8f4]/95 via-[#f5f6f9]/88 to-[#f5f6f9]/72" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #101B3D 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Header with Exact Navbar Logo & Green 1-min Badge */}
      <header className="relative z-10 w-full max-w-3xl mx-auto px-5 pt-6 pb-2 flex items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Endow Global Education home">
          <Image
            src="/logo/EndowFullLogo2.svg"
            alt="Endow Global Education"
            width={160}
            height={50}
            className="h-10 sm:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* 1-Minute Badge - GREEN */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-xs font-semibold shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Takes only 1 min</span>
        </div>
      </header>

      {/* Main Multi-step Form Container */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {step <= 6 && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-gray-900">
              Fill this form — it will take 1 min only!
            </h1>
            <p className="mt-1.5 text-sm text-gray-600 max-w-md mx-auto">
              Tell us your study abroad goals so our expert advisors can guide your scholarships & admissions.
            </p>

            {/* Visual Step Progress Bar */}
            <div className="mt-5 w-full bg-gray-200/80 rounded-full h-2 overflow-hidden border border-gray-200 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#AD0819] via-[#C41E3A] to-[#E8A33D] rounded-full transition-all duration-300 shadow-sm"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2 px-1 font-mono">
              <span>Step {step} of 6</span>
              <span>{progressPercent}% Complete</span>
            </div>
          </div>
        )}

        {/* Form Card Box (Light mode with refined soft glass shadow) */}
        <div className="relative rounded-3xl bg-white/95 border border-gray-200/90 shadow-[0_16px_40px_rgba(16,27,61,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-9 backdrop-blur-xl transition-all">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: Full Name */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 1 • Identity
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    Enter your full name
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    What should our counselors call you?
                  </p>
                </div>

                <div>
                  <label htmlFor="lead-name" className="sr-only">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      id="lead-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-[#AD0819] rounded-2xl px-5 py-4 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#AD0819]/10 shadow-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#AD0819]" />
                    Data is autosaved immediately as you proceed.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Email & Phone */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 2 • Contact Information
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    How can we reach you?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    We will share scholarship notices & connect with you for a free consultation.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#AD0819]" /> Email Address
                    </label>
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-[#AD0819] rounded-2xl px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#AD0819]/10 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#AD0819]" /> Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={async () => {
                        const trimmed = phone.trim()
                        if (trimmed.length >= 10) {
                          try {
                            const checkRes = await utils.campaign.checkPhone.fetch({
                              phone: trimmed,
                              leadId: leadId || undefined,
                            })
                            if (checkRes?.isDuplicate) {
                              setErrorMsg('This phone is already submitted.')
                            }
                          } catch {}
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 01891787808 or +880 1891-787808"
                      className="w-full bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-[#AD0819] rounded-2xl px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#AD0819]/10 shadow-sm font-mono"
                    />
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Enter your 11-digit mobile number with or without +88. Each phone number can only be registered once.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Interested Program */}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 3 • Academic Program
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    Select your interested program
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the degree or qualification level you are pursuing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {PROGRAM_OPTIONS.map((item) => {
                    const isSelected = interestedProgram === item.id || interestedProgram === item.label
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setInterestedProgram(item.label)
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? 'bg-red-50/80 border-[#AD0819] text-gray-950 shadow-md ring-2 ring-[#AD0819]/25'
                            : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/70 text-gray-800 shadow-sm'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{item.sub}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {interestedProgram === 'Other Program' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={customProgram}
                      onChange={(e) => setCustomProgram(e.target.value)}
                      placeholder="Please specify your desired program"
                      className="w-full bg-white border border-[#AD0819]/60 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#AD0819]/20"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Interested Country - Flag Left of Short Name */}
            {step === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 4 • Destination
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    Which country are you interested in?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Pick your dream destination for higher studies and global career opportunities.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {COUNTRY_OPTIONS.map((item) => {
                    const isSelected = interestedCountry === item.name
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setInterestedCountry(item.name)}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                          isSelected
                            ? 'bg-red-50/90 border-[#AD0819] text-gray-950 shadow-md ring-2 ring-[#AD0819]/25 font-bold'
                            : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/70 text-gray-800 shadow-sm'
                        }`}
                      >
                        {/* Country flag left of Country short name */}
                        <span className="text-2xl shrink-0 leading-none">{item.flag}</span>
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                          {item.shortName}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {interestedCountry === 'Other' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="Type country name (e.g. Netherlands, Sweden)"
                      className="w-full bg-white border border-[#AD0819]/60 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#AD0819]/20"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: Intake Year */}
            {step === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 5 • Timeline
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    When do you plan to begin?
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select your target intake year to match university admission cycles.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {INTAKE_OPTIONS.map((item) => {
                    const isSelected = intakeYear === item.year
                    return (
                      <button
                        key={item.year}
                        type="button"
                        onClick={() => setIntakeYear(item.year)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-red-50/80 border-[#AD0819] text-gray-950 shadow-md ring-2 ring-[#AD0819]/25'
                            : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/70 text-gray-800 shadow-sm'
                        }`}
                      >
                        <div>
                          <p className="text-base font-bold text-gray-900 font-mono">{item.year}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[#AD0819] bg-[#AD0819] text-white'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 6: Reason Why & Submit */}
            {step === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AD0819] font-mono mb-2">
                    Step 6 • Goals & Motivation
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
                    Tell us why you want to go
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Share your aspirations, questions, or specific scholarship requirements.
                  </p>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. I am passionate about Computer Science and seeking high scholarship opportunities in South Korea. I would also like guidance regarding visa process..."
                    className="w-full bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-[#AD0819] rounded-2xl p-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-4 focus:ring-[#AD0819]/10 resize-none leading-relaxed shadow-sm"
                  />

                  {/* Suggestion Quick Chips */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Quick suggestions (click to append):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REASON_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            if (!reason.includes(prompt)) {
                              setReason((prev) => (prev ? `${prev}. ${prompt}` : prompt))
                            }
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200/80 text-gray-700 border border-gray-200 transition-colors"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Success / Complete */}
            {step === 7 && (
              <motion.div
                key="step-success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="py-4 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-green-600/20 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 tracking-tight">
                    You're All Set, {name}! 🎉
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for submitting your details. Our dedicated university advisors will review your profile and reach out within 24 hours.
                  </p>
                </div>

                {/* Submitted Summary Pill */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Target Country:</span>
                    <span className="font-semibold text-gray-900">{activeCountry || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Program Level:</span>
                    <span className="font-semibold text-gray-900">{activeProgram || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Intake Year:</span>
                    <span className="font-semibold text-gray-900">{intakeYear || '2026'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-mono text-[#AD0819] font-medium">{phone || 'Saved'}</span>
                  </div>
                </div>

                {/* Next Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/821044439007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-700/20"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 text-sm font-semibold transition-all shadow-sm"
                  >
                    <span>Visit Website</span>
                    <Globe className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setName('')
                      setEmail('')
                      setPhone('')
                      setInterestedProgram('')
                      setInterestedCountry('')
                      setIntakeYear('')
                      setReason('')
                      setLeadId(null)
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Submit another response
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#AD0819] text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#AD0819]" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Bottom Action Buttons (for Steps 1 to 6) */}
          {step <= 6 && (
            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 border border-gray-200 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={saveStepMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#AD0819] via-[#C41E3A] to-[#AD0819] hover:opacity-95 text-white shadow-lg shadow-red-900/20 transition-all"
              >
                {saveStepMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : step === 6 ? (
                  <>
                    <span>Submit & Finish</span>
                    <Send className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Live Autosave Indicator */}
        {step <= 6 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Progressive save enabled</span>
            {lastSavedTime && <span>• Last stored at {lastSavedTime}</span>}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-3xl mx-auto px-5 py-6 text-center text-xs text-gray-500 border-t border-gray-200/80 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Endow Global Education. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">
            Contact
          </Link>
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
