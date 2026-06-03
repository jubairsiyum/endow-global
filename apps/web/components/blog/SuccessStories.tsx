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
    story: 'Securing my place at SNU with a full scholarship has been a dream come true. The Endow team guided me through every step of the application process.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    rating: 5
  },
  {
    name: 'Fatema Islam',
    university: 'Hanseo University',
    country: 'South Korea',
    scholarship: '50% Tuition Scholarship',
    story: 'The personalized mentoring and SOP assistance helped me stand out from thousands of applicants. Now living my best student life in Korea!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    rating: 5
  },
  {
    name: 'Mohammad Hassan',
    university: 'Daejin University',
    country: 'South Korea',
    scholarship: 'GKS Scholarship',
    story: 'The Endow platform made finding the right university and scholarship so much easier. Their resources were invaluable in my preparation.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    rating: 5
  },
  {
    name: 'Nadia Karim',
    university: 'Busan University',
    country: 'South Korea',
    scholarship: 'Partial Scholarship + Work Study',
    story: 'The career pathway guidance and networking opportunities have opened so many doors. I\'m now on track for my dream career.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    rating: 5
  }
]

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextStory = () => setActiveIndex((activeIndex + 1) % stories.length)
  const prevStory = () => setActiveIndex((activeIndex - 1 + stories.length) % stories.length)

  return (
    <section className="relative py-24 lg:py-32 bg-[#F8FAFC] overflow-hidden border-y border-[#E5E7EB]">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 right-0 -mr-96 w-96 h-96 rounded-full bg-[#FEF2F2] blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#111827] mb-4">Student Success Stories</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">Real students, real achievements, real dreams realized</p>
        </motion.div>

        {/* CAROUSEL */}
        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl bg-white border border-[#E5E7EB] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT - IMAGE & DETAILS */}
              <div className="relative h-96 lg:h-full bg-[#FEF2F2] p-8 lg:p-12 flex flex-col justify-center">
                <div className="relative w-40 h-40 mx-auto mb-8 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Image
                    src={stories[activeIndex].image}
                    alt={stories[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">
                    {stories[activeIndex].name}
                  </h3>
                  <p className="text-base text-[#6B7280] mb-4">{stories[activeIndex].university}</p>

                  {/* RATING */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: stories[activeIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#C41E3A] text-[#C41E3A]" />
                    ))}
                  </div>

                  {/* SCHOLARSHIP */}
                  <div className="inline-flex h-10 items-center px-4 rounded-full bg-white text-[#C41E3A] text-sm font-semibold border border-[#E5E7EB]">
                    {stories[activeIndex].scholarship}
                  </div>
                </div>
              </div>

              {/* RIGHT - STORY */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Quote className="w-12 h-12 text-[#FEF2F2] mb-6" />

                <p className="text-2xl lg:text-3xl font-bold text-[#111827] mb-8 leading-relaxed">
                  "{stories[activeIndex].story}"
                </p>

                <div className="flex items-center gap-2 text-[#6B7280] mb-8">
                  <div className="w-12 h-1 bg-[#C41E3A]" />
                  <span className="font-semibold">{stories[activeIndex].country}</span>
                </div>

                {/* DETAILS */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">University</p>
                    <p className="font-bold text-[#111827]">{stories[activeIndex].university}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Achievement</p>
                    <p className="font-bold text-[#111827]">{stories[activeIndex].scholarship}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CAROUSEL CONTROLS */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-colors ${
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
                className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:border-red-200 hover:bg-[#FEF2F2] transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#111827]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStory}
                className="w-12 h-12 rounded-full bg-[#C41E3A] text-white flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
