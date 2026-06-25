import type { Metadata } from 'next'
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Handshake,
  Home,
  ShieldCheck,
  Users,
} from 'lucide-react'

import {
  CheckList,
  CtaBand,
  FeatureGrid,
  MarketingPageShell,
  PageActions,
  PageHero,
  SectionIntro,
} from '@/components/marketing/marketing-content'

export const metadata: Metadata = {
  title: 'Why Endow Global',
  description:
    'Learn why Bangladeshi students trust Endow Global Education for personalized guidance, visa support, scholarships, and post-arrival support in South Korea.',
}

const keyStrengths = [
  {
    icon: Users,
    title: 'Personalized guidance',
    description:
      'We identify best-fit programs and universities based on your academic profile, goals, and interests.',
  },
  {
    icon: Globe2,
    title: 'University partnerships',
    description:
      'We work with South Korean university pathways to help students access strong opportunities across fields of study.',
  },
  {
    icon: ShieldCheck,
    title: 'Expert team support',
    description:
      'Our consultants understand South Korea education pathways, visa requirements, and student preparation needs.',
  },
  {
    icon: Award,
    title: 'Scholarship guidance',
    description:
      'We help you explore relevant scholarship options and prepare stronger applications where available.',
  },
  {
    icon: FileCheck2,
    title: 'Visa process clarity',
    description:
      'We simplify documentation, timelines, and submission steps so you can move forward with confidence.',
  },
  {
    icon: Home,
    title: 'Post-arrival support',
    description:
      'From accommodation guidance to cultural orientation, we help you prepare for student life in South Korea.',
  },
] as const

const differences = [
  'Student-centered advice shaped around your goals and circumstances.',
  'End-to-end support from first inquiry to post-arrival preparation.',
  'Transparent guidance that helps families make informed decisions.',
  'A commitment to excellence, integrity, and long-term student success.',
] as const

export default function WhyEndowGlobalPage() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Your trusted education partner"
        title="Why students choose Endow Global Education"
        description="We go beyond consultancy to become a reliable partner in shaping a successful academic future in South Korea."
      >
        <PageActions />
      </PageHero>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9">
            <SectionIntro
              eyebrow="Our key strengths"
              title="Support for every major step"
              description="Our service model is built for students who need clear answers, organized steps, and trustworthy guidance before making a major international decision."
            />
          </div>
          <FeatureGrid items={keyStrengths} />
        </div>
      </section>

      <section className="bg-[#f7f8fb] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:items-start">
          <SectionIntro
            eyebrow="What makes us different"
            title="A guided path, not a rushed process"
            description="Your dream of studying in South Korea is within reach. We help you understand the work, prepare the details, and keep moving with confidence."
          />
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
                <ClipboardCheck size={20} />
              </span>
              <h3 className="text-xl font-bold text-gray-950">Our promise to students</h3>
            </div>
            <CheckList items={differences} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: CheckCircle2, title: 'Clear next steps' },
              { icon: Handshake, title: 'Family-aware support' },
              { icon: ShieldCheck, title: 'Reliable process control' },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.title} className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-5">
                  <Icon className="mb-3 h-6 w-6 text-[#C41E3A]" />
                  <h3 className="font-bold text-gray-950">{item.title}</h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand title="Let us begin your journey" />
    </MarketingPageShell>
  )
}
