"use client";

import { motion, type Variants } from "framer-motion";
import { universities } from "@/lib/universities/data";
import Image from "next/image";

export default function UniversityMarquee() {
  const marqueeVariants: Variants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-y border-gray-200 bg-[#F8FAFC] py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-5 text-center text-xs font-semibold tracking-wide text-gray-600">
          TRUSTED BY 5000+ STUDENTS ACROSS
        </p>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <motion.div
            variants={marqueeVariants}
            animate="animate"
            className="flex gap-8 min-w-max"
          >
            {[...universities, ...universities].map((uni, idx) => (
              <motion.div
                key={`${uni.id}-${idx}`}
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
          </motion.div>

          {/* Fade overlays */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
