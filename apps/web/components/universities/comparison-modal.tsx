'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, TrendingUp } from 'lucide-react'
import { universities } from '@/lib/universities/data'
import { formatCurrency } from '@/lib/universities/utils'
import { useState } from 'react'

interface UniversityComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UniversityComparisonModal({
  isOpen,
  onClose,
}: UniversityComparisonModalProps) {
  const [selected, setSelected] = useState<string[]>(['hanseo', 'daejin'])

  const selectedUniversities = universities.filter((u) => selected.includes(u.id))

  const handleToggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id)
      } else if (prev.length < 4) {
        return [...prev, id]
      }
      return prev
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.10)]">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5 lg:p-6">
                <h2 className="text-2xl font-bold text-gray-900">Compare Universities</h2>
                <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-5 lg:p-6">
                {/* Selector */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Select Universities (up to 4)</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {universities.map((uni) => (
                      <button
                        key={uni.id}
                        onClick={() => handleToggleSelect(uni.id)}
                        className={`rounded-xl border-2 p-3 text-left transition-colors ${
                          selected.includes(uni.id)
                            ? 'border-[#C41E3A] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-900">{uni.name}</p>
                        <p className="text-xs text-gray-600">{uni.city}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-3 text-left font-bold text-gray-900">Criteria</th>
                        {selectedUniversities.map((uni) => (
                          <th key={uni.id} className="px-3 py-3 text-left font-bold text-gray-900">
                            {uni.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Ranking */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Ranking</td>
                        {selectedUniversities.map((uni) => (
                          <td
                            key={uni.id}
                            className="flex items-center gap-2 px-3 py-3 text-gray-600"
                          >
                            <TrendingUp className="h-4 w-4 text-[#C41E3A]" /># {uni.ranking}
                          </td>
                        ))}
                      </tr>

                      {/* Tuition */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Annual Tuition</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 text-gray-600">
                            {formatCurrency(uni.tuition.min)} - {formatCurrency(uni.tuition.max)}
                          </td>
                        ))}
                      </tr>

                      {/* Scholarship */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">
                          Scholarship Available
                        </td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 font-bold text-[#C41E3A]">
                            {uni.scholarship}%
                          </td>
                        ))}
                      </tr>

                      {/* Visa Success */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Visa Success Rate</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 font-bold text-[#C41E3A]">
                            {uni.visaSuccessRate}%
                          </td>
                        ))}
                      </tr>

                      {/* Employment */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Employment Rate</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 font-bold text-[#C41E3A]">
                            {uni.employmentRate}%
                          </td>
                        ))}
                      </tr>

                      {/* Dormitory */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Dormitory Fee</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 text-gray-600">
                            {formatCurrency(uni.dormitoryFee)}/year
                          </td>
                        ))}
                      </tr>

                      {/* Living Cost */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">Living Cost</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 text-gray-600">
                            {formatCurrency(uni.livingCost)}/month
                          </td>
                        ))}
                      </tr>

                      {/* IELTS Requirement */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-3 font-semibold text-gray-700">IELTS Requirement</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 text-gray-600">
                            {uni.ieltsRequirement}+
                          </td>
                        ))}
                      </tr>

                      {/* GPA Requirement */}
                      <tr>
                        <td className="px-3 py-3 font-semibold text-gray-700">GPA Requirement</td>
                        {selectedUniversities.map((uni) => (
                          <td key={uni.id} className="px-3 py-3 text-gray-600">
                            {uni.gpaRequirement}+
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="h-11 flex-1 rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="h-11 flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
                    Apply to Selected
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
