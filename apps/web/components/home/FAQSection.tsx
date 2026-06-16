'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeUp } from '@/components/home/FadeUp'

const faqs = [
  {
    question: 'Is Endow Global free for students?',
    answer:
      'Yes. Our core services — university matching, course discovery, and counselor consultations — are completely free for students. We earn from university partnerships, not from you.',
  },
  {
    question: 'Which countries can I apply to?',
    answer:
      'We currently support applications to South Korea, the United Kingdom, Finland, Australia, the United States, and Canada. We\'re expanding to more destinations every year.',
  },
  {
    question: 'How does the AI course matching work?',
    answer:
      'Our AI analyzes your academic background, career goals, budget, and preferences — then matches you against 500+ universities and thousands of programs to find the best fits.',
  },
  {
    question: 'What documents do I need to apply?',
    answer:
      'Typically you\'ll need academic transcripts, a passport copy, English proficiency scores (IELTS/TOEFL), a statement of purpose, and recommendation letters. Requirements vary by university and country.',
  },
  {
    question: 'How long does the application process take?',
    answer:
      'From initial consultation to departure, the average timeline is 3-4 months. This includes university selection, application submission, offer acceptance, and visa processing.',
  },
  {
    question: 'Do you help with visa applications?',
    answer:
      'Absolutely. We provide complete visa support including document preparation, mock interview coaching, and embassy coordination. Our visa success rate is over 98%.',
  },
  {
    question: 'Can I apply to multiple universities at once?',
    answer:
      'Yes. We recommend applying to 3-5 universities to maximize your chances. Our counselors will help you build a balanced list of reach, match, and safety schools.',
  },
  {
    question: 'What if my application gets rejected?',
    answer:
      'We\'ll analyze the rejection, strengthen your application, and help you reapply or pivot to alternative universities. Our goal is to ensure you get accepted somewhere that\'s the right fit.',
  },
] as const

function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-gray-900">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-6 text-gray-500">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section className="bg-[#f7f8fb] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Frequently asked <span className="text-[#C41E3A]">questions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500">
              Everything you need to know about studying abroad with Endow Global.
            </p>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
