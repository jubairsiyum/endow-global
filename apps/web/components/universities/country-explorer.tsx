"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, DollarSign, Zap } from "lucide-react";
import { countries } from "@/lib/universities/data";
import { formatCurrency } from "@/lib/universities/utils";

export default function CountryExplorer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-16 lg:py-20 bg-white overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-100 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 space-y-3 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#C41E3A]" />
            <span className="text-xs font-medium text-[#C41E3A]">
              Explore Destinations
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Study Destinations Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-base lg:text-lg text-gray-600">
            Compare countries, universities, costs, and opportunities at a
            glance
          </p>
        </motion.div>

        {/* Countries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {countries.map((country, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden bg-white/85 backdrop-blur-sm border border-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_36px_rgba(196,30,58,0.1)] transition-all duration-300 hover:border-red-200/50"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-100/50 to-blue-100/50"></div>

              <div className="relative space-y-4 p-5 lg:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="text-4xl">{country.flag}</div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {country.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-[#C41E3A]">
                    {country.code}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm">{country.description}</p>

                {/* Stats Grid */}
                <div className="space-y-3">
                  {/* Universities */}
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Universities</p>
                      <p className="text-base font-bold text-blue-600">
                        {country.universities}+
                      </p>
                    </div>
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>

                  {/* Average Tuition */}
                  <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Annual Tuition</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(country.avgTuition)}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>

                  {/* Visa Success */}
                  <div className="flex items-center justify-between rounded-xl bg-purple-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Visa Success</p>
                      <p className="text-base font-bold text-purple-600">
                        {country.visaSuccessRate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xs text-gray-600">Living Cost/Month</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(country.costOfLiving)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Part-Time Income/Hour</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(country.partTimeIncome)}
                    </p>
                  </div>
                </div>

                {/* Top Universities Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Top Universities
                  </p>
                  <div className="space-y-2">
                    {country.topUniversities.map((uni, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        - {uni}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white hover:shadow-lg transition-shadow flex items-center justify-center gap-2 group-hover:from-purple-700 group-hover:to-blue-700">
                  Explore {country.name}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
