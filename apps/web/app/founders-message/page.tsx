import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Quote, Sparkles } from 'lucide-react'

import { CtaBand, MarketingPageShell, PageHero } from '@/components/marketing/marketing-content'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: "Founder's Message",
  description:
    'A personal message from Md. Abdullah Al Faruq, Founder of Endow Global Education, for students and parents planning higher education in South Korea.',
}

export default function FoundersMessagePage() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Message from founder"
        title="A personal welcome to students and families"
        description="Beginning a study abroad journey takes courage, trust, and the right guidance. This message shares the purpose behind Endow Global Education."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 gap-2 px-6">
            <Link href="/register">
              Start Your Journey
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6">
            <Link href="/why-endow-global">Why Endow Global</Link>
          </Button>
        </div>
      </PageHero>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
                <Quote size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
                  Founder note
                </p>
                <h2 className="text-2xl font-bold text-gray-950">Dear Students and Parents,</h2>
              </div>
            </div>

            <div className="space-y-5 text-base leading-7 text-gray-700">
              <p>Welcome to Endow Global Education.</p>
              <p>
                I believe education has the power to transform lives, expand perspectives,
                and open doors to meaningful opportunities. Endow Global Education was
                founded with a simple purpose: to help students move from aspiration to
                achievement with clarity, confidence, and trusted support.
              </p>
              <p>
                For many students and families, studying abroad can feel complex. Choosing
                the right program, preparing documents, understanding university
                requirements, and planning for life in a new country all require careful
                guidance. My team and I are here to walk beside you through each step of
                that journey.
              </p>
              <p>
                Our motto, "Global Vision, Guided Path", reflects the promise we make to
                every student. We help you dream globally while giving you the structure,
                direction, and support needed to move forward.
              </p>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-6">
              <p className="text-lg font-bold text-gray-950">Md. Abdullah Al Faruq</p>
              <p className="text-sm font-medium text-gray-600">Founder, Endow Global Education</p>
            </div>
          </article>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-5">
              <BookOpen className="mb-3 h-6 w-6 text-[#C41E3A]" />
              <h3 className="font-bold text-gray-950">Supportive guidance</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                We help students confidently take their first steps toward studying in
                South Korea.
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-[#f7f8fb] p-5">
              <Sparkles className="mb-3 h-6 w-6 text-[#C41E3A]" />
              <h3 className="font-bold text-gray-950">Reliable direction</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                From choosing the right program to navigating applications, we keep the
                path clear.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Take the first step with trusted guidance"
        description="Share your academic goals with our team and start building a realistic plan for South Korea."
      />
    </MarketingPageShell>
  )
}
