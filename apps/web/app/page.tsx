import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'

import {
  Search,
  Globe2,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow">

        {/* HERO SECTION */}
        <section className="relative overflow-x-hidden bg-white">

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-rose-50 blur-3xl opacity-60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* NAVBAR */}
            <div className="pt-4 pb-8 lg:pb-12">
              <Navbar />
            </div>

            {/* HERO CONTENT */}
            <div className="py-20 lg:py-32">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT */}
                <div className="max-w-2xl">

                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                    Your journey to{' '}
                    <span className="text-[#C41E3A]">
                      global education
                    </span>{' '}
                    starts here.
                  </h1>

                  <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                    Discover top universities, apply to the best
                    courses, and get expert counseling—all in one
                    intelligent platform. Let's find your perfect
                    match.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">

                    <Button size="lg" className="gap-2">
                      Start Your Application
                      <ArrowRight size={18} />
                    </Button>

                    <Button size="lg" variant="outline">
                      Explore Universities
                    </Button>

                  </div>

                </div>

                {/* RIGHT SEARCH CARD */}
                <div className="relative">

                  <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 relative z-20">

                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Find your dream course
                    </h3>

                    <div className="space-y-4">

                      <div>

                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          What do you want to study?
                        </label>

                        <div className="relative">

                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                          />

                          <input
                            type="text"
                            placeholder="e.g. Computer Science, Business..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition-all bg-white"
                          />

                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-4">

                        <div>

                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Destination
                          </label>

                          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] bg-white">
                            <option>Any Country</option>
                            <option>United Kingdom</option>
                            <option>United States</option>
                            <option>Australia</option>
                            <option>Canada</option>
                          </select>

                        </div>

                        <div>

                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Level
                          </label>

                          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C41E3A] bg-white">
                            <option>Undergraduate</option>
                            <option>Postgraduate</option>
                          </select>

                        </div>

                      </div>

                      <Button className="w-full mt-2" size="lg">
                        Search Courses
                      </Button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* PREMIUM MOVING UNIVERSITIES SECTION */}
        <section className="border-y border-gray-100 bg-gray-50 py-10 overflow-hidden">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-[0.35em] mb-8">
              Trusted by top institutions globally
            </p>

            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">

              <div className="university-marquee flex items-center gap-24 whitespace-nowrap">

                {/* BUSAN */}
                <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Busan University.png"
                    alt="Busan University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Busan University
                  </span>

                </div>

                {/* HANSEO */}
                <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Hanseo University.png"
                    alt="Hanseo University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Hanseo University
                  </span>

                </div>

                {/* DAEJIN */}
                <div className="flex items-center gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Daejin University.png"
                    alt="Daejin University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Daejin University
                  </span>

                </div>

                {/* DUPLICATE LOOP */}

                <div className="flex items-center gap-4 opacity-80 hover:opacity-100 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Busan University.png"
                    alt="Busan University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Busan University
                  </span>

                </div>

                <div className="flex items-center gap-4 opacity-80 hover:opacity-100 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Hanseo University.png"
                    alt="Hanseo University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Hanseo University
                  </span>

                </div>

                <div className="flex items-center gap-4 opacity-80 hover:opacity-100 hover:opacity-100 transition-all duration-300">

                  <Image
                    src="/universities/Daejin University.png"
                    alt="Daejin University"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                  <span className="text-2xl font-bold font-serif text-gray-600">
                    Daejin University
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="py-24 bg-white">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-3xl mx-auto mb-16">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to succeed
              </h2>

              <p className="text-lg text-gray-600">
                We streamline the complex application process into
                three simple, guided steps using intelligent
                automation.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* CARD 1 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">

                <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-[#C41E3A] mb-6 group-hover:scale-110 transition-transform">
                  <Globe2 size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1. Discover & Match
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Our AI engine analyzes your profile, budget,
                  and goals to recommend the universities where
                  you have the highest chance of acceptance.
                </p>

              </div>

              {/* CARD 2 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">

                <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-[#C41E3A] mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  2. Single Application
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Fill out your details once. We format and submit
                  your application to multiple universities
                  simultaneously.
                </p>

              </div>

              {/* CARD 3 */}
              <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group">

                <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-[#C41E3A] mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  3. Visa & Enrollment
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Get dedicated 1-on-1 support from certified
                  counselors to handle your visa processing.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="relative isolate overflow-hidden bg-[#C41E3A] py-20 z-0">

          <div className="relative z-[1] max-w-4xl mx-auto px-4 text-center">

            <GraduationCap
              size={64}
              className="mx-auto text-white/80 mb-6"
            />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to shape your future?
            </h2>

            <p className="text-rose-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of students who have successfully
              placed into their dream universities.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">

              <Button size="lg" variant="white">
                Create Free Account
              </Button>

              <Button
                size="lg"
                className="border-2 border-white bg-transparent hover:bg-white/10 text-white"
              >
                Talk to an Expert
              </Button>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}