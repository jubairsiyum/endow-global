"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CinematicBranding() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden border-r border-white/10 bg-[#030712]">
      
      {/* WORLD MAP */}
      <div className="absolute inset-0">
        <Image
          src="/images/world-map-red.png"
          alt="World Map"
          fill
          priority
          quality={100}
          className="
            object-cover
            object-center
            opacity-[0.55]
            scale-100
          "
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-[#030712]/45" />

      {/* RED TOP LIGHT */}
      <div className="absolute right-[-120px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#9F050F]/20 blur-3xl" />

      {/* BLUE BOTTOM LIGHT */}
      <div className="absolute bottom-[-200px] left-[-160px] h-[480px] w-[480px] rounded-full bg-blue-900/15 blur-3xl" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full w-full flex-col px-16 py-14">
        
        {/* LOGO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <h1 className="text-[44px] font-bold leading-none tracking-[-3px] text-white">
            Endow
          </h1>

          <p className="mt-3 text-[16px] font-medium text-white/80">
            Global Education
          </p>
        </motion.div>

        {/* HERO */}
        <div className="flex flex-1 items-center">
          
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="max-w-[660px]"
          >
            
            <h2 className="text-[64px] font-bold leading-[68px] tracking-[-2px] text-white">
              Empowering
              <br />
              Student
              <br />

              <span className="bg-gradient-to-r from-[#ff445c] via-[#ff243f] to-[#9F050F] bg-clip-text text-transparent">
                Success.
              </span>
            </h2>

            <p className="mt-7 max-w-[560px] text-[18px] leading-[34px] text-white/80">
              AI-powered ecosystem for
              global admissions,
              counselor collaboration and
              modern education management.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}