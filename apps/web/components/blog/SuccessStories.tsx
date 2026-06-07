'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useState } from 'react'

const stories = [
  {
    name: 'Raiyan Ahmed',
    university: 'Seoul National University',
    country: 'South Korea',
    scholarship: 'Full Tuition + Monthly Stipend',
    story:
      'Securing my place at SNU with a full scholarship has been a dream come true. The Endow team guided me through every step of the application process.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    rating: 5,
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
  },
]

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextStory = () => setActiveIndex((activeIndex + 1) % stories.length)
  const prevStory = () => setActiveIndex((activeIndex - 1 + stories.length) % stories.length)

  return (
    <section className="relative overflow-hidden border-y border-[#E5E7EB] bg-[#F8FAFC] py-24 lg:py-32">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute right-0 top-1/2 -mr-96 h-96 w-96 rounded-full bg-[#FEF2F2] opacity-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">
            Student Success Stories
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Real students, real achievements, real dreams realized
          </p>
        </motion.div>

        {/* CAROUSEL */}
        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT - IMAGE & DETAILS */}
              <div className="relative flex h-96 flex-col justify-center bg-[#FEF2F2] p-8 lg:h-full lg:p-12">
                <div className="relative mx-auto mb-8 h-40 w-40 overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Image
                    src={stories[activeIndex].image}
                    alt={stories[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center">
                  <h3 className="mb-2 text-2xl font-bold text-[#111827]">
                    {stories[activeIndex].name}
                  </h3>
                  <p className="mb-4 text-base text-[#6B7280]">{stories[activeIndex].university}</p>

                  {/* RATING */}
                  <div className="mb-6 flex justify-center gap-1">
                    {Array.from({ length: stories[activeIndex].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#C41E3A] text-[#C41E3A]" />
                    ))}
                  </div>

                  {/* SCHOLARSHIP */}
                  <div className="inline-flex h-10 items-center rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#C41E3A]">
                    {stories[activeIndex].scholarship}
                  </div>
                </div>
              </div>

              {/* RIGHT - STORY */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <Quote className="mb-6 h-12 w-12 text-[#FEF2F2]" />

                <p className="mb-8 text-2xl font-bold leading-relaxed text-[#111827] lg:text-3xl">
                  "{stories[activeIndex].story}"
                </p>

                <div className="mb-8 flex items-center gap-2 text-[#6B7280]">
                  <div className="h-1 w-12 bg-[#C41E3A]" />
                  <span className="font-semibold">{stories[activeIndex].country}</span>
                </div>

                {/* DETAILS */}
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm text-[#6B7280]">University</p>
                    <p className="font-bold text-[#111827]">{stories[activeIndex].university}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-[#6B7280]">Achievement</p>
                    <p className="font-bold text-[#111827]">{stories[activeIndex].scholarship}</p>
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
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-[#C41E3A]' : 'bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStory}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white transition-all hover:border-red-200 hover:bg-[#FEF2F2]"
              >
                <ChevronLeft className="h-5 w-5 text-[#111827]" />
              </motion.button>
              <motion.button
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
