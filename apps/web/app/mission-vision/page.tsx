import type { Metadata } from 'next'
import { Compass, Globe2, GraduationCap, Lightbulb, Network, ShieldCheck } from 'lucide-react'

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
  title: 'Mission & Vision',
  description:
    'Explore the mission and vision guiding Endow Global Education as it supports Bangladeshi students pursuing higher education in South Korea.',
}

const missionPoints = [
  'Help students confidently pursue higher education in South Korea.',
  'Provide personalized guidance for university and program selection.',
  'Simplify admissions, documentation, and visa preparation.',
  'Remove barriers through transparent and reliable support.',
  'Promote excellence, integrity, and inclusivity in every service we provide.',
] as const

const visionPoints = [
  'Be the first choice for students seeking to study in South Korea.',
  'Build strong relationships with leading South Korean universities.',
  'Continuously improve our services to meet evolving student needs.',
  'Create a global network of successful alumni who inspire future generations.',
  'Be recognized for excellence, integrity, and student satisfaction.',
] as const

const principles = [
  {
    icon: GraduationCap,
    title: 'Student futures',
    description:
      'We focus on academic choices that support each student beyond admission and into long-term growth.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted process',
    description:
      'We make complex requirements easier to understand through transparent steps and reliable communication.',
  },
  {
    icon: Network,
    title: 'Global opportunity',
    description:
      'We connect Bangladeshi students with South Korean education pathways that can shape brighter futures.',
  },
] as const

export default function MissionVisionPage() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Mission & vision"
        title="Shaping futures, one student at a time"
        description="Our mission and vision guide every decision we make, from the advice we give to the support we provide after admission."
      >
        <PageActions />
      </PageHero>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#C41E3A] shadow-sm">
                <Compass size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
                  Empowering student futures
                </p>
                <h2 className="text-2xl font-bold text-gray-950">Our Mission</h2>
              </div>
            </div>
            <p className="mb-6 text-base leading-7 text-gray-600">
              To empower Bangladeshi students by connecting them with world-class
              educational opportunities in South Korea through personalized guidance,
              simplified processes, and consistent support.
            </p>
            <CheckList items={missionPoints} />
          </article>

          <article className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#C41E3A] shadow-sm">
                <Globe2 size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
                  Building global opportunities
                </p>
                <h2 className="text-2xl font-bold text-gray-950">Our Vision</h2>
              </div>
            </div>
            <p className="mb-6 text-base leading-7 text-gray-600">
              To become the leading education consultancy in Bangladesh, known for
              excellence, integrity, innovation, and unmatched student satisfaction.
            </p>
            <CheckList items={visionPoints} />
          </article>
        </div>
      </section>

      <section className="bg-[#f7f8fb] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9">
            <SectionIntro
              eyebrow="Our foundation"
              title="What guides our work"
              description="These principles keep our consulting work focused, practical, and aligned with student success."
            />
          </div>
          <FeatureGrid
            items={[
              ...principles,
              {
                icon: Lightbulb,
                title: 'Continuous improvement',
                description:
                  'We keep improving our services as student needs, university requirements, and opportunities evolve.',
              },
            ]}
          />
        </div>
      </section>

      <CtaBand
        title="Build your plan with a team that knows the path"
        description="Tell us where you are now, and we will help you understand the steps ahead."
      />
    </MarketingPageShell>
  )
}
