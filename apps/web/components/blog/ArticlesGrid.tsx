'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User, Calendar } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'Complete Guide to Studying in South Korea',
    description: 'Comprehensive guide covering everything from visa requirements to finding housing and adjusting to student life.',
    image: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=600&h=400&fit=crop',
    category: 'Study Abroad',
    author: 'Endow Team',
    date: '2024-06-01',
    readTime: '8 min',
    featured: true
  },
  {
    id: 2,
    title: 'GKS Scholarship Application Tips',
    description: 'Insider tips and strategies to maximize your chances of getting accepted to the Global Korea Scholarship.',
    image: 'https://images.unsplash.com/photo-1523050854058-f47bcaf00980?w=600&h=400&fit=crop',
    category: 'Scholarships',
    author: 'Scholarship Expert',
    date: '2024-05-28',
    readTime: '5 min',
    featured: true
  },
  {
    id: 3,
    title: 'Korean D-10 Visa Guide for Students',
    description: 'Everything you need to know about the student residence visa, including requirements and the application process.',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
    category: 'Visa Guide',
    author: 'Immigration Expert',
    date: '2024-05-25',
    readTime: '6 min',
    featured: true
  },
  {
    id: 4,
    title: 'Student Life at Hanseo University',
    description: 'Discover campus facilities, student culture, and what makes Hanseo University a great place to study.',
    image: 'https://images.unsplash.com/photo-1523318323282-e5b51eea6a79?w=600&h=400&fit=crop',
    category: 'University News',
    author: 'Campus Reporter',
    date: '2024-05-22',
    readTime: '7 min'
  },
  {
    id: 5,
    title: 'Cost of Living in Seoul vs Busan',
    description: 'Detailed breakdown of monthly expenses for students living in Korea\'s major cities.',
    image: 'https://images.unsplash.com/photo-1461749280684-ddefd3083d60?w=600&h=400&fit=crop',
    category: 'Study Abroad',
    author: 'Budget Advisor',
    date: '2024-05-20',
    readTime: '4 min'
  },
  {
    id: 6,
    title: 'Success Story: From Bangladesh to Seoul',
    description: 'Meet Raiyan, who secured a full scholarship and is now pursuing his MBA at a top Korean university.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'Success Stories',
    author: 'Endow Stories',
    date: '2024-05-18',
    readTime: '3 min'
  },
  {
    id: 7,
    title: 'Korean Restaurants for International Students',
    description: 'Budget-friendly Korean dining spots loved by students. Learn local food culture.',
    image: 'https://images.unsplash.com/photo-1504674900152-b8b613e4f92b?w=600&h=400&fit=crop',
    category: 'Student Life',
    author: 'Lifestyle Writer',
    date: '2024-05-15',
    readTime: '5 min'
  },
  {
    id: 8,
    title: 'Career Opportunities After Graduation',
    description: 'Explore job markets, visa sponsorship, and career pathways for international graduates.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    category: 'Career',
    author: 'Career Coach',
    date: '2024-05-12',
    readTime: '9 min'
  },
  {
    id: 9,
    title: 'Statement of Purpose Template & Guide',
    description: 'Download and use our proven SOP template to write a compelling statement for your applications.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    category: 'Resources',
    author: 'Academic Advisor',
    date: '2024-05-10',
    readTime: '6 min'
  }
]

type ArticleCategory = (typeof articles)[number]['category']

const categoryColors: Record<ArticleCategory, string> = {
  'Scholarships': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Visa Guide': 'bg-[#F8FAFC] text-[#111827]',
  'Study Abroad': 'bg-[#FEF2F2] text-[#C41E3A]',
  'University News': 'bg-[#F8FAFC] text-[#111827]',
  'Student Life': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Success Stories': 'bg-[#F8FAFC] text-[#111827]',
  'Career': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Resources': 'bg-[#FEF2F2] text-[#C41E3A]',
  'Company Updates': 'bg-[#F8FAFC] text-[#111827]',
}

type ArticlesGridProps = {
  category: string
}

export function ArticlesGrid({ category }: ArticlesGridProps) {
  const filteredArticles = category === 'All Articles' 
    ? articles 
    : articles.filter(article => article.category === category)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      className="grid grid-cols-1 gap-8"
    >
      {filteredArticles.map((article, index) => (
        <motion.article
          key={article.id}
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="group rounded-xl overflow-hidden bg-white border border-[#E5E7EB] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* IMAGE */}
            <div className="md:col-span-1 relative h-64 md:h-full overflow-hidden bg-[#F8FAFC]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="md:col-span-2 p-8 flex flex-col justify-between">
              <div>
                {/* CATEGORY */}
                <div className="mb-4">
                  <span className={`inline-flex h-10 items-center px-4 rounded-full text-sm font-semibold border border-[#E5E7EB] ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold text-[#111827] mb-3 group-hover:text-[#C41E3A] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-base text-[#6B7280] leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              {/* META & CTA */}
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>

                <button className="flex items-center gap-2 text-base text-[#C41E3A] font-semibold group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
