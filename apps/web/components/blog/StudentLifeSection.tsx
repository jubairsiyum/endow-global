'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Home, Utensils, Bus, Briefcase } from 'lucide-react'

const studentLifeCards = [
  {
    icon: Home,
    title: 'Dormitory Life',
    description:
      'Experience campus dorm culture, community living, and lifelong friendships with fellow students from around the world.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Utensils,
    title: 'Food & Culture',
    description:
      'Explore authentic Korean cuisine, campus cafeteria experiences, and cultural food festivals throughout the year.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Bus,
    title: 'Transportation',
    description:
      'Navigate Korea easily with local buses, trains, and the convenient T-money card system for students.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
  },
  {
    icon: Briefcase,
    title: 'Part-Time Jobs',
    description:
      'Opportunities to work on campus or off-campus with proper visa authorization and competitive hourly wages.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
  },
]

export function StudentLifeSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#111827] lg:text-5xl">
            Student Life in Korea
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#6B7280]">
            Everything you need to know about living as an international student
          </p>
        </motion.div>

        {/* CARDS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {studentLifeCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden bg-[#F8FAFC]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#C41E3A] opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  <div
                    className={`h-12 w-12 rounded-lg ${card.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-[#111827]">{card.title}</h3>
                  <p className="text-base leading-relaxed text-[#6B7280]">{card.description}</p>

                  <button className="mt-6 flex items-center gap-1 text-base font-semibold text-[#C41E3A] transition-all hover:gap-2 group-hover:translate-x-1">
                    Learn More <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
