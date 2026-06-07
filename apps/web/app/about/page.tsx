'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Users,
  Award,
  BookOpen,
  Plane,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as any },
  },
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative overflow-x-hidden bg-white">
      {/* Background glow elements */}
      <div className="absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-red-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* NAVBAR */}
        <div className="pb-8 pt-4 lg:pb-12">
          <Navbar />
        </div>

        {/* HERO CONTENT */}
        <div className="py-20 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Side */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              {/* Badge */}
              <motion.div
                variants={fadeUpVariants}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2"
              >
                <Globe className="h-4 w-4 text-[#C41E3A]" />
                <span className="text-sm font-semibold text-[#C41E3A]">
                  Global Education Leader
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUpVariants}
                className="mb-6 text-5xl font-bold leading-tight text-gray-900 lg:text-6xl"
              >
                Empowering Students For{' '}
                <span className="bg-gradient-to-r from-[#C41E3A] via-red-500 to-red-600 bg-clip-text text-transparent">
                  Global Academic Success
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeUpVariants}
                className="mb-8 text-lg leading-relaxed text-gray-600"
              >
                We guide ambitious students through every step of their international education
                journey. From university selection to visa approval, we're your trusted partner in
                achieving your global dreams.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeUpVariants} className="flex flex-col gap-4 sm:flex-row">
                <button className="transform rounded-2xl bg-[#C41E3A] px-8 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/30">
                  Start Your Journey
                </button>
                <button className="rounded-2xl border-2 border-gray-200 px-8 py-3 font-semibold text-gray-900 transition-all duration-300 hover:border-[#C41E3A] hover:bg-red-50">
                  Learn More
                </button>
              </motion.div>
            </motion.div>

            {/* Right Side - Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div animate="animate" variants={floatingVariants} className="relative">
                {/* Glow background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 blur-2xl" />

                {/* Main card */}
                <div className="relative rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Stat 1 */}
                    <div className="text-center">
                      <div className="mb-2 bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                        5000+
                      </div>
                      <p className="text-sm font-medium text-gray-600">Students Guided</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="text-center">
                      <div className="mb-2 bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                        95%
                      </div>
                      <p className="text-sm font-medium text-gray-600">Visa Success</p>
                    </div>

                    {/* Stat 3 */}
                    <div className="text-center">
                      <div className="mb-2 bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                        20+
                      </div>
                      <p className="text-sm font-medium text-gray-600">Partner Universities</p>
                    </div>

                    {/* Stat 4 */}
                    <div className="text-center">
                      <div className="mb-2 bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                        10+
                      </div>
                      <p className="text-sm font-medium text-gray-600">Countries</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Who We Are Section
const WhoWeAreSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 blur-2xl" />
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-[#C41E3A]/20 to-red-200/20 backdrop-blur-xl">
              <div className="text-center">
                <Globe className="mx-auto h-32 w-32 text-red-300 opacity-60" />
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUpVariants}
              className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl"
            >
              Who We Are
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="mb-8 text-lg leading-relaxed text-gray-600"
            >
              Endow Global Education is a premier international education consultancy dedicated to
              transforming the dreams of ambitious students into reality. With over a decade of
              experience and a team of certified education consultants, we've helped thousands of
              students navigate the complex journey to world-class universities.
            </motion.p>

            <motion.p
              variants={fadeUpVariants}
              className="mb-8 text-base leading-relaxed text-gray-600"
            >
              Our mission extends beyond admissions. We believe in holistic student development,
              comprehensive support systems, and creating pathways to global success. We're not just
              consultants; we're mentors, advocates, and partners in your journey.
            </motion.p>

            {/* Stats Grid */}
            <motion.div variants={fadeUpVariants} className="grid grid-cols-2 gap-4">
              {[
                { label: 'Students', value: '5000+' },
                { label: 'Universities', value: '200+' },
                { label: 'Scholarships', value: '$50M+' },
                { label: 'Visa Success', value: '95%' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/60 bg-white/50 p-4 backdrop-blur-xl transition-all hover:bg-white/70"
                >
                  <div className="mb-1 text-2xl font-bold text-[#C41E3A]">{stat.value}</div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Why Choose Us Section
const WhyChooseUsSection = () => {
  const services = [
    {
      icon: Users,
      title: 'Personalized Guidance',
      description: 'One-on-one mentoring tailored to your academic profile and career aspirations.',
    },
    {
      icon: Award,
      title: 'Scholarship Assistance',
      description:
        'We help you secure scholarships worth millions. Our success rate speaks for itself.',
    },
    {
      icon: Globe,
      title: 'University Partnerships',
      description:
        'Direct relationships with 200+ universities worldwide ensure guaranteed opportunities.',
    },
    {
      icon: Plane,
      title: 'Visa Processing',
      description:
        'Expert visa guidance with a 95% success rate. We handle every step with precision.',
    },
    {
      icon: Home,
      title: 'Accommodation Support',
      description:
        'We arrange safe, comfortable housing in your destination country before arrival.',
    },
    {
      icon: Briefcase,
      title: 'Career Counseling',
      description: 'Post-graduation career planning and job placement assistance worldwide.',
    },
  ]

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">Why Choose Us</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Comprehensive services designed to support every aspect of your international education
            journey.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div key={idx} variants={fadeUpVariants} className="group relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <div className="relative h-full rounded-3xl border border-white/60 bg-gradient-to-br from-white/70 to-white/50 p-8 backdrop-blur-xl transition-all duration-300 hover:border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C41E3A] to-red-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.title}</h3>
                      <p className="leading-relaxed text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-[#C41E3A] to-transparent transition-all duration-300 group-hover:w-full" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// Mission & Vision Section
const MissionVisionSection = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/60 bg-white/70 p-10 backdrop-blur-xl transition-all duration-300 hover:bg-white/80 group-hover:-translate-y-2">
              <div className="mb-6 flex items-center gap-4">
                <Heart className="h-10 w-10 text-[#C41E3A]" />
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                To empower students worldwide by providing comprehensive, honest, and personalized
                guidance that transforms their international education aspirations into tangible
                achievements. We believe every student deserves access to world-class education
                regardless of their background.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-blue-300/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/60 bg-white/70 p-10 backdrop-blur-xl transition-all duration-300 hover:bg-white/80 group-hover:-translate-y-2">
              <div className="mb-6 flex items-center gap-4">
                <Zap className="h-10 w-10 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                To build a globally connected community of accomplished alumni who lead
                transformative change in their fields and societies. We envision a world where
                geographical boundaries don't limit access to quality education and career
                opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Founder Message Section
const FounderMessageSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 blur-2xl" />
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50">
              <Briefcase className="h-32 w-32 text-gray-300" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUpVariants} className="mb-4 inline-block">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C41E3A]">
                From Our Founder
              </p>
            </motion.div>

            <motion.h2 variants={fadeUpVariants} className="mb-6 text-4xl font-bold text-gray-900">
              Transforming Dreams Into Reality
            </motion.h2>

            <motion.blockquote
              variants={fadeUpVariants}
              className="mb-8 border-l-4 border-[#C41E3A] pl-6 text-2xl font-semibold italic text-gray-800"
            >
              "Every student has the potential to achieve greatness. Our mission is to unlock that
              potential and guide them towards a brighter global future."
            </motion.blockquote>

            <motion.p
              variants={fadeUpVariants}
              className="mb-8 text-lg leading-relaxed text-gray-700"
            >
              When I started Endow Global Education over a decade ago, I witnessed firsthand how
              lack of proper guidance held back brilliant students. Today, with a team of passionate
              educators and consultants, we've helped thousands achieve their dreams at
              world-leading universities.
            </motion.p>

            <motion.p variants={fadeUpVariants} className="mb-8 leading-relaxed text-gray-600">
              Our success isn't measured by numbers alone, but by the impact we create in the lives
              of our students and their families. We're committed to maintaining the highest
              standards of integrity, innovation, and excellence in everything we do.
            </motion.p>

            <motion.div variants={fadeUpVariants}>
              <p className="mb-1 text-lg font-semibold text-gray-900">Founder & CEO</p>
              <p className="text-gray-600">Endow Global Education</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Student Success Section
