'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeUp } from '@/components/home/FadeUp'

const faqs = [
  { q: 'Is Endow Global free for students?', a: 'Yes. Our core services — university matching, course discovery, and counselor consultations — are completely free for students. We earn from university partnerships, not from you.' },
  { q: 'Which countries can I apply to?', a: "We specialize in South Korea and Australia — two of the best destinations for international students. Both offer world-class universities, generous scholarships, and post-study work opportunities." },
  { q: 'How does the AI course matching work?', a: 'Our AI analyzes your academic background, career goals, budget, and preferences — then matches you against 50+ partner universities and hundreds of programs in South Korea and Australia to find the best fits.' },
  { q: 'What documents do I need to apply?', a: "Typically you'll need academic transcripts, a passport copy, English proficiency scores (IELTS/TOEFL), a statement of purpose, and recommendation letters. Requirements vary by university." },
  { q: 'How long does the application process take?', a: 'From initial consultation to departure, the average timeline is 3-4 months. This includes university selection, application submission, offer acceptance, and visa processing.' },
  { q: 'Do you help with visa applications?', a: 'Absolutely. We provide complete visa support including document preparation, mock interview coaching, and embassy coordination. Our visa success rate is over 98%.' },
  { q: 'Can I apply to multiple universities at once?', a: 'Yes. We recommend applying to 3-5 universities to maximize your chances. Our counselors will help you build a balanced list of reach, match, and safety schools.' },
  { q: 'What if my application gets rejected?', a: "We'll analyze the rejection, strengthen your application, and help you reapply or pivot to alternative universities. Our goal is to ensure you get accepted somewhere that's the right fit." },
] as const

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={isOpen}>
        <span className="text-[15px] font-semibold text-gray-900">{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-sm leading-relaxed text-gray-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQAccordion() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A] shadow-sm">FAQ</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Common <span className="text-gradient-brand">questions</span>
            </h2>
          </div>
        </FadeUp>
        <FadeUp>
          <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
