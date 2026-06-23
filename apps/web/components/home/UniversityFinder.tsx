'use client'

import { useState } from 'react'
import { Search, ChevronDown, ArrowRight } from 'lucide-react'
import { FadeUp } from '@/components/home/FadeUp'
import { ShineBorder } from '@/components/ui/shine-border'

const countries = ['Any Country', 'South Korea', 'Australia']
const degrees = ['Any Level', "Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Diploma']
const budgets = ['Any Budget', 'Under $5,000/yr', '$5,000 - $15,000/yr', '$15,000 - $30,000/yr', 'Over $30,000/yr']
const intakes = ['Any Intake', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027']

export default function UniversityFinder() {
  const [country, setCountry] = useState(countries[0])
  const [degree, setDegree] = useState(degrees[0])
  const [budget, setBudget] = useState(budgets[0])
  const [intake, setIntake] = useState(intakes[0])

  return (
    <section className="relative -mt-1 bg-white pb-20 pt-4 lg:-mt-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeUp>
          <ShineBorder
            borderWidth={2}
            duration={4}
            className="mx-auto"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                  <Search size={18} className="text-[#C41E3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Find Your University</h2>
                  <p className="text-xs text-gray-400">Search across 50+ programs in SK & AU</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Country', value: country, onChange: setCountry, options: countries },
                  { label: 'Degree', value: degree, onChange: setDegree, options: degrees },
                  { label: 'Budget', value: budget, onChange: setBudget, options: budgets },
                  { label: 'Intake', value: intake, onChange: setIntake, options: intakes },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {field.label}
                    </label>
                    <div className="relative">
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-3 pr-9 text-sm font-medium text-gray-800 outline-none transition-all focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
                      >
                        {field.options.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400">Popular:</span>
                  {['Computer Science', 'MBA', 'Engineering'].map((tag) => (
                    <button
                      key={tag}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-[#C41E3A]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#C41E3A] px-5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(196,30,58,0.25)] transition-all hover:bg-[#A01830] hover:shadow-[0_4px_16px_rgba(196,30,58,0.3)]">
                  Search Universities
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </ShineBorder>
        </FadeUp>
      </div>
    </section>
  )
}
