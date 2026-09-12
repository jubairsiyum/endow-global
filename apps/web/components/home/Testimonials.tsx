'use client'

import { trpc } from '@/lib/trpc-client'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const fallbackStories = [
  { name: 'Priya Sharma', university: 'Kyung Hee University', program: 'MBA', country: 'South Korea', quote: "Endow Global made my dream of studying in Korea a reality. The counselors helped me navigate scholarships I didn't even know existed.", rating: 5, initials: 'PS' },
  { name: 'Maria Santos', university: 'Univ. of Melbourne', program: 'Data Science', country: 'Australia', quote: 'The counselor support was incredible. They reviewed my SOP three times and helped me ace the visa interview.', rating: 5, initials: 'MS' },
  { name: 'Jun-seo Park', university: 'Yonsei University', program: 'International Business', country: 'South Korea', quote: "From university selection to visa prep, every step was handled professionally. The AI matching found programs I hadn't considered.", rating: 5, initials: 'JP' },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#C41E3A]" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C41E3A] sm:text-xs">
        {children}
      </span>
    </div>
  )
}

export default function Testimonials() {
  const { data } = trpc.testimonial.published.useQuery()

  const stories = data && data.length > 0
    ? data.map((t) => ({
        name: t.name,
        university: t.university,
        program: t.program,
        country: t.country,
        quote: t.quote,
        rating: t.rating,
        initials: t.initials,
      }))
    : fallbackStories

  const featured = stories[0]
  const rest = stories.slice(1, 3)

  return (
    <section id="stories" className="scroll-mt-24 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <FadeUp>
          <div className="max-w-2xl">
            <Eyebrow>Student stories</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
              Trusted by students <span style={{ color: '#C41E3A' }}>worldwide</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#4b5563] sm:text-lg">
              Students from different backgrounds trust us to guide their journey to studying
              abroad.
            </p>
          </div>
        </FadeUp>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Featured testimonial */}
          {featured && (
            <FadeUp>
              <figure className="flex h-full flex-col justify-center border-l-2 border-[#C41E3A]/20 pl-6 sm:pl-8">
                <span className="font-display text-7xl leading-[0.6]" style={{ color: '#C41E3A' }}>
                  &ldquo;
                </span>
                <blockquote className="mt-6 font-display text-2xl font-medium leading-snug text-[#0E1116] sm:text-[28px]">
                  {featured.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0E1116] font-display text-base font-semibold text-white">
                    {featured.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0E1116]">{featured.name}</div>
                    <div className="text-sm text-[#6b7280]">
                      {featured.program}
                      {featured.university ? ` · ${featured.university}` : ''}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </FadeUp>
          )}

          {/* Smaller testimonials */}
          <div className="flex flex-col gap-10 lg:gap-12">
            <FadeUpStagger className="flex flex-col gap-10 lg:gap-12">
              {rest.map((story) => (
                <FadeUpItem key={story.name}>
                  <figure className="border-t border-black/10 pt-7">
                    <blockquote className="text-base leading-relaxed text-[#3f4752] sm:text-[17px]">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0E1116] font-display text-sm font-semibold text-white">
                        {story.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0E1116]">{story.name}</div>
                        <div className="text-sm text-[#6b7280]">
                          {story.university}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </FadeUpItem>
              ))}
            </FadeUpStagger>
          </div>
        </div>
      </div>
    </section>
  )
}
