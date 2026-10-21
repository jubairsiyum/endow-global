'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Home, Utensils, Bus, Briefcase, BookOpen } from 'lucide-react'

export type StudentLifeItem = {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImage?: string | null
  author?: string | null
  publishedAt?: string | Date | null
  category?: string | null
}

const defaultCards = [
  {
    icon: Home,
    title: 'Dormitory Life',
    description:
      'Experience campus dorm culture, community living, and lifelong friendships with fellow students from around the world.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
    href: '/blog/dormitory-life',
  },
  {
    icon: Utensils,
    title: 'Food & Culture',
    description:
      'Explore authentic Korean cuisine, campus cafeteria experiences, and cultural food festivals throughout the year.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
    href: '/blog/food-culture',
  },
  {
    icon: Bus,
    title: 'Transportation',
    description:
      'Navigate Korea easily with local buses, trains, and the convenient T-money card system for students.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
    href: '/blog/transportation',
  },
  {
    icon: Briefcase,
    title: 'Part-Time Jobs',
    description:
      'Opportunities to work on campus or off-campus with proper visa authorization and competitive hourly wages.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    color: 'bg-[#C41E3A]',
    href: '/blog/part-time-jobs',
  },
]

const iconMap = [Home, Utensils, Bus, Briefcase, BookOpen]

export function StudentLifeSection({
  posts,
  onSeeAll,
}: {
  posts?: StudentLifeItem[]
  onSeeAll?: () => void
}) {
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

  const cards = (posts && posts.length > 0)
    ? posts.slice(0, 4).map((p, idx) => ({
        icon: iconMap[idx % iconMap.length],
        title: p.title,
        description: p.description || '',
        image: p.coverImage || defaultCards[idx % defaultCards.length].image,
        color: 'bg-[#C41E3A]',
        href: `/blog/${p.slug}`,
      }))
    : defaultCards

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <div className="text-center sm:text-left">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">
              Student Life
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Student Life in Korea
            </h2>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-gray-500">
              Everything you need to know about living as an international student
            </p>
          </div>

          <Link
            href="/blog?category=Student+Life#articles"
            onClick={onSeeAll}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-[#C41E3A] hover:bg-[#C41E3A]/5 hover:text-[#C41E3A]"
          >
            See All Student Life Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* CARDS GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                {/* IMAGE */}
                <Link href={card.href} className="relative block h-48 overflow-hidden bg-[#F8FAFC]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#C41E3A] opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
                </Link>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div
                    className={`h-12 w-12 rounded-lg ${card.color} mb-4 flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <Link href={card.href}>
                    <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#111827] transition-colors group-hover:text-[#C41E3A]">
                      {card.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-3 text-sm leading-relaxed text-[#6B7280]">{card.description}</p>

                  <Link
                    href={card.href}
                    className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#C41E3A] transition-all hover:gap-2 group-hover:translate-x-1"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
