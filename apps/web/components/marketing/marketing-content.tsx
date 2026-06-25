import type { ReactNode } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { FadeUp, FadeUpItem, FadeUpStagger } from '@/components/home/FadeUp'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'

export { contactDetails } from '@/components/marketing/contact-details'

export type FeatureItem = {
  title: string
  description: string
  icon: LucideIcon
}

export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Navbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <section className="border-b border-gray-100 bg-[#f7f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <FadeUp>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">{description}</p>
            <p className="mt-5 inline-flex rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-semibold text-[#C41E3A] shadow-sm">
              Global Vision, Guided Path
            </p>
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export function PageActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="h-12 gap-2 px-6">
        <Link href="/register">
          Apply Now
          <ArrowRight size={18} />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6">
        <Link href="/about">Start Your Journey</Link>
      </Button>
    </div>
  )
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}) {
  return (
    <FadeUp>
      <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-4 text-base leading-7 text-gray-600">{description}</p> : null}
      </div>
    </FadeUp>
  )
}

export function FeatureGrid({ items }: { items: readonly FeatureItem[] }) {
  return (
    <FadeUpStagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" amount={0.14}>
      {items.map((item) => {
        const Icon = item.icon

        return (
          <FadeUpItem key={item.title}>
            <article className="h-full rounded-lg border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
                <Icon size={20} />
              </span>
              <h3 className="text-lg font-bold text-gray-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
            </article>
          </FadeUpItem>
        )
      })}
    </FadeUpStagger>
  )
}

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#C41E3A]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function CtaBand({
  title = 'Ready to study in South Korea?',
  description = 'Start with a focused consultation and a clear plan for your next step.',
}: {
  title?: string
  description?: string
}) {
  return (
    <section className="bg-gray-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-200">
                Global Vision, Guided Path
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
              <p className="mt-4 text-base leading-7 text-gray-300">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="white" className="h-12 gap-2 px-6">
                <Link href="/register">
                  Apply Now
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 border border-white/20 bg-white/10 px-6 text-white hover:bg-white/15"
              >
                <Link href="/about">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
