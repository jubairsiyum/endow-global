'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote, Award } from 'lucide-react'
import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'

const defaultStories = [
  {
    name: 'Raiyan Ahmed',
    university: 'Seoul National University',
    country: 'South Korea',
    scholarship: 'Full Tuition + Monthly Stipend',
    story:
      'Securing my place at SNU with a full scholarship has been a dream come true. The Endow team guided me through every step of the application process.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    rating: 5,
    initials: 'RA',
  },
  {
    name: 'Fatema Islam',
    university: 'Hanseo University',
    country: 'South Korea',
    scholarship: '50% Tuition Scholarship',
    story:
      'The personalized mentoring and SOP assistance helped me stand out from thousands of applicants. Now living my best student life in Korea!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    rating: 5,
    initials: 'FI',
  },
  {
    name: 'Mohammad Hassan',
    university: 'Daejin University',
    country: 'South Korea',
    scholarship: 'GKS Scholarship',
    story:
      'The Endow platform made finding the right university and scholarship so much easier. Their resources were invaluable in my preparation.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    rating: 5,
    initials: 'MH',
  },
  {
    name: 'Nadia Karim',
    university: 'Busan University',
    country: 'South Korea',
    scholarship: 'Partial Scholarship + Work Study',
    story:
      "The career pathway guidance and networking opportunities have opened so many doors. I'm now on track for my dream career.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    rating: 5,
    initials: 'NK',
  },
]

const avatarImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop',
]

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: testimonials } = trpc.testimonial.published.useQuery()

  const stories = (testimonials && testimonials.length > 0)
    ? testimonials.map((t, idx) => ({
        name: t.name,
        university: t.university,
        country: t.country,
        scholarship: t.program || 'Student Scholarship',
        story: t.quote,
        rating: t.rating || 5,
        initials: t.initials || t.name.slice(0, 2).toUpperCase(),
        image: avatarImages[idx % avatarImages.length],
      }))
    : defaultStories

  const safeIndex = stories.length > 0 ? activeIndex % stories.length : 0
  const current = stories[safeIndex] || defaultStories[0]

  const nextStory = () => setActiveIndex((safeIndex + 1) % stories.length)
  const prevStory = () => setActiveIndex((safeIndex - 1 + stories.length) % stories.length)

  return (
    <section className="relative overflow-hidden border-y border-[#E5E7EB] bg-[#F8FAFC] py-24 lg:py-32">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute right-0 top-1/2 -mr-96 h-96 w-96 rounded-full bg-[#FEF2F2] opacity-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
            Student Reviews
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Student Reviews & Success Stories
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            Real student reviews and experiences from their journey to studying abroad
          </p>
        </motion.div>

        {/* CAROUSEL */}
        <div className="relative">
          <motion.div
            key={safeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT - IMAGE & DETAILS */}
              <div className="relative flex h-96 flex-col justify-center bg-[#FEF2F2] p-8 lg:h-full lg:p-12">
                <div className="relative mx-auto mb-8 h-40 w-40 overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white flex items-center justify-center">
                  {current.image ? (
                    <Image
                      src={current.image}
                      alt={current.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#C41E3A]">{current.initials}</span>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold text-[#111827]">
                    {current.name}
                  </h3>
                  <p className="mb-4 text-base text-[#6B7280]">{current.university}</p>

                  {/* RATING */}
                  <div className="mb-6 flex justify-center gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#C41E3A] text-[#C41E3A]" />
                    ))}
                  </div>

                  {/* PROGRAM / SCHOLARSHIP */}
                  <div className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#C41E3A]">
                    <Award className="h-4 w-4" />
                    {current.scholarship}
                  </div>
                </div>
              </div>

              {/* RIGHT - STORY */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <Quote className="mb-6 h-12 w-12 text-[#C41E3A]/20" />

                <p className="mb-8 text-xl font-medium leading-relaxed text-[#111827] lg:text-2xl">
                  &ldquo;{current.story}&rdquo;
                </p>

                <div className="mb-8 flex items-center gap-2 text-[#6B7280]">
                  <div className="h-1 w-12 bg-[#C41E3A]" />
                  <span className="font-semibold">{current.country}</span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">University</p>
                    <p className="font-bold text-[#111827]">{current.university}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">Program</p>
                    <p className="font-bold text-[#111827]">{current.scholarship}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CAROUSEL CONTROLS */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <motion.button
                  key={index}
                  aria-label={`Go to story ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === safeIndex ? 'bg-[#C41E3A]' : 'bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                aria-label="Previous story"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStory}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition-all hover:border-red-200 hover:bg-[#FEF2F2]"
              >
                <ChevronLeft className="h-5 w-5 text-[#111827]" />
              </motion.button>
              <motion.button
                aria-label="Next story"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStory}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C41E3A] text-white transition-colors hover:bg-red-700"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
