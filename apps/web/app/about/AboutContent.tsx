'use client'

import { motion } from 'framer-motion'
import { Globe, Users, Award, Heart, Zap, BookOpen, MapPin, Phone, Mail, ArrowRight, CheckCircle2, Quote } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

export function AboutContent() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <Navbar />
      {/* About Hero — below Navbar */}

      {/* Hero */}
<section className="relative overflow-hidden bg-[#0a0a0a]">
        {/* Brand red glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#C41E3A]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-[#C41E3A]/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="py-16 sm:py-20 lg:py-28">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Left content */}
              <motion.div initial="hidden" animate="visible" variants={stagger} className="flex-1 text-center lg:text-left">
                <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-[#C41E3A]"/>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Bangladesh&apos;s Trusted Partner</span>
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
                  Your Gateway to <span className="text-[#C41E3A]">South Korean</span> Education
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-white/60 max-w-xl mx-auto lg:mx-0">
                  We specialize in guiding Bangladeshi students to prestigious South Korean universities. From application to visa — we&apos;re with you every step.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-6 sm:mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Link href="/apply-now" className="group inline-flex items-center gap-2 rounded-full bg-[#C41E3A] px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-bold text-white shadow-xl shadow-[#C41E3A]/25 hover:shadow-2xl hover:shadow-[#C41E3A]/40 transition-all hover:-translate-y-0.5">
                    Apply Now <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform"/>
                  </Link>
                  <Link href="/universities" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all">
                    Explore Universities
                  </Link>
                </motion.div>
                <motion.div variants={fadeUp} className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-lg mx-auto lg:mx-0">
                  {[{k:'5000+',l:'Students'},{k:'20+',l:'Universities'},{k:'95%',l:'Visa Rate'},{k:'10+',l:'Years'}].map(s=>(
                    <div key={s.l} className="rounded-xl bg-white/[0.04] border border-white/[0.06] py-3 px-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-white">{s.k}</p>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — Hero visual */}
              <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.3}} className="w-full max-w-md lg:max-w-none lg:w-[440px] shrink-0 hidden sm:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C41E3A]/20 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#111] to-[#0a0a0a]">
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-[#C41E3A] to-transparent"/>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C41E3A] to-[#7A0713] text-white font-black text-xl shadow-lg shadow-[#C41E3A]/30">EG</div>
                        <div>
                          <p className="text-lg font-bold text-white">Endow Global</p>
                          <p className="text-xs text-white/40">Education Consultancy</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[{n:1,t:'University Selection',d:'Find the perfect program matching your goals'},{n:2,t:'Application Process',d:'Complete guidance for documentation & submission'},{n:3,t:'Visa Processing',d:'Expert support for smooth visa approval'},{n:4,t:'Arrival Support',d:'Airport pickup & accommodation assistance'}].map(s=>(
                          <div key={s.n} className="flex items-start gap-3 group cursor-default">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C41E3A]/15 text-xs font-bold text-[#C41E3A] group-hover:bg-[#C41E3A] group-hover:text-white transition-all">{s.n}</div>
                            <div>
                              <p className="text-sm font-semibold text-white">{s.t}</p>
                              <p className="text-xs text-white/40 mt-0.5">{s.d}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom transition */}
        <div className="h-12 sm:h-16 bg-gradient-to-b from-transparent to-white"/>
      </section>

      {/* Trust Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{once:true}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[{icon:Users,title:'Your Trusted Advisor',desc:'Providing expert guidance every step of the way.'},{icon:Globe,title:'Global Opportunities',desc:'Access to top universities in South Korea and beyond.'},{icon:BookOpen,title:'Simplified Process',desc:'We handle documentation, applications, and visas.'},{icon:Heart,title:'Dedicated Support',desc:'From inquiry to enrollment, we\'re by your side.'}].map((c,i)=>(
              <motion.div key={i} variants={fadeUp} className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C41E3A]/5 to-amber-100/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C41E3A]/10 mb-4"><c.icon size={20} className="text-[#C41E3A]"/></div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.8}}>
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C41E3A]/10 to-amber-200/20 blur-2xl" />
                <div className="relative flex h-80 lg:h-96 items-center justify-center rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <div className="text-center">
                    <Globe size={80} className="text-[#C41E3A]/20 mx-auto" />
                    <p className="mt-4 text-sm font-medium text-gray-400">Global Vision, Guided Path</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{once:true}}>
              <motion.span variants={fadeUp} className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">Who We Are</motion.span>
              <motion.h2 variants={fadeUp} className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Empowering Dreams, One Student at a Time</motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-lg leading-relaxed text-gray-600">At Endow Global Education, we are more than just an education consultancy. We are your trusted partners in achieving academic dreams and shaping a brighter future.</motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-gray-600">With years of experience in the international education sector, we have built strong partnerships with prestigious universities in South Korea. Our team of dedicated counselors works tirelessly to match students with programs that align with their academic goals and career aspirations.</motion.p>
              <motion.div variants={fadeUp} className="mt-6">
                <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#760B16] to-[#A91324] px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">Start Your Journey <ArrowRight size={16}/></Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[{icon:Heart,color:'text-[#C41E3A]',bg:'from-[#C41E3A]/10 to-red-100/20',title:'Our Mission',text:'To empower students from Bangladesh to achieve their academic aspirations by providing unparalleled guidance and support throughout their journey to study in South Korea.'},{icon:Zap,color:'text-blue-600',bg:'from-blue-500/10 to-blue-100/20',title:'Our Vision',text:'To be the leading education consultancy in Bangladesh, recognized for our commitment to excellence, integrity, and innovation in connecting students with world-class educational opportunities.'}].map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,delay:i*0.15}} className="group relative">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${c.bg} blur-2xl`} />
                <div className="relative rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1">
                  <div className="mb-5"><c.icon size={32} className={c.color}/></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{c.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{c.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{once:true}} className="text-center mb-10">
            <motion.span variants={fadeUp} className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C41E3A]">From Our Founder</motion.span>
            <motion.h2 variants={fadeUp} className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Message from the Founder</motion.h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-lg">
              <Quote size={40} className="text-[#C41E3A]/20 absolute top-6 left-6" />
              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#C41E3A] mb-4">Dear Students and Parents,</p>
                <p className="text-gray-700 leading-relaxed mb-4">Welcome to Endow Global Education! At Endow, we believe that education has the power to transform lives and open doors to endless possibilities. As someone deeply passionate about empowering students to achieve their dreams, I founded this consultancy with the vision of bridging the gap between aspirations and opportunities.</p>
                <p className="text-gray-700 leading-relaxed">Our mission is to provide a supportive and reliable platform where students can confidently take their first steps toward studying in South Korea. From choosing the right program to navigating the application process, my team and I are committed to walking with you every step of the way.</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-bold text-gray-900">Md. Abdullah Al Faruq</p>
                  <p className="text-sm text-gray-500">Founder, Endow Global Education</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#760B16] to-[#A91324] py-16 lg:py-20">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/70 text-lg mb-8">Get personalized guidance from our expert consultants and take the first step toward your South Korean education.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/apply-now" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#C41E3A] shadow-lg hover:shadow-xl transition-all">Apply Now <ArrowRight size={16}/></Link>
              <a href="https://wa.me/8801901463204" target="_blank" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">WhatsApp Us</a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
