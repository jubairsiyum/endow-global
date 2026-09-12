'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#C41E3A]" />
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C41E3A] sm:text-xs">
        {children}
      </span>
    </div>
  )
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      viewport={{ once: true }}
      className="border-b border-black/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`font-display text-lg font-medium leading-snug transition-colors sm:text-[20px] ${
            isOpen ? 'text-[#C41E3A]' : 'text-[#0E1116]'
          }`}
        >
          {q}
        </span>
        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen ? 'border-[#C41E3A] text-[#C41E3A]' : 'border-black/15 text-black/50'
          }`}
        >
          <Plus size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-base leading-relaxed text-[#4b5563]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQAccordion() {
  return (
    <section id="faq" className="scroll-mt-24 bg-[#FAF9F6] py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — image */}
          <FadeUp>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src="/hero-1.jpg"
                  alt="Students studying abroad"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="rounded-lg bg-white/95 px-5 py-4 shadow-sm">
                    <div className="font-display text-2xl font-semibold text-[#0E1116]">2,000+</div>
                    <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b7280]">
                      Students placed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right column — FAQ */}
          <FadeUp>
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#0E1116] sm:text-5xl">
                Frequently asked{' '}
                <span style={{ color: '#C41E3A' }}>questions</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#4b5563] sm:text-lg">
                Everything you need to know before starting your study-abroad journey.
              </p>

              <div className="mt-8 border-t border-black/10">
                {faqs.map((faq, i) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
