'use client'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { useSession } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc-client'
import { getErrorMessage } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Send,
  Sparkles,
  Camera,
  Loader2,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

const COUNTRY_ALIASES: Record<string, string> = {
  'United Kingdom': 'UK',
  'United States': 'USA',
  'United States of America': 'USA',
}

function mapCountry(value?: string | null): string {
  if (!value) return ''
  return COUNTRY_ALIASES[value] ?? value
}

const LEVEL_TO_APPLYING: Record<string, string> = {
  UNDERGRADUATE: 'Undergraduate',
  POSTGRADUATE: 'Masters',
  PHD: 'Doctorate',
  DIPLOMA: 'Undergraduate',
  CERTIFICATE: 'Undergraduate',
  FOUNDATION: 'Undergraduate',
}

const EDUCATION_TO_APPLYING: Record<string, string> = {
  HIGH_SCHOOL: 'Undergraduate',
  BACHELORS: 'Masters',
  MASTERS: 'Doctorate',
  PHD: 'Doctorate',
}

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Belgium',
  'Bhutan',
  'Bolivia',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Ecuador',
  'Egypt',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Laos',
  'Latvia',
  'Lebanon',
  'Libya',
  'Lithuania',
  'Luxembourg',
  'Malaysia',
  'Maldives',
  'Malta',
  'Mauritius',
  'Mexico',
  'Mongolia',
  'Morocco',
  'Myanmar',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'North Korea',
  'Norway',
  'Oman',
  'Pakistan',
  'Palestine',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saudi Arabia',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Somalia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Tunisia',
  'Turkey',
  'Uganda',
  'Ukraine',
  'UAE',
  'UK',
  'USA',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]
const HEARD_FROM = ['Social Sites', 'Website', 'Family, Friends & Relatives']
const ENGLISH_TESTS = ['None', 'IELTS', 'TOEFL', 'SAT', 'TOPIK']
const DEGREE_LEVELS = ['Undergraduate', 'Masters', 'Doctorate', 'EAP', 'KLP']

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-gray-900 placeholder:text-gray-400'
const inputLockedCls =
  'w-full rounded-xl border border-gray-200 bg-gray-100/80 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed outline-none select-none transition-all'
const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'

interface AcademicGroup {
  label: string
  yearKey: string
  resultKey: string
  resultLabel: string
  placeholder: string
  maxScore: number
}

const academicFields: Record<string, AcademicGroup[]> = {
  Undergraduate: [
    {
      label: 'Secondary (SSC / O-Level)',
      yearKey: 'sscYear',
      resultKey: 'sscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: 'Higher Secondary (HSC / A-Level)',
      yearKey: 'hscYear',
      resultKey: 'hscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
  ],
  Masters: [
    {
      label: 'Secondary (SSC / O-Level)',
      yearKey: 'sscYear',
      resultKey: 'sscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: 'Higher Secondary (HSC / A-Level)',
      yearKey: 'hscYear',
      resultKey: 'hscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: "Bachelor's Degree (BSc, BBA, BA Hons, etc.)",
      yearKey: 'bachelorsYear',
      resultKey: 'bachelorsResult',
      resultLabel: 'Result (CGPA - Max 4.00)',
      placeholder: 'e.g. 3.75',
      maxScore: 4.0,
    },
  ],
  Doctorate: [
    {
      label: 'Secondary (SSC / O-Level)',
      yearKey: 'sscYear',
      resultKey: 'sscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: 'Higher Secondary (HSC / A-Level)',
      yearKey: 'hscYear',
      resultKey: 'hscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: "Bachelor's Degree (BSc, BBA, BA Hons, etc.)",
      yearKey: 'bachelorsYear',
      resultKey: 'bachelorsResult',
      resultLabel: 'Result (CGPA - Max 4.00)',
      placeholder: 'e.g. 3.75',
      maxScore: 4.0,
    },
    {
      label: "Master's Degree (MSc, MBA, MA, etc.)",
      yearKey: 'mastersYear',
      resultKey: 'mastersResult',
      resultLabel: 'Result (CGPA - Max 4.00)',
      placeholder: 'e.g. 3.85',
      maxScore: 4.0,
    },
  ],
  EAP: [
    {
      label: 'Secondary (SSC / O-Level)',
      yearKey: 'sscYear',
      resultKey: 'sscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: 'Higher Secondary (HSC / A-Level)',
      yearKey: 'hscYear',
      resultKey: 'hscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
  ],
  KLP: [
    {
      label: 'Secondary (SSC / O-Level)',
      yearKey: 'sscYear',
      resultKey: 'sscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
    {
      label: 'Higher Secondary (HSC / A-Level)',
      yearKey: 'hscYear',
      resultKey: 'hscResult',
      resultLabel: 'Result (GPA - Max 5.00)',
      placeholder: 'e.g. 5.00',
      maxScore: 5.0,
    },
  ],
}

export default function ApplyNowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C41E3A] border-t-transparent" />
        </div>
      }
    >
      <ApplyNowContent />
    </Suspense>
  )
}

function ApplyNowContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { data: profile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const utils = trpc.useUtils()

  const isLoggedIn = !!session?.user && !!profile
  const student = (profile as any)?.studentProfile

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState<any>({
    surname: '',
    givenName: '',
    dob: '',
    gender: '',
    phone: '',
    whatsapp: '',
    email: '',
    fatherName: '',
    motherName: '',
    hometown: '',
    nationality: 'Bangladeshi',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    applyingTo: '',
    sscYear: '',
    sscResult: '',
    hscYear: '',
    hscResult: '',
    bachelorsYear: '',
    bachelorsResult: '',
    mastersYear: '',
    mastersResult: '',
    targetCountry: 'South Korea',
    targetUniversity: '',
    courseName: '',
    courseSlug: '',
    reasonToChoose: '',
    englishTest: 'None',
    ieltsScore: '',
    toeflScore: '',
    satScore: '',
    topikLevel: '',
    heardFrom: '',
    referralName: '',
    photoUrl: '',
  })

  const courseNameParam = searchParams.get('courseName') || ''
  const slugParam = searchParams.get('slug') || searchParams.get('course') || ''
  const universityParam = searchParams.get('university') || ''
  const countryParam = searchParams.get('country') || ''
  const levelParam = searchParams.get('level') || ''

  const { data: courseBySlug } = trpc.course.getBySlug.useQuery(
    { slug: slugParam },
    { enabled: !!slugParam }
  )

  const { data: countryList } = trpc.university.countries.useQuery()
  const { data: uniList } = trpc.university.getAll.useQuery()
  const destCountries = useMemo(() => {
    const list = countryList?.map((c: any) => c.country) || ['South Korea']
    if (form.targetCountry && !list.includes(form.targetCountry)) {
      list.unshift(form.targetCountry)
    }
    return list
  }, [countryList, form.targetCountry])

  const universities = useMemo(() => {
    const names = (uniList || []).map((u: any) => u.name)
    if (form.targetUniversity && !names.includes(form.targetUniversity)) {
      names.unshift(form.targetUniversity)
    }
    return names
  }, [uniList, form.targetUniversity])

  const { data: universityCourses } = trpc.endow.getCoursesForUniversity.useQuery(
    { universityName: form.targetUniversity },
    { enabled: !!form.targetUniversity }
  )

  const inquiryMutation = trpc.endow.submitInquiry.useMutation({
    onSuccess: async () => {
      await utils.dashboard.overview.invalidate()
      await utils.application.getAll.invalidate()
      await utils.user.getProfile.invalidate()
      setSubmitted(true)
      toast.success('Application submitted!')
    },
    onError: (e: any) => toast.error(getErrorMessage(e, 'Submission failed')),
  })

  const setF = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, or WEBP)')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be less than 8MB')
      return
    }

    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'avatar')

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Upload failed')
      }

      const data = await res.json()
      if (data.url) {
        setF('photoUrl', data.url)
        toast.success('Profile picture uploaded!')
      } else {
        throw new Error('No URL returned')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload photo')
    } finally {
      setUploadingPhoto(false)
      if (e.target) e.target.value = ''
    }
  }

  const academicLevels = academicFields[form.applyingTo] || academicFields.Undergraduate

  function validateForm(): string | null {
    if (!form.surname.trim()) return 'Surname is required'
    if (!form.givenName.trim()) return 'Given name is required'
    if (!form.phone.trim()) return 'Phone is required'
    if (!form.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address'
    if (!form.country) return 'Country is required'
    if (!form.applyingTo) return 'Please select a degree level'

    const yearFields: [string, string][] = [
      ['sscYear', 'SSC passing year'],
      ['hscYear', 'HSC passing year'],
      ['bachelorsYear', "Bachelor's passing year"],
      ['mastersYear', "Master's passing year"],
    ]
    for (const [key, label] of yearFields) {
      const value = (form[key] || '').trim()
      if (value && !/^\d{4}$/.test(value)) return `${label} should be a 4-digit year (e.g. 2022)`
    }

    // SSC & HSC: GPA 5.00 max
    if (form.sscResult && form.sscResult.trim()) {
      const v = parseFloat(form.sscResult.trim())
      if (isNaN(v) || v < 0 || v > 5) return 'SSC result cannot exceed GPA 5.00'
    }
    if (form.hscResult && form.hscResult.trim()) {
      const v = parseFloat(form.hscResult.trim())
      if (isNaN(v) || v < 0 || v > 5) return 'HSC result cannot exceed GPA 5.00'
    }

    // Bachelor's & Master's: CGPA 4.00 max
    if (form.bachelorsResult && form.bachelorsResult.trim()) {
      const v = parseFloat(form.bachelorsResult.trim())
      if (isNaN(v) || v < 0 || v > 4) return "Bachelor's result (BSc, BBA, BA Hons, etc.) cannot exceed CGPA 4.00"
    }
    if (form.mastersResult && form.mastersResult.trim()) {
      const v = parseFloat(form.mastersResult.trim())
      if (isNaN(v) || v < 0 || v > 4) return "Master's result (MSc, MBA, MA, etc.) cannot exceed CGPA 4.00"
    }

    return null
  }

  // Pre-populate personal details and academic credentials from the signed-in user's profile & latest inquiry
  useEffect(() => {
    if (profile) {
      const studentData = profile.studentProfile as any
      const inqData = (profile as any).latestInquiry as any
      const parts = (profile.name || '').trim().split(/\s+/)
      const givenName = parts[0] || inqData?.givenName || ''
      const surname = parts.slice(1).join(' ') || inqData?.surname || parts[0] || ''
      const phone = studentData?.phone || inqData?.phone || ''
      const inferredApplying =
        EDUCATION_TO_APPLYING[studentData?.highestEducation] || inqData?.applyingTo || 'Undergraduate'

      const gpaStr = studentData?.gpa != null ? String(studentData.gpa) : inqData?.bachelorsResult || inqData?.hscResult || ''
      const ieltsStr = studentData?.ieltsScore != null ? String(studentData.ieltsScore) : inqData?.ieltsScore || ''
      const toeflStr = studentData?.toeflScore != null ? String(studentData.toeflScore) : inqData?.toeflScore || ''
      const satStr = studentData?.satScore != null ? String(studentData.satScore) : inqData?.satScore || ''

      let englishTest = inqData?.englishTest || 'None'
      if (englishTest === 'None') {
        if (ieltsStr) englishTest = 'IELTS'
        else if (toeflStr) englishTest = 'TOEFL'
        else if (satStr) englishTest = 'SAT'
        else if (inqData?.topikLevel) englishTest = 'TOPIK'
      }

      let targetCountry = inqData?.targetCountry || ''
      if (!targetCountry) {
        try {
          const tc = Array.isArray(studentData?.targetCountries)
            ? studentData.targetCountries
            : JSON.parse(studentData?.targetCountries || '[]')
          if (tc.length > 0 && tc[0]) targetCountry = mapCountry(tc[0])
        } catch {}
      }

      setForm((p: any) => ({
        ...p,
        givenName: givenName || p.givenName,
        surname: surname || p.surname,
        email: profile.email || p.email,
        phone: phone || p.phone,
        whatsapp: inqData?.whatsapp || phone || p.whatsapp,
        dob: inqData?.dob || p.dob,
        gender: inqData?.gender || p.gender,
        fatherName: inqData?.fatherName || p.fatherName,
        motherName: inqData?.motherName || p.motherName,
        hometown: inqData?.hometown || p.hometown,
        addressLine1: inqData?.addressLine1 || p.addressLine1,
        addressLine2: inqData?.addressLine2 || p.addressLine2,
        city: inqData?.city || p.city,
        state: inqData?.state || p.state,
        zipCode: inqData?.zipCode || p.zipCode,
        nationality: studentData?.nationality || inqData?.nationality || p.nationality || 'Bangladeshi',
        country: inqData?.country ? mapCountry(inqData.country) : (studentData?.countryOfResidence ? mapCountry(studentData.countryOfResidence) : p.country),
        applyingTo: p.applyingTo || inferredApplying,
        photoUrl: (profile as any)?.image || inqData?.photoUrl || p.photoUrl || '',
        sscYear: inqData?.sscYear || p.sscYear,
        sscResult: inqData?.sscResult || p.sscResult,
        hscYear: inqData?.hscYear || p.hscYear,
        hscResult: inqData?.hscResult || (inferredApplying === 'Undergraduate' && gpaStr ? gpaStr : p.hscResult),
        bachelorsYear: inqData?.bachelorsYear || p.bachelorsYear,
        bachelorsResult: inqData?.bachelorsResult || (inferredApplying === 'Masters' && gpaStr ? gpaStr : p.bachelorsResult),
        mastersYear: inqData?.mastersYear || p.mastersYear,
        mastersResult: inqData?.mastersResult || (inferredApplying === 'Doctorate' && gpaStr ? gpaStr : p.mastersResult),
        englishTest: englishTest !== 'None' ? englishTest : p.englishTest,
        ieltsScore: ieltsStr || inqData?.ieltsScore || p.ieltsScore,
        toeflScore: toeflStr || inqData?.toeflScore || p.toeflScore,
        satScore: satStr || inqData?.satScore || p.satScore,
        topikLevel: inqData?.topikLevel || p.topikLevel,
        targetCountry: targetCountry || p.targetCountry,
      }))
    }
  }, [profile])

  useEffect(() => {
    if (!courseNameParam && !slugParam && !universityParam && !countryParam && !levelParam) return
    const applyingFromLevel = levelParam ? LEVEL_TO_APPLYING[levelParam.toUpperCase()] : undefined
    setForm((p: any) => ({
      ...p,
      courseName: courseNameParam || p.courseName || '',
      courseSlug: slugParam || p.courseSlug || '',
      targetUniversity: universityParam || p.targetUniversity || '',
      targetCountry: countryParam ? mapCountry(countryParam) : p.targetCountry,
      applyingTo: applyingFromLevel || p.applyingTo,
    }))
  }, [courseNameParam, slugParam, universityParam, countryParam, levelParam])

  useEffect(() => {
    if (!courseBySlug) return
    const applyingFromLevel = courseBySlug.level
      ? LEVEL_TO_APPLYING[courseBySlug.level.toUpperCase()]
      : undefined

    setForm((p: any) => ({
      ...p,
      courseName: courseBySlug.name || courseNameParam || p.courseName,
      courseSlug: courseBySlug.slug || slugParam || p.courseSlug,
      targetUniversity:
        courseBySlug.universityName || universityParam || p.targetUniversity,
      targetCountry: courseBySlug.universityCountry
        ? mapCountry(courseBySlug.universityCountry)
        : countryParam
          ? mapCountry(countryParam)
          : p.targetCountry,
      applyingTo: applyingFromLevel || p.applyingTo,
    }))
  }, [courseBySlug, courseNameParam, slugParam, universityParam, countryParam])

  function canProceed(s: number): boolean {
    if (s === 1)
      return !!form.surname && !!form.givenName && !!form.phone && !!form.email && !!form.country
    if (s === 2) {
      if (!form.applyingTo) return false
      if (form.sscResult && parseFloat(form.sscResult) > 5) return false
      if (form.hscResult && parseFloat(form.hscResult) > 5) return false
      if (form.bachelorsResult && parseFloat(form.bachelorsResult) > 4) return false
      if (form.mastersResult && parseFloat(form.mastersResult) > 4) return false
      return true
    }
    return accepted
  }

  function handleSubmit() {
    if (!accepted) {
      toast.error('Please accept the terms')
      return
    }
    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }
    inquiryMutation.mutate({
      ...form,
      documents: [],
    } as any)
  }

  // Which key in academicFields represents profile GPA for current applying level
  const profileGpaKey =
    form.applyingTo === 'Masters'
      ? 'bachelorsResult'
      : form.applyingTo === 'Doctorate'
        ? 'mastersResult'
        : 'hscResult'

  if (submitted) {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{ background: 'linear-gradient(135deg, #fef3f4 0%, #fdf2e9 50%, #fef9f0 100%)' }}
      >
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4 pt-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Application Submitted!</h1>
            <p className="mt-3 leading-relaxed text-gray-600">
              Thank you for applying! Our advisory team will review your application and contact you via WhatsApp or email within 24 hours.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/application"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                View Applications
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: 'linear-gradient(135deg, #fef3f4 0%, #fdf2e9 50%, #fef9f0 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C41E3A]/[0.03] blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      <Navbar />
      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pb-16 pt-24">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/10 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#C41E3A] shadow-sm backdrop-blur">
              <Globe size={13} />
              Study Abroad
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Apply Now</h1>
            <p className="mt-2 text-gray-500">Start your journey to world-class education</p>
          </motion.div>

          {/* Stepper Header */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[
              { num: 1, label: 'Personal', icon: User },
              { num: 2, label: 'Academic', icon: GraduationCap },
              { num: 3, label: 'Submit', icon: Send },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${step === s.num ? 'bg-[#C41E3A] text-white shadow-lg shadow-[#C41E3A]/20' : step > s.num ? 'cursor-pointer bg-green-100 text-green-700' : 'bg-white/80 text-gray-400'}`}
                >
                  <s.icon size={16} />
                  {s.label}
                </button>
                {i < 2 && <ChevronRight size={16} className="text-gray-300" />}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-xl shadow-black/[0.02] backdrop-blur sm:p-8"
          >
            <AnimatePresence mode="wait">
              {/* ────────────────── Step 1: Personal Information ────────────────── */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <User size={20} className="text-[#C41E3A]" />
                      Personal Information
                    </h2>
                    {isLoggedIn && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={13} /> Synced with Profile
                      </span>
                    )}
                  </div>

                  {/* Sync Banner for Registered Students */}
                  {isLoggedIn && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-950">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="shrink-0 text-rose-600" />
                        <span>
                          Your personal credentials are automatically populated from your verified student profile.
                        </span>
                      </div>
                      <Link
                        href="/dashboard/settings?tab=personal"
                        target="_blank"
                        className="inline-flex shrink-0 items-center gap-1 font-bold text-rose-700 hover:text-rose-900 underline"
                      >
                        <span>Edit in Profile</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  )}

                  {/* Profile Picture Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                    <div className="relative shrink-0">
                      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#C41E3A]/40 bg-[#C41E3A]/5 shadow-inner">
                        {form.photoUrl ? (
                          <img
                            src={form.photoUrl}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Camera size={26} className="text-[#C41E3A]/60" />
                        )}
                        {uploadingPhoto && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                            <Loader2 size={20} className="animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          Profile Picture
                        </p>
                        {isLoggedIn && form.photoUrl && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            From Profile
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isLoggedIn
                          ? 'Synchronized with your profile photo.'
                          : 'Upload a photo for your student dashboard and admission profile.'}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#C41E3A] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#a91324] disabled:opacity-50">
                          <Upload size={13} />
                          {form.photoUrl ? 'Change Photo' : 'Upload Photo'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/jpg"
                            className="sr-only"
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                          />
                        </label>
                        {form.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setF('photoUrl', '')}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                          >
                            <X size={13} />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { l: 'Surname *', k: 'surname', sync: isLoggedIn },
                      { l: 'Given Name *', k: 'givenName', sync: isLoggedIn },
                      { l: 'Date of Birth', k: 'dob', t: 'date', sync: isLoggedIn && !!form.dob },
                      { l: 'Gender', k: 'gender', type: 'select', opts: ['', 'Male', 'Female', 'Other'], sync: isLoggedIn && !!form.gender },
                      { l: 'Phone *', k: 'phone', t: 'tel', sync: isLoggedIn && !!form.phone },
                      { l: 'WhatsApp', k: 'whatsapp', t: 'tel', sync: isLoggedIn && !!form.whatsapp },
                      { l: 'Email *', k: 'email', t: 'email', sync: isLoggedIn },
                      { l: 'Hometown', k: 'hometown', sync: isLoggedIn && !!form.hometown },
                      { l: 'Nationality', k: 'nationality', sync: isLoggedIn && !!form.nationality },
                      { l: "Father's Name", k: 'fatherName', sync: isLoggedIn && !!form.fatherName },
                      { l: "Mother's Name", k: 'motherName', sync: isLoggedIn && !!form.motherName },
                    ].map((f) =>
                      f.type === 'select' ? (
                        <div key={f.k}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">{f.l}</label>
                            {f.sync && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Synced
                              </span>
                            )}
                          </div>
                          {f.sync ? (
                            <input
                              readOnly
                              value={form[f.k]}
                              className={inputLockedCls}
                            />
                          ) : (
                            <select
                              value={form[f.k]}
                              onChange={(e) => setF(f.k, e.target.value)}
                              className={inputCls}
                            >
                              {(f.opts || []).map((o) => (
                                <option key={o} value={o}>
                                  {o || 'Select...'}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ) : (
                        <div key={f.k}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">{f.l}</label>
                            {f.sync && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Synced
                              </span>
                            )}
                          </div>
                          <input
                            type={f.t || 'text'}
                            value={form[f.k]}
                            readOnly={f.sync}
                            onChange={(e) => setF(f.k, e.target.value)}
                            className={f.sync ? inputLockedCls : inputCls}
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Present Address</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        { l: 'Address Line 1', k: 'addressLine1', sync: isLoggedIn && !!form.addressLine1 },
                        { l: 'Address Line 2', k: 'addressLine2', sync: isLoggedIn && !!form.addressLine2 },
                        { l: 'City', k: 'city', sync: isLoggedIn && !!form.city },
                        { l: 'State/Division', k: 'state', sync: isLoggedIn && !!form.state },
                        { l: 'Zip Code', k: 'zipCode', sync: isLoggedIn && !!form.zipCode },
                      ].map((f) => (
                        <div key={f.k}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">{f.l}</label>
                            {f.sync && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Synced
                              </span>
                            )}
                          </div>
                          <input
                            value={form[f.k]}
                            readOnly={f.sync}
                            onChange={(e) => setF(f.k, e.target.value)}
                            className={f.sync ? inputLockedCls : inputCls}
                          />
                        </div>
                      ))}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-sm font-medium text-gray-700">Country *</label>
                          {isLoggedIn && student?.countryOfResidence && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Synced
                            </span>
                          )}
                        </div>
                        {isLoggedIn && student?.countryOfResidence ? (
                          <input
                            readOnly
                            value={form.country}
                            className={inputLockedCls}
                          />
                        ) : (
                          <select
                            value={form.country}
                            onChange={(e) => setF('country', e.target.value)}
                            className={inputCls}
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ────────────────── Step 2: Academic Information ────────────────── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <GraduationCap size={20} className="text-[#C41E3A]" />
                      Academic Information
                    </h2>
                    {isLoggedIn && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={13} /> Synced with Profile
                      </span>
                    )}
                  </div>

                  {/* Sync Banner for Academic Records */}
                  {isLoggedIn && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs text-rose-950">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="shrink-0 text-rose-600" />
                        <span>
                          Academic level & GPA are synchronized with your profile settings.
                        </span>
                      </div>
                      <Link
                        href="/dashboard/settings?tab=study"
                        target="_blank"
                        className="inline-flex shrink-0 items-center gap-1 font-bold text-rose-700 hover:text-rose-900 underline"
                      >
                        <span>Edit in Study Settings</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">Applying to *</label>
                      {isLoggedIn && student?.highestEducation && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Synced with Highest Education
                        </span>
                      )}
                    </div>
                    {isLoggedIn && student?.highestEducation ? (
                      <input
                        readOnly
                        value={form.applyingTo}
                        className={inputLockedCls}
                      />
                    ) : (
                      <select
                        value={form.applyingTo}
                        onChange={(e) => setF('applyingTo', e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select degree level...</option>
                        {DEGREE_LEVELS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {form.applyingTo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2"
                    >
                      {academicLevels.map((group) => {
                        const currentVal = form[group.resultKey] || ''
                        const numVal = parseFloat(currentVal)
                        const isExceeded = !isNaN(numVal) && numVal > group.maxScore
                        const isYearLocked = isLoggedIn && !!form[group.yearKey]
                        const isProfileLocked =
                          isLoggedIn &&
                          (!!form[group.resultKey] ||
                            (student?.gpa != null && group.resultKey === profileGpaKey))

                        return (
                          <div
                            key={group.label}
                            className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                <BookOpen size={14} className="text-[#C41E3A]" />
                                {group.label}
                              </p>
                              {isProfileLocked && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Verified Profile GPA
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="mb-1 block text-xs text-gray-500">
                                  Passing Year
                                </label>
                                <input
                                  value={form[group.yearKey]}
                                  readOnly={isYearLocked}
                                  onChange={(e) => setF(group.yearKey, e.target.value)}
                                  className={isYearLocked ? inputLockedCls : inputCls}
                                  placeholder="e.g. 2022"
                                  maxLength={4}
                                />
                              </div>
                              <div>
                                <label className="mb-1 flex items-center justify-between text-xs text-gray-500">
                                  <span>{group.resultLabel}</span>
                                  {isExceeded && (
                                    <span className="font-semibold text-red-600">
                                      Max {group.maxScore.toFixed(2)}
                                    </span>
                                  )}
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max={group.maxScore}
                                  readOnly={isProfileLocked}
                                  value={form[group.resultKey]}
                                  onChange={(e) => setF(group.resultKey, e.target.value)}
                                  className={`${isProfileLocked ? inputLockedCls : inputCls} ${
                                    isExceeded
                                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                      : ''
                                  }`}
                                  placeholder={group.placeholder}
                                />
                                {isProfileLocked ? (
                                  <p className="mt-1 text-[11px] text-gray-500">
                                    Locked to your profile GPA ({student.gpa}).{' '}
                                    <Link
                                      href="/dashboard/settings?tab=study"
                                      target="_blank"
                                      className="font-semibold text-rose-600 underline"
                                    >
                                      Edit in Settings
                                    </Link>
                                  </p>
                                ) : isExceeded ? (
                                  <p className="mt-1 text-[11px] font-medium text-red-600">
                                    Result cannot exceed {group.maxScore.toFixed(2)}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      
                </motion.div>
                    )}
                </motion.div>
              )}

              {/* ────────────────── Step 3: Preferences & Submit ────────────────── */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FileText size={20} className="text-[#C41E3A]" />
                    Preferences & Submit
                  </h2>

                  {form.courseName && (
                    <div className="flex items-start gap-3 rounded-xl border border-[#C41E3A]/15 bg-[#C41E3A]/5 p-3.5">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-[#C41E3A]" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">
                          You&apos;re applying to
                        </p>
                        <p className="text-sm font-bold text-gray-900">{form.courseName}</p>
                        {form.targetUniversity && (
                          <p className="text-xs text-gray-500">{form.targetUniversity}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Study Destination</label>
                      <select
                        value={form.targetCountry}
                        onChange={(e) => setF('targetCountry', e.target.value)}
                        className={inputCls}
                      >
                        {destCountries.map((c: string) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Preferred University</label>
                      <select
                        value={form.targetUniversity}
                        onChange={(e) => {
                          setF('targetUniversity', e.target.value)
                          setF('courseSlug', '')
                          setF('courseName', '')
                        }}
                        className={inputCls}
                      >
                        <option value="">Select...</option>
                        {universities.map((u: string) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(form.targetUniversity || form.courseName || form.courseSlug) && (
                    <div>
                      <label className={labelCls}>Preferred Program / Course</label>
                      <select
                        value={form.courseSlug || (form.courseName ? '__custom__' : '')}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === '__custom__') {
                            setF('courseSlug', '')
                            setF('courseName', '')
                          } else if (!val) {
                            setF('courseSlug', '')
                            setF('courseName', '')
                          } else {
                            const c = universityCourses?.find((item: any) => item.slug === val)
                            if (c) {
                              setF('courseSlug', c.slug)
                              setF('courseName', c.name)
                            } else if (val === form.courseSlug) {
                              // already selected
                            }
                          }
                        }}
                        className={inputCls}
                      >
                        <option value="">
                          {universityCourses && universityCourses.length > 0
                            ? 'General Admission (Counselor will guide best course)'
                            : 'General Admission / Any Course'}
                        </option>
                        {form.courseSlug &&
                          !universityCourses?.some((c: any) => c.slug === form.courseSlug) && (
                            <option value={form.courseSlug}>
                              {form.courseName || form.courseSlug}
                            </option>
                          )}
                        {(universityCourses || []).map((c: any) => (
                          <option key={c.id || c.slug} value={c.slug}>
                            {c.name} {c.level ? `(${c.level})` : ''}
                          </option>
                        ))}
                        <option value="__custom__">Other / Specify Major (type below)</option>
                      </select>
                      {!form.courseSlug && (
                        <input
                          type="text"
                          value={form.courseName}
                          onChange={(e) => setF('courseName', e.target.value)}
                          placeholder="Enter your desired major / department (e.g. Computer Science, Business)..."
                          className={`${inputCls} mt-2`}
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Why this university?</label>
                    <textarea
                      value={form.reasonToChoose}
                      onChange={(e) => setF('reasonToChoose', e.target.value)}
                      rows={3}
                      className={inputCls}
                      placeholder="Tell us your motivation..."
                    />
                  </div>

                  {/* Standardized Test Scores */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-gray-700">English Proficiency / Test</label>
                      {isLoggedIn &&
                        (student?.ieltsScore || student?.toeflScore || student?.satScore) && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified from Profile
                          </span>
                        )}
                    </div>
                    {isLoggedIn && (student?.ieltsScore || student?.toeflScore || student?.satScore) ? (
                      <input
                        readOnly
                        value={form.englishTest}
                        className={inputLockedCls}
                      />
                    ) : (
                      <select
                        value={form.englishTest}
                        onChange={(e) => {
                          setF('englishTest', e.target.value)
                          ;['ieltsScore', 'toeflScore', 'satScore', 'topikLevel'].forEach((k) =>
                            setF(k, '')
                          )
                        }}
                        className={inputCls}
                      >
                        {ENGLISH_TESTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {form.englishTest === 'IELTS' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-500">IELTS Band Score</label>
                          {isLoggedIn && !!form.ieltsScore && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Profile
                            </span>
                          )}
                        </div>
                        <input
                          readOnly={isLoggedIn && !!form.ieltsScore}
                          value={form.ieltsScore}
                          onChange={(e) => setF('ieltsScore', e.target.value)}
                          className={isLoggedIn && !!form.ieltsScore ? inputLockedCls : inputCls}
                          placeholder="e.g. 6.5"
                        />
                      </div>
                    )}
                    {form.englishTest === 'TOEFL' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-500">TOEFL Score</label>
                          {isLoggedIn && !!form.toeflScore && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Profile
                            </span>
                          )}
                        </div>
                        <input
                          readOnly={isLoggedIn && !!form.toeflScore}
                          value={form.toeflScore}
                          onChange={(e) => setF('toeflScore', e.target.value)}
                          className={isLoggedIn && !!form.toeflScore ? inputLockedCls : inputCls}
                          placeholder="e.g. 90"
                        />
                      </div>
                    )}
                    {form.englishTest === 'SAT' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-500">SAT Score</label>
                          {isLoggedIn && !!form.satScore && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Profile
                            </span>
                          )}
                        </div>
                        <input
                          readOnly={isLoggedIn && !!form.satScore}
                          value={form.satScore}
                          onChange={(e) => setF('satScore', e.target.value)}
                          className={isLoggedIn && !!form.satScore ? inputLockedCls : inputCls}
                          placeholder="e.g. 1200"
                        />
                      </div>
                    )}
                    {form.englishTest === 'TOPIK' && (
                      <div>
                        <label className={labelCls}>TOPIK Level</label>
                        <select
                          value={form.topikLevel}
                          onChange={(e) => setF('topikLevel', e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Select...</option>
                          {[1, 2, 3, 4, 5, 6].map((l) => (
                            <option key={l} value={String(l)}>
                              Level {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>How did you hear about us?</label>
                      <select
                        value={form.heardFrom}
                        onChange={(e) => {
                          setF('heardFrom', e.target.value)
                          if (e.target.value !== 'Family, Friends & Relatives')
                            setF('referralName', '')
                        }}
                        className={inputCls}
                      >
                        <option value="">Select...</option>
                        {HEARD_FROM.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.heardFrom === 'Family, Friends & Relatives' && (
                      <div>
                        <label className={labelCls}>Referral Name</label>
                        <input
                          value={form.referralName}
                          onChange={(e) => setF('referralName', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    )}
                  </div>

                  <label
                    className="flex cursor-pointer items-start gap-3 pt-2"
                    onClick={() => setAccepted(!accepted)}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${accepted ? 'border-[#C41E3A] bg-[#C41E3A]' : 'border-gray-300'}`}
                    >
                      {accepted && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-600">
                      I acknowledge that my data will be collected and used by Endow Global Education.
                    </span>
                  </label>

                  <button
                    onClick={handleSubmit}
                    disabled={inquiryMutation.isPending}
                    className="mt-4 w-full rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                  >
                    {inquiryMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 3 && (
              <div className="mt-6 flex justify-end">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mr-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>
                )}
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed(step)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
