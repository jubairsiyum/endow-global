"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, DollarSign, Zap, ShieldCheck } from "lucide-react";
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
    <section className="relative overflow-x-hidden bg-white py-16 lg:py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-500/10 opacity-20 blur-3xl" />
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
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            Study Destinations Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600">
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
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-red-100"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,30,58,0.08),transparent_48%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative space-y-4 p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-sm font-bold text-[#C41E3A]">
                      {country.code}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {country.name}
                    </h3>
                  </div>
                  <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {country.universities}+ universities
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm">{country.description}</p>

                {/* Stats Grid */}
                <div className="space-y-3">
                  {/* Universities */}
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Universities</p>
                      <p className="text-base font-bold text-gray-900">
                        {country.universities}+
                      </p>
                    </div>
                    <Zap className="h-5 w-5 text-[#C41E3A]" />
                  </div>

                  {/* Average Tuition */}
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Annual Tuition</p>
                      <p className="text-base font-bold text-gray-900">
                        {formatCurrency(country.avgTuition)}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-[#C41E3A]" />
                  </div>

                  {/* Visa Success */}
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs text-gray-600">Visa Success</p>
                      <p className="text-base font-bold text-gray-900">
                        {country.visaSuccessRate}%
                      </p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-[#C41E3A]" />
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
                      <p key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C41E3A]" />
                        {uni}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(196,30,58,0.18)] transition-shadow hover:shadow-red-200">
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