const StudentSuccessSection = () => {
  const testimonials = [
    {
      name: 'Anika Roy',
      university: 'University of Oxford',
      country: 'United Kingdom',
      testimonial:
        'Endow guided me through every step. From shortlisting universities to visa approval, their support was invaluable. I got into my dream university!',
      visa: '✓ Visa Approved',
    },
    {
      name: 'Fahim Ahmed',
      university: 'MIT',
      country: 'USA',
      testimonial:
        'The scholarship assistance was exceptional. I secured a full tuition scholarship and now studying at MIT. Truly grateful!',
      visa: '✓ Visa Approved',
    },
    {
      name: 'Sarah Kim',
      university: 'University of Toronto',
      country: 'Canada',
      testimonial:
        'Professional, responsive, and genuinely caring. They treated my application like their own. Best decision ever!',
      visa: '✓ Visa Approved',
    },
  ]

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
            Student Success Stories
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Real stories from students who transformed their futures with our guidance.
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} variants={fadeUpVariants} className="group relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-400/20 to-red-300/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex h-full flex-col rounded-3xl border border-white/60 bg-white/60 p-8 backdrop-blur-xl transition-all duration-300 hover:border-red-200">
                {/* Avatar */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C41E3A] to-red-600 text-xl font-bold text-white">
                  {testimonial.name.charAt(0)}
                </div>

                {/* Content */}
                <p className="mb-6 flex-grow italic leading-relaxed text-gray-700">
                  "{testimonial.testimonial}"
                </p>

                {/* Footer */}
                <div className="border-t border-white/40 pt-4">
                  <p className="mb-1 font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="mb-3 text-sm text-gray-600">
                    {testimonial.university} • {testimonial.country}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    {testimonial.visa}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// University Partners Marquee
const UniversityPartnersSection = () => {
  const partners = [
    'Oxford',
    'Cambridge',
    'MIT',
    'Stanford',
    'Harvard',
    'Yale',
    'Columbia',
    'Toronto',
    'Melbourne',
    'Seoul',
  ]

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
            Our University Partners
          </h2>
          <p className="text-lg text-gray-600">
            Direct partnerships with 200+ institutions worldwide
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden py-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex w-max gap-8"
          >
            {[...partners, ...partners].map((partner, idx) => (
              <div
                key={idx}
                className="group flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 transition-colors duration-300 hover:border-[#C41E3A]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#C41E3A] to-red-600 text-sm font-bold text-white">
                  {partner.charAt(0)}
                </div>
                <span className="whitespace-nowrap font-semibold text-gray-900">{partner}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Consultation CTA Section
const ConsultationCTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#C41E3A] to-red-700 py-20">
      {/* Background elements */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUpVariants}
            className="mb-6 text-4xl font-bold text-white lg:text-5xl"
          >
            Ready to Start Your Journey?
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className="mb-10 text-xl leading-relaxed text-white/90"
          >
            Get personalized guidance from our expert consultants. Schedule a free consultation
            today and take the first step towards your global education success.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <button className="flex transform items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-[#C41E3A] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <MessageCircle className="h-5 w-5" />
              Book Consultation
            </button>
            <a
              href="https://wa.me/88017"
              className="flex transform items-center justify-center gap-2 rounded-2xl border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gray-900 text-white">
      {/* Background glow */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <h3 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                Endow Global
              </h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Empowering students worldwide with world-class education consultancy services and
              comprehensive career guidance.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <button
                  key={social}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors duration-300 hover:bg-[#C41E3A]"
                >
                  <span className="text-xs font-bold">{social.charAt(0)}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Universities', 'Scholarships', 'Apply Now', 'Contact'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Column 3 - Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-semibold text-white">Services</h4>
            <ul className="space-y-3">
              {['Counseling', 'Visa Processing', 'SOP Support', 'Accommodation'].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-semibold text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C41E3A]" />
                <span className="text-sm text-gray-400">123 Education Lane, Dhaka, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-[#C41E3A]" />
                <span className="text-sm text-gray-400">+880 1700 000 000</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-[#C41E3A]" />
                <span className="text-sm text-gray-400">+82 010 0000 0000</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-[#C41E3A]" />
                <span className="text-sm text-gray-400">info@endowglobal.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl"
        >
          <div className="max-w-2xl">
            <h3 className="mb-3 text-2xl font-bold text-white">Subscribe to Updates</h3>
            <p className="mb-6 text-gray-400">
              Get the latest news about universities, scholarships, and visa updates.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-[#C41E3A] focus:outline-none"
              />
              <button className="rounded-xl bg-[#C41E3A] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-red-500/30">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2026 Endow Global Education. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                Terms & Conditions
              </a>
              <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Placeholder for missing icon
function Home(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  )
}

// Main About Page Component
export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <WhoWeAreSection />
      <WhyChooseUsSection />
      <MissionVisionSection />
      <FounderMessageSection />
      <StudentSuccessSection />
      <UniversityPartnersSection />
      <ConsultationCTASection />
      <Footer />
    </div>
  )
}
