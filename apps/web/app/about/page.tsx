import type { Metadata } from 'next'
import {
  Award,
  Compass,
  GraduationCap,
  Handshake,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react'

import {
  CtaBand,
  FeatureGrid,
  MarketingPageShell,
  PageActions,
  PageHero,
  SectionIntro,
} from '@/components/marketing/marketing-content'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet Endow Global Education, a student-centered education consultancy helping Bangladeshi students pursue higher education in South Korea.',
}

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We aim for high-quality guidance, clear communication, and strong outcomes for every student.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'We provide honest advice, transparent processes, and realistic expectations from the first consultation.',
  },
  {
    icon: HeartHandshake,
    title: 'Student-centered support',
    description:
      'Every recommendation begins with the student: academic goals, family context, finances, and future plans.',
  },
] as const

const supportSteps = [
  {
    icon: Compass,
    title: 'Direction before decisions',
    description:
      'We help students understand their options before they commit to a university, program, or intake.',
  },
  {
    icon: GraduationCap,
    title: 'South Korea focus',
    description:
      'Our work is built around the needs of Bangladeshi students planning higher education in South Korea.',
  },
  {
    icon: Handshake,
    title: 'Guidance that stays close',
    description:
      'From your first inquiry to post-arrival preparation, our team keeps the process clear and manageable.',
  },
] as const

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="About Endow Global Education"
        title="Your trusted guide to South Korean higher education"
        description="We help Bangladeshi students turn study abroad ambition into a clear, supported plan for universities in South Korea."
      >
        <PageActions />
      </PageHero>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionIntro
              eyebrow="Who we are"
              title="Empowering dreams, one student at a time"
              description="Endow Global Education is more than an education consultancy. We are a trusted partner for students and families navigating one of the most important decisions of their lives."
            />

            <div className="space-y-5 text-base leading-7 text-gray-600">
              <p>
                Endow Global Education was founded to bridge the gap between aspiration
                and opportunity. We specialize in guiding Bangladeshi students who want
                to pursue higher studies in South Korea, with support that is practical,
                transparent, and personal.
              </p>
              <p>
                Every student arrives with a different academic background, budget,
                timeline, and dream. Our role is to understand that full picture, then
                guide the student through program selection, university applications,
                visa preparation, and the realities of moving into a new academic culture.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {supportSteps.map((step) => {
              const Icon = step.icon

              return (
                <article
                  key={step.title}
                  className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-5"
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#C41E3A] shadow-sm">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-gray-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fb] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9">
            <SectionIntro
              eyebrow="Our values"
              title="Clear thinking makes a bright future"
              description="Our values shape the way we advise, communicate, and support each student from Bangladesh to South Korea."
            />
          </div>
          <FeatureGrid items={values} />
        </div>
      </section>

      <CtaBand
        title="Let us help you plan your South Korea study journey"
        description="Start with a focused conversation about your goals, eligibility, timeline, and next best step."
      />
    </MarketingPageShell>
  )
}
