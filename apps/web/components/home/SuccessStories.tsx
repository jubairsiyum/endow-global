import { Star, Quote } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const stories = [
  {
    name: 'Priya Sharma',
    country: 'South Korea',
    university: 'Kyung Hee University',
    quote:
      'Endow Global made my dream of studying in Korea a reality. The counselors helped me navigate scholarships I didn\'t even know existed. I saved over $8,000 in tuition.',
    rating: 5,
    initials: 'PS',
    bg: 'bg-rose-50',
    color: 'text-[#C41E3A]',
  },
  {
    name: 'Maria Santos',
    country: 'Australia',
    university: 'University of Melbourne',
    quote:
      'From university selection to visa prep, every step was handled professionally. The counselor support was incredible — they reviewed my SOP three times.',
    rating: 5,
    initials: 'MS',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
  },
  {
    name: 'Jun-seo Park',
    country: 'South Korea',
    university: 'Yonsei University',
    quote:
      'I was overwhelmed by the application process. Endow\'s platform organized everything — documents, deadlines, interviews. Now I\'m studying in Seoul!',
    rating: 5,
    initials: 'JP',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
] as const

export default function SuccessStories() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
              <Star size={16} className="text-amber-400" />
              Success Stories
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Students who <span className="text-[#C41E3A]">made it</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500">
              Real stories from real students who transformed their futures with Endow Global.
            </p>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-14 grid gap-6 md:grid-cols-3" amount={0.1}>
          {stories.map((story) => (
            <FadeUpItem key={story.name}>
              <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/50 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote size={24} className="mb-3 text-gray-200" />

                <blockquote className="flex-1 text-sm leading-6 text-gray-600">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>

                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${story.bg} ${story.color}`}
                  >
                    {story.initials}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{story.name}</div>
                    <div className="text-xs text-gray-400">
                      {story.university} · {story.country}
                    </div>
                  </div>
                </div>
              </article>
            </FadeUpItem>
          ))}
        </FadeUpStagger>
      </div>
    </section>
  )
}
