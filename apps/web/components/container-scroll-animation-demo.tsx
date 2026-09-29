'use client'

import React from 'react'
import Image from 'next/image'

import { ContainerScroll } from '@/components/ui/container-scroll-animation'

export default function HeroScrollDemo() {
  return (
    <section
      aria-labelledby="study-abroad-journey-title"
      className="relative isolate flex flex-col overflow-hidden bg-[#FBFCFE]"
    >
      <JourneyBackdrop />
      <JourneyOriginBadge />

      <div className="relative z-10">
        <ContainerScroll
          titleComponent={
            <>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C41E3A]">
                Dream. Plan. Go.
              </p>
              <h2
                id="study-abroad-journey-title"
                className="text-4xl font-semibold leading-tight text-[#101B3D] dark:text-white"
              >
                Your next chapter <br className="hidden sm:block" />
                <span className="mt-1 inline-block text-4xl font-bold leading-none text-[#C41E3A] md:text-[6rem]">
                  starts abroad.
                </span>
              </h2>
            </>
          }
        >
          <Image
            src="/seowonFaruq.jpg"
            alt="Endow student Seowon Faruq celebrating a study abroad journey"
            height={720}
            width={1400}
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="mx-auto h-full w-full object-cover object-[65%_center]"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  )
}

function JourneyBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-24 top-64 z-0 select-none overflow-hidden"
    >
      <Image
        src="/images/world-map-red.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.022] contrast-50 grayscale invert"
      />

      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <g
          fill="none"
          stroke="#C41E3A"
          strokeDasharray="2 9"
          strokeLinecap="round"
          strokeWidth="1.5"
          opacity="0.28"
        >
          <path d="M685 42 C625 105 570 132 530 145" />
          <path d="M685 42 C727 92 760 153 790 180" />
          <path d="M685 42 C744 180 775 292 800 340" />
        </g>

        <g fill="#FBFCFE" stroke="#C41E3A" strokeWidth="1.25" opacity="0.5">
          <path d="M685 24c-6 0-10 4-10 10 0 8 10 18 10 18s10-10 10-18c0-6-4-10-10-10Z" />
          <circle cx="530" cy="145" r="4" />
          <circle cx="790" cy="180" r="4" />
          <circle cx="800" cy="340" r="4" />
        </g>

        <g fill="#C41E3A" opacity="0.72">
          <circle cx="685" cy="34" r="2.5" />
        </g>

        <g
          fill="#101B3D"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize="11"
          letterSpacing="1"
          opacity="0.22"
        >
          <text x="500" y="130">
            EUROPE
          </text>
          <text x="802" y="171">
            KOREA
          </text>
          <text x="812" y="357">
            AUSTRALIA
          </text>
        </g>

        <g fill="#FBFCFE" stroke="#C41E3A" strokeWidth="1.1" opacity="0.62">
          <path d="M530 132c-5 0-8 3-8 8 0 6 8 14 8 14s8-8 8-14c0-5-3-8-8-8Z" />
          <path d="M790 167c-5 0-8 3-8 8 0 6 8 14 8 14s8-8 8-14c0-5-3-8-8-8Z" />
          <path d="M800 327c-5 0-8 3-8 8 0 6 8 14 8 14s8-8 8-14c0-5-3-8-8-8Z" />
        </g>

        <g fill="#C41E3A" opacity="0.48">
          <circle cx="530" cy="140" r="2" />
          <circle cx="790" cy="175" r="2" />
          <circle cx="800" cy="335" r="2" />
        </g>

        <g fill="#C41E3A" stroke="#FBFCFE" strokeWidth="0.8" opacity="0.78">
          <animateMotion
            dur="18s"
            path="M685 42 C625 105 570 132 530 145 C570 132 625 105 685 42 C727 92 760 153 790 180 C760 153 727 92 685 42 C744 180 775 292 800 340"
            repeatCount="indefinite"
            rotate="auto"
          />
          <g transform="rotate(45)">
            <path
              d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"
              transform="translate(-9.6 -9.6) scale(0.8)"
            />
          </g>
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-[#FBFCFE] via-transparent to-[#FBFCFE]" />
    </div>
  )
}

function JourneyOriginBadge() {
  return (
    <div className="pointer-events-none absolute right-4 top-24 z-20 flex items-center gap-2 rounded-xl border border-[#C41E3A]/10 bg-white/75 px-3 py-2 shadow-[0_8px_24px_rgba(16,27,61,0.04)] backdrop-blur-[2px] sm:right-8 md:right-[10%]">
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#C41E3A]/[0.08]">
        <span className="h-2 w-2 rounded-full bg-[#C41E3A]/70" />
        <span className="absolute inset-1 rounded-full border border-[#C41E3A]/20" />
      </span>
      <span className="leading-none">
        <span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#101B3D]/60">
          Dhaka · Origin
        </span>
        <span className="mt-1 block font-mono text-[8px] tracking-[0.02em] text-[#101B3D]/40">
          23.8103° N, 90.4125° E
        </span>
      </span>
    </div>
  )
}
