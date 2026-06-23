'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeUp } from '@/components/home/FadeUp'

const faqs = [
  { q: 'How can I apply to study in South Korea or Australia?', a: 'You can apply directly through the university website or with the help of our expert consultants at Endow Global Education. We guide you through the entire admission process — from choosing the right university and program to preparing your documents and submitting your application.' },
  { q: 'Can I work while studying abroad?', a: 'Yes. In South Korea, international students can work part-time up to 20 hours per week during semesters and unlimited hours during vacations with immigration permission. In Australia, student visa holders can work up to 48 hours per fortnight during term time and unlimited hours during scheduled breaks.' },
  { q: 'What are the student visa requirements for South Korea and Australia?', a: 'For South Korea, you typically need an admission letter, bank statement, passport, medical checkup, and academic documents for a D-2 (degree) or D-4 (language) visa. For Australia, you need a Confirmation of Enrolment (CoE), proof of financial capacity, English proficiency scores, and health insurance (OSHC). Requirements vary by university and program.' },
  { q: 'What are the tuition fees for international students?', a: 'In South Korea, tuition typically ranges from $3,000 to $8,000 per semester for undergraduate programs and $4,000 to $12,000 for graduate programs. In Australia, undergraduate fees range from AUD 20,000 to 45,000 per year, and postgraduate from AUD 22,000 to 50,000. Many universities offer generous scholarships to reduce these costs.' },
  { q: 'Can I get a scholarship to study in South Korea or Australia?', a: 'Absolutely. South Korea offers the prestigious GKS (Global Korea Scholarship) covering full tuition, living expenses, and airfare. Many Korean universities also provide merit-based scholarships. In Australia, universities offer international merit scholarships, research grants, and government-funded awards like Australia Awards and Destination Australia.' },
  { q: 'How long does the visa process take?', a: 'For South Korea, visa processing usually takes 4 to 8 weeks depending on the embassy and application volume. For Australia, the student visa (subclass 500) typically takes 4 to 12 weeks. We recommend applying early to avoid delays, and our team ensures your paperwork is complete to speed up the process.' },
  { q: 'Do I need to know Korean or learn English to study abroad?', a: 'It depends on the program. Many South Korean universities offer courses taught entirely in English, especially at the graduate level. For Korean-taught programs, TOPIK (Korean Proficiency Test) may be required. In Australia, all programs are in English, and you will need IELTS, TOEFL, or PTE scores as proof of proficiency.' },
  { q: 'What accommodation options are available for international students?', a: 'In South Korea, most universities offer affordable on-campus dormitories. Students can also rent apartments or share rooms outside campus. In Australia, options include university-managed residences, private student accommodations, homestays, and shared apartments. We help you find the best option based on your budget and preferences.' },
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
