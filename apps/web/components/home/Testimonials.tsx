import { Star, Quote } from 'lucide-react'
import { FadeUp, FadeUpStagger, FadeUpItem } from '@/components/home/FadeUp'

const stories = [
  { name: 'Priya Sharma', uni: 'Kyung Hee University', program: 'MBA', country: 'South Korea', quote: "Endow Global made my dream of studying in Korea a reality. The counselors helped me navigate scholarships I didn't even know existed.", rating: 5, initials: 'PS', gradient: 'from-rose-400 to-pink-500' },
  { name: 'Ahmed Hassan', uni: 'Univ. of Manchester', program: 'Computer Science', country: 'UK', quote: "From university selection to visa prep, every step was handled professionally. The AI matching found perfect programs.", rating: 5, initials: 'AH', gradient: 'from-blue-400 to-indigo-500' },
  { name: 'Li Wei', uni: 'Aalto University', program: 'Design Engineering', country: 'Finland', quote: "I was overwhelmed by the application process. Endow's platform organized everything — documents, deadlines, interviews.", rating: 5, initials: 'LW', gradient: 'from-cyan-400 to-blue-500' },
  { name: 'Maria Santos', uni: 'Univ. of Melbourne', program: 'Data Science', country: 'Australia', quote: "The counselor support was incredible. They reviewed my SOP three times and helped me ace the visa interview.", rating: 5, initials: 'MS', gradient: 'from-amber-400 to-orange-500' },
  { name: 'James Kim', uni: 'UC Berkeley', program: 'Electrical Engineering', country: 'USA', quote: "I applied to 5 universities through Endow and got into 3. The platform made it so easy to track everything.", rating: 5, initials: 'JK', gradient: 'from-violet-400 to-purple-500' },
  { name: 'Fatima Al-Rashid', uni: 'Univ. of Toronto', program: 'Public Health', country: 'Canada', quote: "The scholarship guidance alone was worth it. Endow helped me find and apply to 4 scholarships — I got 2 of them.", rating: 5, initials: 'FA', gradient: 'from-emerald-400 to-teal-500' },
] as const

export default function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
              <Star size={14} className="fill-[#C41E3A] text-[#C41E3A]" />
              Student Stories
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Trusted by students <span className="text-gradient-brand">worldwide</span>
            </h2>
          </div>
        </FadeUp>

        <FadeUpStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.08}>
          {stories.map((s) => (
            <FadeUpItem key={s.name}>
              <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: s.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote size={20} className="mb-2 text-gray-200" />
                <blockquote className="flex-1 text-[13px] leading-relaxed text-gray-600">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${s.gradient} text-xs font-bold text-white`}>
                    {s.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900">{s.name}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>{s.program}</span>
                      <span>·</span>
                      <span>{s.uni}</span>
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
