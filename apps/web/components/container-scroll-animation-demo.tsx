'use client'

import React from 'react'
import Image from 'next/image'

import { ContainerScroll } from '@/components/ui/container-scroll-animation'

export default function HeroScrollDemo() {
  return (
    <section
      aria-labelledby="study-abroad-journey-title"
      className="flex flex-col overflow-hidden bg-[#F8FAFC]"
    >
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
    </section>
  )
}
