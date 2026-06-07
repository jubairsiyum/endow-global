'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CinematicBranding() {
  return (
    <div className="relative flex h-screen w-full overflow-hidden border-r border-white/10 bg-[#030712]">
      {/* =========================================
         WORLD MAP
      ========================================= */}

      <div className="absolute inset-0">
        <Image
          src="/images/world-map-red.png"
          alt="World Map"
          fill
          priority
          quality={100}
          className="scale-[1.02] object-cover object-center opacity-[0.58]"
        />
      </div>

      {/* =========================================
         PREMIUM GLOBAL CONNECTIONS
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 z-[4]">
        <svg
          className="h-full w-full"
          viewBox="0 0 1000 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* =========================================
               PREMIUM GLOW
            ========================================= */}

            <filter id="premiumGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* =========================================
               FLOW GRADIENT 1
            ========================================= */}

            <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff163d" stopOpacity="0" />

              <stop offset="50%" stopColor="#ff5a74" stopOpacity="1" />

              <stop offset="100%" stopColor="#ff163d" stopOpacity="0" />

              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1 0"
                to="1 0"
                dur="4s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* =========================================
               FLOW GRADIENT 2
            ========================================= */}

            <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff163d" stopOpacity="0" />

              <stop offset="50%" stopColor="#ff304f" stopOpacity="1" />

              <stop offset="100%" stopColor="#ff163d" stopOpacity="0" />

              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1 0"
                to="1 0"
                dur="6s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* =========================================
               FLOW GRADIENT 3
            ========================================= */}

            <linearGradient id="flow3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff163d" stopOpacity="0" />

              <stop offset="50%" stopColor="#ff7588" stopOpacity="1" />

              <stop offset="100%" stopColor="#ff163d" stopOpacity="0" />

              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1 0"
                to="1 0"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* =========================================
             CONNECTION 1
          ========================================= */}

          <path
            d="M210 315 C350 240 470 250 570 320"
            stroke="rgba(255,40,70,0.10)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M210 315 C350 240 470 250 570 320"
            stroke="url(#flow1)"
            strokeWidth="3.5"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="240 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1400"
              to="0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 2
          ========================================= */}

          <path
            d="M570 320 C650 260 730 280 780 350"
            stroke="rgba(255,40,70,0.10)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M570 320 C650 260 730 280 780 350"
            stroke="url(#flow2)"
            strokeWidth="3.5"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="220 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1200"
              to="0"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 3
          ========================================= */}

          <path
            d="M780 350 C830 430 850 500 900 570"
            stroke="rgba(255,40,70,0.10)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M780 350 C830 430 850 500 900 570"
            stroke="url(#flow3)"
            strokeWidth="3.5"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="260 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1200"
              to="0"
              dur="6.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 4
          ========================================= */}

          <path
            d="M500 470 C620 360 700 360 790 430"
            stroke="rgba(255,40,70,0.08)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M500 470 C620 360 700 360 790 430"
            stroke="url(#flow1)"
            strokeWidth="3"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="220 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="0"
              dur="7s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 5
          ========================================= */}

          <path
            d="M350 560 C430 500 480 460 540 470"
            stroke="rgba(255,40,70,0.08)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M350 560 C430 500 480 460 540 470"
            stroke="url(#flow2)"
            strokeWidth="3"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="180 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="0"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 6
          ========================================= */}

          <path
            d="M760 310 C840 260 910 260 980 330"
            stroke="rgba(255,40,70,0.10)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M760 310 C840 260 910 260 980 330"
            stroke="url(#flow3)"
            strokeWidth="3.5"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="220 1000"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1200"
              to="0"
              dur="4.8s"
              repeatCount="indefinite"
            />
          </path>

          {/* =========================================
             CONNECTION 7
          ========================================= */}

          <path
            d="M240 390 C480 280 700 420 900 560"
            stroke="rgba(255,40,70,0.08)"
            strokeWidth="2"
            fill="none"
          />

          <path
            d="M240 390 C480 280 700 420 900 560"
            stroke="url(#flow1)"
            strokeWidth="3"
            fill="none"
            filter="url(#premiumGlow)"
            strokeLinecap="round"
            strokeDasharray="240 1200"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1500"
              to="0"
              dur="9s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* =========================================
         DARK OVERLAY
      ========================================= */}

      <div className="bg-[#030712]/52 absolute inset-0" />

      {/* =========================================
         RED LIGHT
      ========================================= */}

      <div className="absolute right-[-120px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#9F050F]/20 blur-3xl" />

      {/* =========================================
         BLUE LIGHT
      ========================================= */}

      <div className="absolute bottom-[-200px] left-[-160px] h-[480px] w-[480px] rounded-full bg-blue-900/15 blur-3xl" />

      {/* =========================================
         GRID
      ========================================= */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.035]" />

      {/* =========================================
         CONTENT
      ========================================= */}

      <div className="relative z-20 flex h-full w-full flex-col px-16 py-14">
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
          <h1 className="text-[44px] font-bold leading-none tracking-[-3px] text-white">Endow</h1>

          <p className="mt-3 text-[16px] font-medium text-white/80">Global Education</p>
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
              AI-powered ecosystem for global admissions, counselor collaboration and modern
              education management.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
