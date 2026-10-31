'use client'

import { trpc } from '@/lib/trpc-client'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

// Available Degree Programs
const PROGRAM_OPTIONS = [
  {
    id: 'bachelors',
    label: "Bachelor's Degree",
    sub: 'Undergraduate study (3-4 years)',
    icon: '🎓',
  },
  { id: 'masters', label: "Master's Degree", sub: 'Postgraduate study (1-2 years)', icon: '🏛️' },
  { id: 'phd', label: 'PhD / Doctorate', sub: 'Research-focused doctoral study', icon: '🔬' },
  {
    id: 'diploma',
    label: 'Diploma / Certificate',
    sub: 'Short-term or vocational courses',
    icon: '📜',
  },
  {
    id: 'language',
    label: 'Language Course',
    sub: 'Korean, English or foundation track',
    icon: '🗣️',
  },
  { id: 'other', label: 'Other Program', sub: 'Custom or dual-degree path', icon: '✨' },
]

// Available Country Destinations with flag icon & country name
const COUNTRY_OPTIONS = [
  { name: 'South Korea', code: 'kr' },
  { name: 'United States', code: 'us' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'Germany', code: 'de' },
  { name: 'Japan', code: 'jp' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Other', code: null },
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
  const [interestedCountry, setInterestedCountry] = useState('South Korea')
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
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
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
      const lower = rawMsg.toLowerCase()
      // A phone has only been entered from step 2 onwards, so the duplicate-phone
      // copy can never legitimately apply to the name-only step 1 save.
      const isDuplicatePhone =
        targetStep >= 2 && (lower.includes('already submitted') || lower.includes('conflict'))
      if (isDuplicatePhone) {
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
          setErrorMsg(
            'Please enter a valid 11-digit Bangladesh phone number (e.g. 01891787808 or +8801891787808)'
          )
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
        if (
          checkMsg.toLowerCase().includes('already submitted') ||
          checkMsg.toLowerCase().includes('conflict')
        ) {
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
      const countryToSave = activeCountry || 'South Korea'
      // Progressive save Step 4
      const res = await triggerSave(4, { interestedCountry: countryToSave })
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
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F5F6F9] font-body text-gray-900 selection:bg-[#AD0819] selection:text-white">
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
      <div className="via-[#f5f6f9]/88 to-[#f5f6f9]/72 pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fdf8f4]/95" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #101B3D 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Header with Exact Navbar Logo & Green 1-min Badge */}
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-5 pb-2 pt-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Endow Global Education home"
        >
          <Image
            src="/logo/EndowFullLogo2.svg"
            alt="Endow Global Education"
            width={160}
            height={50}
            className="h-10 w-auto object-contain sm:h-12"
            priority
          />
        </Link>

        {/* 1-Minute Badge - GREEN */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Takes only 1 min</span>
        </div>
      </header>

      {/* Main Multi-step Form Container */}
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-4">
        {step <= 6 && (
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Fill this form — it will take 1 min only!
            </h1>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-gray-600">
              Tell us your study abroad goals so our expert advisors can guide your scholarships &
              admissions.
            </p>

            {/* Visual Step Progress Bar */}
            <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-200/80">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#AD0819] via-[#C41E3A] to-[#E8A33D] shadow-sm transition-all duration-300"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between px-1 font-mono text-xs text-gray-500">
              <span>Step {step} of 6</span>
              <span>{progressPercent}% Complete</span>
            </div>
          </div>
        )}

        {/* Form Card Box (Light mode with refined soft glass shadow) */}
        <div className="relative rounded-3xl border border-gray-200/90 bg-white/95 p-6 shadow-[0_16px_40px_rgba(16,27,61,0.06),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all sm:p-9">
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 1 • Identity
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    Enter your full name
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">What should our counselors call you?</p>
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
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-base text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-[#AD0819] focus:bg-white focus:ring-4 focus:ring-[#AD0819]/10"
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#AD0819]" />
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 2 • Contact Information
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    How can we reach you?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    We will share scholarship notices & connect with you for a free consultation.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                      <Mail className="h-3.5 w-3.5 text-[#AD0819]" /> Email Address
                    </label>
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-3.5 text-base text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-[#AD0819] focus:bg-white focus:ring-4 focus:ring-[#AD0819]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                      <Phone className="h-3.5 w-3.5 text-[#AD0819]" /> Phone / WhatsApp Number
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
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-3.5 font-mono text-base text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-[#AD0819] focus:bg-white focus:ring-4 focus:ring-[#AD0819]/10"
                    />
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      Enter your 11-digit mobile number with or without +88. Each phone number can
                      only be registered once.
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 3 • Academic Program
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    Select your interested program
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose the degree or qualification level you are pursuing.
                  </p>
                </div>

                <div className="grid max-h-[300px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                  {PROGRAM_OPTIONS.map((item) => {
                    const isSelected =
                      interestedProgram === item.id || interestedProgram === item.label
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setInterestedProgram(item.label)
                        }}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#AD0819] bg-red-50/80 text-gray-950 shadow-md ring-2 ring-[#AD0819]/25'
                            : 'border-gray-200/90 bg-white text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50/70'
                        }`}
                      >
                        <span className="shrink-0 text-2xl">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-gray-900">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs leading-tight text-gray-500">{item.sub}</p>
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
                      className="w-full rounded-xl border border-[#AD0819]/60 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#AD0819]/20"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Interested Country - Flag Icon & Country Name */}
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 4 • Destination
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    Which country are you interested in?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    We are currently accepting applications for South Korea. Other destinations are launching soon!
                  </p>
                </div>

                <div className="grid max-h-[340px] grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3">
                  {COUNTRY_OPTIONS.map((item) => {
                    const isAvailable = item.name === 'South Korea'
                    const isSelected = interestedCountry === item.name

                    return (
                      <button
                        key={item.name}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          if (isAvailable) {
                            setInterestedCountry(item.name)
                          }
                        }}
                        className={`relative flex items-center justify-between gap-2 rounded-2xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#AD0819] bg-red-50/90 font-bold text-gray-950 shadow-md ring-2 ring-[#AD0819]/25'
                            : isAvailable
                              ? 'border-gray-200/90 bg-white text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50/70'
                              : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50/60 opacity-60 shadow-none'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          {/* Real flag image icon for each country */}
                          {item.code ? (
                            <img
                              src={`https://flagcdn.com/w40/${item.code}.png`}
                              alt={`${item.name} flag`}
                              className={`h-5 w-7 shrink-0 rounded-[3px] border border-gray-200 object-cover shadow-sm ${
                                !isAvailable ? 'opacity-50 grayscale-[35%]' : ''
                              }`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-5 w-7 shrink-0 items-center justify-center rounded-[3px] border border-gray-200 bg-gray-100 text-[#AD0819]">
                              <Globe className="h-3.5 w-3.5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-sm leading-tight ${
                                isSelected
                                  ? 'font-bold text-gray-950'
                                  : isAvailable
                                    ? 'font-bold text-gray-900'
                                    : 'font-medium text-gray-500'
                              }`}
                            >
                              {item.name}
                            </span>
                            {!isAvailable && (
                              <span className="mt-1 inline-flex items-center rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#AD0819]" />
                        )}
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
                      className="w-full rounded-xl border border-[#AD0819]/60 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#AD0819]/20"
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 5 • Timeline
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    When do you plan to begin?
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
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
                        className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-[#AD0819] bg-red-50/80 text-gray-950 shadow-md ring-2 ring-[#AD0819]/25'
                            : 'border-gray-200/90 bg-white text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50/70'
                        }`}
                      >
                        <div>
                          <p className="font-mono text-base font-bold text-gray-900">{item.year}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                            isSelected
                              ? 'border-[#AD0819] bg-[#AD0819] text-white'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
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
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AD0819]">
                    Step 6 • Goals & Motivation
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    Tell us why you want to go
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Share your aspirations, questions, or specific scholarship requirements.
                  </p>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. I am passionate about Computer Science and seeking high scholarship opportunities in South Korea. I would also like guidance regarding visa process..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-[#AD0819] focus:bg-white focus:ring-4 focus:ring-[#AD0819]/10"
                  />

                  {/* Suggestion Quick Chips */}
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Quick suggestions (click to append):
                    </p>
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
                          className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] text-gray-700 transition-colors hover:bg-gray-200/80"
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
                className="space-y-5 py-4 text-center"
              >
                <div className="mx-auto flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 text-white shadow-lg shadow-green-600/20">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    You're All Set, {name}! 🎉
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
                    Thank you for submitting your details. Our dedicated university advisors will
                    review your profile and reach out within 24 hours.
                  </p>
                </div>

                {/* Submitted Summary Pill */}
                <div className="mx-auto max-w-sm space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left text-xs">
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Target Country:</span>
                    <span className="font-semibold text-gray-900">
                      {activeCountry || 'Not Specified'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Program Level:</span>
                    <span className="font-semibold text-gray-900">
                      {activeProgram || 'Not Specified'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/80 pb-1.5">
                    <span className="text-gray-500">Intake Year:</span>
                    <span className="font-semibold text-gray-900">{intakeYear || '2026'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-mono font-medium text-[#AD0819]">{phone || 'Saved'}</span>
                  </div>
                </div>

                {/* Next Action Links */}
                <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                  <a
                    href="https://wa.me/821044439007"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 transition-all hover:bg-emerald-700"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50"
                  >
                    <span>Visit Website</span>
                    <Globe className="h-4 w-4" />
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
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-900"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Submit another response
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Notice */}
          {errorMsg && (
            <div className="animate-shake mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-[#AD0819]">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#AD0819]" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Bottom Action Buttons (for Steps 1 to 6) */}
          {step <= 6 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200/80 hover:text-gray-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={saveStepMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#AD0819] via-[#C41E3A] to-[#AD0819] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:opacity-95"
              >
                {saveStepMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : step === 6 ? (
                  <>
                    <span>Submit & Finish</span>
                    <Send className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Live Autosave Indicator */}
        {step <= 6 && (
          <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] text-gray-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Progressive save enabled</span>
            {lastSavedTime && <span>• Last stored at {lastSavedTime}</span>}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-4 flex w-full max-w-3xl flex-col items-center justify-between gap-3 border-t border-gray-200/80 px-5 py-6 text-center text-xs text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Endow Global Education. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link href="/about" className="transition-colors hover:text-gray-900">
            About Us
          </Link>
          <Link href="/contact" className="transition-colors hover:text-gray-900">
            Contact
          </Link>
          <Link href="/" className="transition-colors hover:text-gray-900">
            Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
