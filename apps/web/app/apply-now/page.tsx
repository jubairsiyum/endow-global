'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChevronRight, ChevronLeft, CheckCircle2, User, GraduationCap, FileText, Send, ArrowRight, BookOpen, Globe, Star, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc-client'
import { useSession } from '@/lib/auth-client'
import { getErrorMessage } from '@/lib/utils'

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
}

const COUNTRIES = ['Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Azerbaijan','Bahrain','Bangladesh','Belgium','Bhutan','Bolivia','Brazil','Brunei','Bulgaria','Cambodia','Cameroon','Canada','Chile','China','Colombia','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Ecuador','Egypt','Estonia','Ethiopia','Fiji','Finland','France','Georgia','Germany','Ghana','Greece','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Laos','Latvia','Lebanon','Libya','Lithuania','Luxembourg','Malaysia','Maldives','Malta','Mauritius','Mexico','Mongolia','Morocco','Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nigeria','North Korea','Norway','Oman','Pakistan','Palestine','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saudi Arabia','Serbia','Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine','UAE','UK','USA','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe']
const HEARD_FROM = ['Social Sites','Website','Family, Friends & Relatives']
const ENGLISH_TESTS = ['None','IELTS','TOEFL','SAT','TOPIK']
const DEGREE_LEVELS = ['Undergraduate','Masters','Doctorate','EAP','KLP']

const inputCls = "w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm outline-none focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/10 transition-all text-gray-900 placeholder:text-gray-400"
const labelCls = "mb-1.5 block text-sm font-medium text-gray-700"

const academicFields: Record<string, { label: string; keys: string[] }[]> = {
  Undergraduate: [{label:'Secondary (SSC/O-Level)',keys:['sscYear','sscResult']},{label:'Higher Secondary (HSC/A-Level)',keys:['hscYear','hscResult']}],
  Masters: [{label:'Secondary (SSC/O-Level)',keys:['sscYear','sscResult']},{label:'Higher Secondary (HSC/A-Level)',keys:['hscYear','hscResult']},{label:"Bachelor's Degree",keys:['bachelorsYear','bachelorsResult']}],
  Doctorate: [{label:'Secondary (SSC/O-Level)',keys:['sscYear','sscResult']},{label:'Higher Secondary (HSC/A-Level)',keys:['hscYear','hscResult']},{label:"Bachelor's Degree",keys:['bachelorsYear','bachelorsResult']},{label:"Master's Degree",keys:['mastersYear','mastersResult']}],
  EAP: [{label:'Secondary (SSC/O-Level)',keys:['sscYear','sscResult']},{label:'Higher Secondary (HSC/A-Level)',keys:['hscYear','hscResult']}],
  KLP: [{label:'Secondary (SSC/O-Level)',keys:['sscYear','sscResult']},{label:'Higher Secondary (HSC/A-Level)',keys:['hscYear','hscResult']}],
}

export default function ApplyNowPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C41E3A] border-t-transparent" /></div>}>
      <ApplyNowContent />
    </Suspense>
  )
}

function ApplyNowContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { data: profile } = trpc.user.getProfile.useQuery(undefined, { enabled: !!session?.user })

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState<any>({
    surname: '', givenName: '', dob: '', gender: '', phone: '', whatsapp: '', email: '',
    fatherName: '', motherName: '', hometown: '', nationality: 'Bangladeshi',
    addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'Bangladesh',
    applyingTo: '', sscYear: '', sscResult: '', hscYear: '', hscResult: '',
    bachelorsYear: '', bachelorsResult: '', mastersYear: '', mastersResult: '',
    targetCountry: 'South Korea', targetUniversity: '', courseName: '', courseSlug: '', reasonToChoose: '',
    englishTest: 'None', ieltsScore: '', toeflScore: '', satScore: '', topikLevel: '',
    heardFrom: '', referralName: '',
  })

  const { data: countryList } = trpc.university.countries.useQuery()
  const { data: uniList } = trpc.university.featured.useQuery()
  const destCountries = countryList?.map((c:any) => c.country) || ['South Korea']
  const universities = uniList?.map((u:any) => u.name) || []

  const inquiryMutation = trpc.endow.submitInquiry.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success('Application submitted!') },
    onError: (e:any) => toast.error(getErrorMessage(e, 'Submission failed')),
  })

  const setF = (k:string,v:any) => setForm((p:any)=>({...p,[k]:v}))
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
    return null
  }

  // Pre-populate personal details from the signed-in user's profile, and
  // carry course context through from the course page's "Apply Now" link.
  useEffect(() => {
    if (profile) {
      const student = profile.studentProfile as any
      const parts = (profile.name || '').trim().split(/\s+/)
      const givenName = parts[0] || ''
      const surname = parts.slice(1).join(' ')
      const phone = student?.phone || ''
      const inferredApplying = EDUCATION_TO_APPLYING[student?.highestEducation] || ''
      setForm((p:any) => ({
        ...p,
        givenName: p.givenName || givenName,
        surname: p.surname || surname,
        email: p.email || profile.email || '',
        phone: p.phone || phone,
        whatsapp: p.whatsapp || phone,
        nationality: p.nationality === 'Bangladeshi' && student?.nationality ? student.nationality : p.nationality,
        country: p.country === 'Bangladesh' && student?.countryOfResidence ? mapCountry(student.countryOfResidence) : p.country,
        applyingTo: p.applyingTo || inferredApplying,
      }))
    }
  }, [profile])

  useEffect(() => {
    const courseName = searchParams.get('courseName')
    const courseSlug = searchParams.get('slug') || searchParams.get('course')
    const university = searchParams.get('university')
    const country = searchParams.get('country')
    const level = searchParams.get('level')
    if (!courseName && !courseSlug && !university && !country && !level) return
    const applyingFromLevel = level ? LEVEL_TO_APPLYING[level.toUpperCase()] : undefined
    setForm((p:any) => ({
      ...p,
      courseName: p.courseName || courseName || '',
      courseSlug: p.courseSlug || courseSlug || '',
      targetUniversity: p.targetUniversity || university || '',
      targetCountry: p.targetCountry === 'South Korea' && country ? mapCountry(country) : p.targetCountry,
      applyingTo: applyingFromLevel || p.applyingTo,
    }))
  }, [searchParams])

  function canProceed(s: number): boolean {
    if (s===1) return !!form.surname && !!form.givenName && !!form.phone && !!form.email && !!form.country
    if (s===2) return !!form.applyingTo
    return accepted
  }

  function handleSubmit() {
    if (!accepted) { toast.error('Please accept the terms'); return }
    const validationError = validateForm()
    if (validationError) { toast.error(validationError); return }
    inquiryMutation.mutate(form)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col" style={{background:'linear-gradient(135deg, #fef3f4 0%, #fdf2e9 50%, #fef9f0 100%)'}}>
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4 pt-16">
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg"><CheckCircle2 size={40} className="text-green-600" /></div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Application Submitted!</h1>
            <p className="mt-3 text-gray-600 leading-relaxed">Thank you for applying! Our team will contact you via WhatsApp or email within 24 hours.</p>
            <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white shadow-lg">Back to Home <ArrowRight size={16} /></a>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col relative" style={{background:'linear-gradient(135deg, #fef3f4 0%, #fdf2e9 50%, #fef9f0 100%)'}}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C41E3A]/[0.03] blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      <Navbar />
      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-[#C41E3A] shadow-sm mb-3 border border-[#C41E3A]/10"><Globe size={13} />Study Abroad</div>
            <h1 className="text-3xl font-bold text-gray-900">Apply Now</h1>
            <p className="mt-2 text-gray-500">Start your journey to world-class education</p>
          </motion.div>

          <div className="mb-8 flex items-center justify-center gap-2">
            {[{num:1,label:'Personal',icon:User},{num:2,label:'Academic',icon:GraduationCap},{num:3,label:'Submit',icon:Send}].map((s,i)=>(
              <div key={s.num} className="flex items-center gap-2">
                <button onClick={()=>s.num<step&&setStep(s.num)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${step===s.num?'bg-[#C41E3A] text-white shadow-lg shadow-[#C41E3A]/20':step>s.num?'bg-green-100 text-green-700 cursor-pointer':'bg-white/80 text-gray-400'}`}><s.icon size={16}/>{s.label}</button>
                {i<2&&<ChevronRight size={16} className="text-gray-300"/>}
              </div>
            ))}
          </div>

          <motion.div key={step} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-2xl border border-gray-200/60 bg-white/90 backdrop-blur p-6 sm:p-8 shadow-xl shadow-black/[0.02]">
            <AnimatePresence mode="wait">
              {step===1 && (
                <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><User size={20} className="text-[#C41E3A]"/>Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{l:'Surname *',k:'surname'},{l:'Given Name *',k:'givenName'},{l:'Date of Birth',k:'dob',t:'date'},{l:'Gender',k:'gender',type:'select',opts:['','Male','Female']},{l:'Phone *',k:'phone',t:'tel'},{l:'WhatsApp',k:'whatsapp',t:'tel'},{l:'Email *',k:'email',t:'email'},{l:'Hometown',k:'hometown'},{l:'Nationality',k:'nationality'},{l:"Father's Name",k:'fatherName'},{l:"Mother's Name",k:'motherName'}].map(f=>f.type==='select'?<div key={f.k}><label className={labelCls}>{f.l}</label><select value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} className={inputCls}>{(f.opts||[]).map(o=><option key={o} value={o}>{o||'Select...'}</option>)}</select></div>:<div key={f.k}><label className={labelCls}>{f.l}</label><input type={f.t||'text'} value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} className={inputCls}/></div>)}
                  </div>
                  <div className="pt-2"><p className="text-sm font-semibold text-gray-700 mb-3">Present Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[{l:'Address Line 1',k:'addressLine1'},{l:'Address Line 2',k:'addressLine2'},{l:'City',k:'city'},{l:'State/Division',k:'state'},{l:'Zip Code',k:'zipCode'}].map(f=><div key={f.k}><label className={labelCls}>{f.l}</label><input value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} className={inputCls}/></div>)}
                      <div><label className={labelCls}>Country *</label><select value={form.country} onChange={e=>setF('country',e.target.value)} className={inputCls}>{COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step===2 && (
                <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><GraduationCap size={20} className="text-[#C41E3A]"/>Academic Information</h2>
                  <div><label className={labelCls}>Applying to *</label><select value={form.applyingTo} onChange={e=>setF('applyingTo',e.target.value)} className={inputCls}><option value="">Select degree level...</option>{DEGREE_LEVELS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
                  {form.applyingTo && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="space-y-4 pt-2">
                      {academicLevels.map((group)=>(
                        <div key={group.label} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><BookOpen size={14} className="text-[#C41E3A]"/>{group.label}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs text-gray-500 mb-1 block">Passing Year</label><input value={form[group.keys[0]]} onChange={e=>setF(group.keys[0],e.target.value)} className={inputCls} placeholder="e.g. 2022" maxLength={4}/></div>
                            <div><label className="text-xs text-gray-500 mb-1 block">Result (GPA/Score)</label><input value={form[group.keys[1]]} onChange={e=>setF(group.keys[1],e.target.value)} className={inputCls} placeholder="e.g. 4.50" maxLength={50}/></div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step===3 && (
                <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FileText size={20} className="text-[#C41E3A]"/>Preferences & Submit</h2>
                  {form.courseName && (
                    <div className="flex items-start gap-3 rounded-xl border border-[#C41E3A]/15 bg-[#C41E3A]/5 p-3.5">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-[#C41E3A]" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">You&apos;re applying to</p>
                        <p className="text-sm font-bold text-gray-900">{form.courseName}</p>
                        {form.targetUniversity && <p className="text-xs text-gray-500">{form.targetUniversity}</p>}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Study Destination</label><select value={form.targetCountry} onChange={e=>setF('targetCountry',e.target.value)} className={inputCls}>{destCountries.map((c:string)=><option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className={labelCls}>Preferred University</label><select value={form.targetUniversity} onChange={e=>setF('targetUniversity',e.target.value)} className={inputCls}><option value="">Select...</option>{universities.map((u:string)=><option key={u} value={u}>{u}</option>)}</select></div>
                  </div>
                  <div><label className={labelCls}>Why this university?</label><textarea value={form.reasonToChoose} onChange={e=>setF('reasonToChoose',e.target.value)} rows={3} className={inputCls} placeholder="Tell us your motivation..."/></div>
                  <div>
                    <label className={labelCls}>English Proficiency</label>
                    <select value={form.englishTest} onChange={e=>{setF('englishTest',e.target.value);['ieltsScore','toeflScore','satScore','topikLevel'].forEach(k=>setF(k,''))}} className={inputCls}>{ENGLISH_TESTS.map(t=><option key={t} value={t}>{t}</option>)}</select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {form.englishTest==='IELTS'&&<div><label className={labelCls}>IELTS Band Score</label><input value={form.ieltsScore} onChange={e=>setF('ieltsScore',e.target.value)} className={inputCls} placeholder="e.g. 6.5"/></div>}
                    {form.englishTest==='TOEFL'&&<div><label className={labelCls}>TOEFL Score</label><input value={form.toeflScore} onChange={e=>setF('toeflScore',e.target.value)} className={inputCls} placeholder="e.g. 90"/></div>}
                    {form.englishTest==='SAT'&&<div><label className={labelCls}>SAT Score</label><input value={form.satScore} onChange={e=>setF('satScore',e.target.value)} className={inputCls} placeholder="e.g. 1200"/></div>}
                    {form.englishTest==='TOPIK'&&<div><label className={labelCls}>TOPIK Level</label><select value={form.topikLevel} onChange={e=>setF('topikLevel',e.target.value)} className={inputCls}><option value="">Select...</option>{[1,2,3,4,5,6].map(l=><option key={l} value={String(l)}>Level {l}</option>)}</select></div>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>How did you hear about us?</label><select value={form.heardFrom} onChange={e=>{setF('heardFrom',e.target.value);if(e.target.value!=='Family, Friends & Relatives')setF('referralName','')}} className={inputCls}><option value="">Select...</option>{HEARD_FROM.map(h=><option key={h} value={h}>{h}</option>)}</select></div>
                    {form.heardFrom==='Family, Friends & Relatives'&&<div><label className={labelCls}>Referral Name</label><input value={form.referralName} onChange={e=>setF('referralName',e.target.value)} className={inputCls}/></div>}
                  </div>
                  <label className="flex items-start gap-3 pt-2 cursor-pointer" onClick={()=>setAccepted(!accepted)}>
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${accepted?'bg-[#C41E3A] border-[#C41E3A]':'border-gray-300'}`}>{accepted&&<CheckCircle2 size={12} className="text-white"/>}</div>
                    <span className="text-sm text-gray-600">I acknowledge that my data will be collected and used by Endow Global Education.</span>
                  </label>
                  <button onClick={handleSubmit} disabled={inquiryMutation.isPending} className="mt-4 w-full rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                    {inquiryMutation.isPending?'Submitting...':'Submit Application'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step<3&&(
              <div className="mt-6 flex justify-end">
                {step>1&&<button onClick={()=>setStep(step-1)} className="mr-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"><ChevronLeft size={16}/>Back</button>}
                <button onClick={()=>setStep(step+1)} disabled={!canProceed(step)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40 shadow-md">Next<ChevronRight size={16}/></button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
