'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeUp } from '@/components/home/FadeUp'
import Image from 'next/image'

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

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      viewport={{ once: true }}
      className="group border-b border-gray-100 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#C41E3A]' : 'text-gray-800 group-hover:text-gray-950'}`}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? 'bg-[#C41E3A] text-white shadow-md shadow-[#C41E3A]/20' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
          }`}
        >
          <ChevronDown size={13} />
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
            <p className="pb-4 text-[13px] leading-relaxed text-gray-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6f7fb] py-20 lg:py-28">
      {/* Subtle dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 0.6px, transparent 0.6px)', backgroundSize: '20px 20px' }} />

      {/* Floating accent blobs */}
      <div className="pointer-events-none absolute -left-20 top-[12%] h-64 w-64 rounded-full bg-[#C41E3A]/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-[10%] h-48 w-48 rounded-full bg-[#C41E3A]/[0.02] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — FAQ */}
          <FadeUp>
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C41E3A]/10 bg-[#C41E3A]/[0.04] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Frequently asked{' '}
                <span className="text-gradient-brand">questions</span>
              </h2>
              <p className="mt-3 max-w-md text-sm text-gray-400">
                Everything you need to know about studying in South Korea and Australia.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                {faqs.map((faq, i) => <FAQItem key={faq.q} {...faq} index={i} />)}
              </div>
            </div>
          </FadeUp>

          {/* Right column — image + decorative */}
          <FadeUp>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-lg shadow-gray-200/60">
                <Image
                  src="/hero-2.jpg"
                  alt="Students studying abroad"
                  width={600}
                  height={500}
                  className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating stat card — bottom right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-5 right-4 rounded-xl border border-gray-100/80 bg-white/95 px-4 py-3 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:right-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C41E3A]/10">
                    <svg className="h-4.5 w-4.5 text-[#C41E3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">50+</p>
                    <p className="text-[11px] font-medium text-gray-400">Partner universities</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — top left */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute left-4 top-6 rounded-xl border border-gray-100/80 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-gray-200/50 backdrop-blur-sm sm:left-6"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C41E3A]/10">
                    <svg className="h-3.5 w-3.5 text-[#C41E3A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Free Consultation</p>
                    <p className="text-[9px] font-medium text-gray-400">Expert guidance, zero cost</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
