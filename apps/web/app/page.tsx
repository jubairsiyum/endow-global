import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { DiagnosticUniversityMarquee } from '@/components/home/DiagnosticUniversityMarquee'

const heroVideos = [
  {
    label: 'Campus study',
    src: 'https://videos.pexels.com/video-files/7969378/7969378-uhd_1440_2732_25fps.mp4',
  },
  {
    label: 'Students walking',
    src: 'https://videos.pexels.com/video-files/7969427/7969427-uhd_1440_2732_25fps.mp4',
  },
  {
    label: 'Outdoor collaboration',
    src: 'https://videos.pexels.com/video-files/6145420/6145420-uhd_1440_2732_25fps.mp4',
  },
] as const

const heroStats = [
  { value: '40+', label: 'Partner universities' },
  { value: '12', label: 'Study destinations' },
  { value: '1:1', label: 'Counselor guidance' },
] as const

const universities = [
  {
    name: 'Busan University',
    logo: '/universities/Busan University.png',
  },
  {
    name: 'Hanseo University',
    logo: '/universities/Hanseo University.png',
  },
  {
    name: 'Daejin University',
    logo: '/universities/Daejin University.png',
  },
  {
    name: 'Chungwoon University',
    logo: '/universities/Chungwoon University.png',
  },
  {
    name: 'Yeungjin University',
    logo: '/universities/Yeungjin University.png',
  },
  {
    name: 'Sahmyook University',
    logo: '/universities/Sahmyook University.png',
  },
  {
    name: 'Sejong University',
    logo: '/universities/Sejong University.png',
  },
  {
    name: 'Kyung Hee University',
    logo: '/universities/Kyung Hee University.png',
  },
  {
    name: 'Sun Moon University',
    logo: '/universities/Sun Moon University.png',
  },
  {
    name: 'Turku University',
    logo: '/universities/Turku University.png',
  },
  {
    name: 'Helsinki University',
    logo: '/universities/Helsinki University.png',
  },
  {
    name: 'Aalto University',
    logo: '/universities/Aalto University.png',
  },
  {
    name: 'Dong-Eui University',
    logo: '/universities/Dong-Eui University.png',
  },
] as const

const features = [
  {
    icon: Globe2,
    title: 'Matched destinations',
    copy: 'Compare countries, universities, scholarships, and intake timelines from one focused view.',
  },
  {
    icon: BookOpen,
    title: 'Course clarity',
    copy: 'Shortlist programs by level, subject, eligibility, and long-term career fit.',
  },
  {
    icon: ShieldCheck,
    title: 'Application control',
    copy: 'Track documents, counselor notes, deadlines, and next steps without losing momentum.',
  },
] as const

function VideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        aria-label="Students exploring study options on campus"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      >
        {heroVideos.map((video) => (
          <source key={video.src} src={video.src} type="video/mp4" />
        ))}
      </video>
      <div className="bg-white/88 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(196,30,58,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.94)_82%)]" />
    </div>
  )
}

function HeroSearchPanel() {
  return (
    <div className="bg-white/82 mx-auto w-full max-w-3xl rounded-lg border border-gray-200/80 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C41E3A]">
            Smart search
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Find your dream course</h2>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
          <Search size={20} />
        </span>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            What do you want to study?
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Computer Science, Business..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20"
            />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Destination</span>
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20">
              <option>Any Country</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Australia</option>
              <option>Canada</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Level</span>
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#C41E3A]/20">
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>
          </label>
        </div>

        <Button className="h-11 w-full rounded-lg" size="default">
          Search Courses
        </Button>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <VideoBackground />

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="pb-8 pt-4">
          <Navbar />
        </div>

        <div className="flex flex-1 items-center justify-center py-24 lg:py-20">
          <div className="mx-auto w-full max-w-4xl text-center">
            <div className="bg-white/72 mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200/80 px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#C41E3A]" />
              Global Vision, Guided Path
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Your journey to <span className="text-[#C41E3A]">global education</span> starts here.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-700 sm:text-lg">
              Discover universities, compare courses, and move through every application step with
              expert counseling in one compact platform.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 gap-2 px-6">
                <Link href="/register">
                  Start Your Application
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="white"
                className="h-12 gap-2 border border-white/70 px-6 shadow-sm"
              >
                <Link href="/universities">
                  Explore Universities
                  <Globe2 size={18} />
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <HeroSearchPanel />
            </div>

            <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
              {/* {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/56 rounded-lg border border-gray-200/70 px-4 py-3 backdrop-blur"
                >
                  <p className="text-2xl font-bold text-gray-950">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium leading-4 text-gray-600">{stat.label}</p>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// function UniversityMarquee() {
//   const marqueeItems = [...universities, ...universities, ...universities] // Repeat to create a seamless loop

//   return (
//     // <section className="overflow-hidden border-y border-gray-100 bg-white py-7">
//     //   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//     //     <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
//     //       <div className="university-marquee flex items-center gap-20 whitespace-nowrap">
//     //         {marqueeItems.map((university, index) => (
//     //           <div
//     //             key={`${university.name}-${index}`}
//     //             className="flex items-center justify-center opacity-80 transition-all duration-300 hover:opacity-100"
//     //           >
//     //             <Image
//     //               src={university.logo}
//     //               alt={university.name}
//     //               width={72}
//     //               height={72}
//     //               className="h-16 w-16 object-contain transition-all duration-300 hover:scale-110"
//     //             />
//     //           </div>
//     //         ))}
//     //       </div>
//     //     </div>
//     //   </div>
//     // </section>
//   )
// }

function FeaturesSection() {
  return (
    <section className="bg-[#f7f8fb] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C41E3A] shadow-sm">
              <GraduationCap size={16} />
              Built for study abroad decisions
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Everything you need to move with confidence
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-gray-600">
            We turn the complex application process into a clear sequence: discover the right fit,
            prepare the strongest application, and stay aligned with counselors from first shortlist
            to submission.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-[#C41E3A]">
                  <Icon size={20} />
                </span>
                <h3 className="text-lg font-bold text-gray-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{feature.copy}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          {['Eligibility checks', 'Document reminders', 'Counselor updates'].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <CheckCircle2 size={17} className="text-[#C41E3A]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-grow">
        <HeroSection />
        <DiagnosticUniversityMarquee universities={universities} />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}
