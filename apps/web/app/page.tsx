import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileCheck2,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import VideoBackground from '@/components/home/VideoBackground'

const universities = [
  {
    name: 'Busan University',
    logo: '/universities/Busan University.png',
  },
  {
    name: 'Hanseo University',
    logo: '/universities/Hanseo University.png',
  },
  {
    name: 'Daejin University',
    logo: '/universities/Daejin University.png',
  },
] as const

const features = [
  {
    icon: Users,
    title: 'Personalized guidance',
    copy: 'Choose programs and universities that match your academic profile, goals, and interests.',
  },
  {
    icon: Globe2,
    title: 'South Korea focus',
    copy: 'Plan your study journey around Korean universities, intakes, scholarships, and student life.',
  },
  {
    icon: ShieldCheck,
    title: 'Visa process clarity',
    copy: 'Understand requirements, timelines, and documentation with calm step-by-step support.',
  },
  {
    icon: Award,
    title: 'Scholarship guidance',
    copy: 'Explore scholarship opportunities that may reduce financial pressure for your family.',
  },
  {
    icon: FileCheck2,
    title: 'Simplified documents',
    copy: 'Prepare applications, statements, and supporting documents with organized counselor input.',
  },
  {
    icon: Plane,
    title: 'Post-arrival readiness',
    copy: 'Get practical guidance for accommodation, cultural adjustment, and student life in Korea.',
  },
] as const

function HeroSearchPanel() {
  return (
    <div className="bg-white/82 mx-auto w-full max-w-3xl rounded-lg border border-gray-200/80 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
            South Korea course finder
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Find your Korea-fit program</h2>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
          <Search size={20} />
        </span>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            What do you want to study?
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Computer Science, Business, Korean Language..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20"
            />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Destination</span>
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20">
              <option>South Korea</option>
              <option>Seoul</option>
              <option>Busan</option>
              <option>Any Korean city</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Level</span>
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20">
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>
          </label>
        </div>

        <Button className="h-11 w-full rounded-lg" size="default">
          Search Courses
        </Button>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <VideoBackground />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="pb-8 pt-4">
          <Navbar />
        </div>

        <div className="flex flex-1 items-center justify-center py-24 lg:py-20">
          <div className="mx-auto w-full max-w-4xl text-center">
            <div className="bg-white/72 mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200/80 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#C41E3A]" />
              Global Vision, Guided Path
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Study in <span className="text-[#C41E3A]">South Korea</span> with confidence.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-700 sm:text-lg">
              Endow Global Education helps Bangladeshi students turn international study goals into
              real university opportunities through expert guidance, transparent support, and a clear
              path forward.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 gap-2 px-6">
                <Link href="/register">
                  Apply Now
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="white"
                className="h-12 gap-2 border border-white/70 px-6 shadow-sm"
              >
                <Link href="/about">
                  Start Your Journey
                  <GraduationCap size={18} />
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <HeroSearchPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function UniversityMarquee() {
  const marqueeItems = [...universities, ...universities]

  return (
    <section className="overflow-hidden border-y border-gray-100 bg-white py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="university-marquee flex items-center gap-14 whitespace-nowrap">
              {marqueeItems.map((university, index) => (
                <div
                  key={`${university.name}-${index}`}
                  className="flex items-center gap-3 opacity-80 transition hover:opacity-100"
                >
                  <Image
                    src={university.logo}
                    alt={university.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-xl font-bold text-gray-600 sm:text-2xl">
                    {university.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="bg-[#f7f8fb] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
                <GraduationCap size={16} />
                Why choose us
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Your trusted partner for South Korean higher education
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-gray-600">
              We turn a complex study abroad process into a clear sequence: choose the right program,
              prepare strong documents, understand visa steps, and get ready for student life in
              South Korea.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3" amount={0.15}>
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <FadeUpItem key={feature.title}>
                <article className="h-full rounded-lg border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-gray-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{feature.copy}</p>
                </article>
              </FadeUpItem>
            )
          })}
        </FadeUpStagger>

        <FadeUp>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            {[
              'Eligibility checks',
              'Document reminders',
              'Visa preparation',
              'Post-arrival guidance',
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <CheckCircle2 size={17} className="text-[#C41E3A]" />
                {item}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function MissionOverviewSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid gap-10 rounded-lg border border-gray-100 bg-[#f7f8fb] p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
                <HeartHandshake size={16} />
                Our mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Empowering students, opening global doors
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Our mission is to empower Bangladeshi students with reliable guidance,
                student-centered support, and access to quality higher education opportunities in
                South Korea.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Excellence', 'Integrity', 'Student-centered support'].map((value) => (
                <div key={value} className="rounded-lg bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-[#C41E3A]" />
                  <h3 className="text-sm font-bold text-gray-950">{value}</h3>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-grow">
        <HeroSection />
        <UniversityMarquee />
        <FeaturesSection />
        <MissionOverviewSection />
      </main>

      <Footer />
    </div>
  )
}
