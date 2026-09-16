import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Contact Us | Endow Global Education',
  description: 'Talk to Endow Global Education about university matching, applications, scholarships, and study-abroad guidance.',
  openGraph: {
    title: 'Contact Endow Global Education',
    description: 'Get practical guidance for your next study-abroad step.',
    type: 'website',
  },
}

const contactOptions = [
  {
    icon: Mail,
    label: 'Email us',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    description: 'For applications, partnerships, and general questions.',
  },
  {
    icon: Phone,
    label: 'Call Bangladesh office',
    value: SITE_CONFIG.phoneBD,
    href: SITE_CONFIG.phoneBDHref,
    description: 'Speak with our local education guidance team.',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: SITE_CONFIG.phoneBD,
    href: 'https://wa.me/8801901463204',
    description: 'Send a quick message and we will get back to you.',
  },
] as const

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf7f2] text-slate-950">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C41E3A]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C41E3A]">Let&apos;s talk</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl">
                A clearer route to your next <span className="text-[#C41E3A]">chapter.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Whether you are choosing a destination, preparing an application, or looking for the right university, our team is ready to help you move forward with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Study abroad enquiry`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#C41E3A]/20 transition hover:bg-[#A01830]"
                >
                  Start a conversation <ArrowRight size={16} />
                </a>
                <Link href="/courses" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#C41E3A]/30 hover:text-[#C41E3A]">
                  Explore courses
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C41E3A]/10 text-[#C41E3A]"><Clock3 size={22} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">What happens next</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950">A human reply, not a form receipt.</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Tell us where you are in your journey. We will connect you with the right team for a practical next step.</p>
                </div>
              </div>
              <div className="mt-7 space-y-4 border-t border-slate-100 pt-5">
                {['Share your destination or course goal', 'Get guidance on requirements and timing', 'Build a realistic application plan'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-white/60 px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C41E3A]">Choose your channel</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Reach us in the way that suits you.</h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {contactOptions.map((option) => {
                const Icon = option.icon
                return (
                  <a key={option.label} href={option.href} target={option.href.startsWith('http') ? '_blank' : undefined} rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#C41E3A]/30 hover:shadow-xl hover:shadow-slate-900/5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C41E3A]/10 text-[#C41E3A] transition group-hover:bg-[#C41E3A] group-hover:text-white"><Icon size={19} /></div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{option.label}</p>
                    <p className="mt-2 break-words text-lg font-bold text-slate-950">{option.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-[#C41E3A]/10 bg-[#fff8f5] p-6 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C41E3A]">Visit us</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Find the Endow team in Dhaka.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Appointments are recommended so a counselor can prepare for your conversation and give you focused guidance.</p>
              <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-slate-700"><MapPin size={19} className="mt-0.5 shrink-0 text-[#C41E3A]" />{SITE_CONFIG.address}</div>
            </div>
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">Prefer to begin online?</p>
              <p className="mt-3 text-xl font-bold">Start with your study goals.</p>
              <p className="mt-2 text-sm leading-6 text-white/60">Browse programs and contact us when you have a shortlist.</p>
              <Link href="/universities" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f3b1a8] transition hover:text-white">Explore destinations <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
