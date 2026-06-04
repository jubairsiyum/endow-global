"use client";

import { motion } from "framer-motion";
import { universities } from "@/lib/universities/data";
import Image from "next/image";

export default function UniversityMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-gray-200 bg-[#F8FAFC] py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-5 text-center text-xs font-semibold tracking-wide text-gray-600">
          TRUSTED BY 5000+ STUDENTS ACROSS
        </p>

        <div className="marquee-container">
          <div className="marquee-content">
            {/* Track 1 */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track1-${uni.id}`}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-white"
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow group-hover:shadow-[0_8px_18px_rgba(196,30,58,0.10)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="hidden max-w-xs text-center text-xs text-gray-700 group-hover:block">
                    <p className="font-semibold">{uni.name}</p>
                    <p className="text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Track 2 */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track2-${uni.id}`}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-white"
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow group-hover:shadow-[0_8px_18px_rgba(196,30,58,0.10)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="hidden max-w-xs text-center text-xs text-gray-700 group-hover:block">
                    <p className="font-semibold">{uni.name}</p>
                    <p className="text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Track 3 */}
            <div className="marquee-track">
              {universities.map((uni) => (
                <motion.div
                  key={`track3-${uni.id}`}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-white"
                >
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow group-hover:shadow-[0_8px_18px_rgba(196,30,58,0.10)]">
                    <Image
                      src={uni.logo}
                      alt={uni.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>

                  <div className="hidden max-w-xs text-center text-xs text-gray-700 group-hover:block">
                    <p className="font-semibold">{uni.name}</p>
                    <p className="text-gray-600">{uni.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC] to-transparent" />
        </div>
      </div>
    </section>
  );
}