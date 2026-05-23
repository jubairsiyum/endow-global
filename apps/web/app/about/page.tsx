'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24 pb-12">
      {/* Background glow elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 mb-6"
          >
            <Globe className="w-4 h-4 text-[#C41E3A]" />
            <span className="text-sm font-semibold text-[#C41E3A]">
              Global Education Leader
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Empowering Students For{' '}
            <span className="bg-gradient-to-r from-[#C41E3A] via-red-500 to-red-600 bg-clip-text text-transparent">
              Global Academic Success
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUpVariants}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          >
            We guide ambitious students through every step of their international
            education journey. From university selection to visa approval, we're
            your trusted partner in achieving your global dreams.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-3 bg-[#C41E3A] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1">
              Start Your Journey
            </button>
            <button className="px-8 py-3 border-2 border-gray-200 text-gray-900 rounded-2xl font-semibold hover:border-[#C41E3A] hover:bg-red-50 transition-all duration-300">
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
          <motion.div
            animate="animate"
            variants={floatingVariants}
            className="relative"
          >
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-2xl" />

            {/* Main card */}
            <div className="relative backdrop-blur-2xl bg-white/80 border border-white/60 rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                {/* Stat 1 */}
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-transparent mb-2">
                    5000+
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Students Guided</p>
                </div>

                {/* Stat 2 */}
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-transparent mb-2">
                    95%
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Visa Success</p>
                </div>

                {/* Stat 3 */}
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-transparent mb-2">
                    20+
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Partner Universities</p>
                </div>

                {/* Stat 4 */}
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-br from-[#C41E3A] to-red-600 bg-clip-text text-transparent mb-2">
                    10+
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Countries</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Who We Are Section
const WhoWeAreSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-2xl" />
            <div className="relative w-full h-96 bg-gradient-to-br from-[#C41E3A]/20 to-red-200/20 rounded-3xl overflow-hidden border border-white/40 backdrop-blur-xl flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-32 h-32 mx-auto text-red-300 opacity-60" />
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
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Who We Are
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Endow Global Education is a premier international education consultancy
              dedicated to transforming the dreams of ambitious students into reality.
              With over a decade of experience and a team of certified education
              consultants, we've helped thousands of students navigate the complex
              journey to world-class universities.
            </motion.p>

            <motion.p
              variants={fadeUpVariants}
              className="text-base text-gray-600 mb-8 leading-relaxed"
            >
              Our mission extends beyond admissions. We believe in holistic student
              development, comprehensive support systems, and creating pathways to
              global success. We're not just consultants; we're mentors, advocates,
              and partners in your journey.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Students', value: '5000+' },
                { label: 'Universities', value: '200+' },
                { label: 'Scholarships', value: '$50M+' },
                { label: 'Visa Success', value: '95%' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/50 border border-white/60 rounded-2xl p-4 hover:bg-white/70 transition-all"
                >
                  <div className="text-2xl font-bold text-[#C41E3A] mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = () => {
  const services = [
    {
      icon: Users,
      title: 'Personalized Guidance',
      description:
        'One-on-one mentoring tailored to your academic profile and career aspirations.',
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
      description:
        'Post-graduation career planning and job placement assistance worldwide.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive services designed to support every aspect of your
            international education journey.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeUpVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 border border-white/60 rounded-3xl p-8 hover:border-red-200 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#C41E3A] to-red-600 rounded-xl">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C41E3A] to-transparent rounded-full w-0 group-hover:w-full transition-all duration-300" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// Mission & Vision Section
const MissionVisionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-2xl" />
            <div className="relative backdrop-blur-xl bg-white/70 border border-white/60 rounded-3xl p-10 hover:bg-white/80 transition-all duration-300 group-hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <Heart className="w-10 h-10 text-[#C41E3A]" />
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To empower students worldwide by providing comprehensive, honest,
                and personalized guidance that transforms their international education
                aspirations into tangible achievements. We believe every student deserves
                access to world-class education regardless of their background.
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-300/10 rounded-3xl blur-2xl" />
            <div className="relative backdrop-blur-xl bg-white/70 border border-white/60 rounded-3xl p-10 hover:bg-white/80 transition-all duration-300 group-hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                To build a globally connected community of accomplished alumni who
                lead transformative change in their fields and societies. We envision
                a world where geographical boundaries don't limit access to quality
                education and career opportunities.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Founder Message Section
const FounderMessageSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-2xl" />
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden border border-gray-200 flex items-center justify-center">
              <Briefcase className="w-32 h-32 text-gray-300" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUpVariants}
              className="inline-block mb-4"
            >
              <p className="text-sm font-semibold text-[#C41E3A] uppercase tracking-wider">
                From Our Founder
              </p>
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              className="text-4xl font-bold text-gray-900 mb-6"
            >
              Transforming Dreams Into Reality
            </motion.h2>

            <motion.blockquote
              variants={fadeUpVariants}
              className="text-2xl font-semibold text-gray-800 mb-8 italic border-l-4 border-[#C41E3A] pl-6"
            >
              "Every student has the potential to achieve greatness. Our mission is
              to unlock that potential and guide them towards a brighter global future."
            </motion.blockquote>

            <motion.p
              variants={fadeUpVariants}
              className="text-gray-700 leading-relaxed mb-8 text-lg"
            >
              When I started Endow Global Education over a decade ago, I witnessed
              firsthand how lack of proper guidance held back brilliant students. Today,
              with a team of passionate educators and consultants, we've helped thousands
              achieve their dreams at world-leading universities.
            </motion.p>

            <motion.p
              variants={fadeUpVariants}
              className="text-gray-600 leading-relaxed mb-8"
            >
              Our success isn't measured by numbers alone, but by the impact we create
              in the lives of our students and their families. We're committed to
              maintaining the highest standards of integrity, innovation, and excellence
              in everything we do.
            </motion.p>

            <motion.div variants={fadeUpVariants}>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Founder & CEO
              </p>
              <p className="text-gray-600">Endow Global Education</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

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
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from students who transformed their futures with our guidance.
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={fadeUpVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-300/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative backdrop-blur-xl bg-white/60 border border-white/60 rounded-3xl p-8 hover:border-red-200 transition-all duration-300 h-full flex flex-col">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#C41E3A] to-red-600 rounded-full mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                  "{testimonial.testimonial}"
                </p>

                {/* Footer */}
                <div className="border-t border-white/40 pt-4">
                  <p className="font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {testimonial.university} • {testimonial.country}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {testimonial.visa}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

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
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUpVariants}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our University Partners
          </h2>
          <p className="text-lg text-gray-600">
            Direct partnerships with 200+ institutions worldwide
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative py-8 overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 w-max"
          >
            {[...partners, ...partners].map((partner, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:border-[#C41E3A] transition-colors duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#C41E3A] to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {partner.charAt(0)}
                </div>
                <span className="font-semibold text-gray-900 whitespace-nowrap">
                  {partner}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Consultation CTA Section
const ConsultationCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#C41E3A] to-red-700 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUpVariants}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Ready to Start Your Journey?
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className="text-xl text-white/90 mb-10 leading-relaxed"
          >
            Get personalized guidance from our expert consultants. Schedule a free
            consultation today and take the first step towards your global education
            success.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-white text-[#C41E3A] rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Book Consultation
            </button>
            <a
              href="https://wa.me/88017"
              className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1 - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Endow Global
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering students worldwide with world-class education consultancy
              services and comprehensive career guidance.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C41E3A] transition-colors duration-300 flex items-center justify-center"
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
            <h4 className="font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Universities', 'Scholarships', 'Apply Now', 'Contact'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
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
            <h4 className="font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              {['Counseling', 'Visa Processing', 'SOP Support', 'Accommodation'].map(
                (service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {service}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#C41E3A] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Education Lane, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#C41E3A] flex-shrink-0" />
                <span className="text-gray-400 text-sm">+880 1700 000 000</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#C41E3A] flex-shrink-0" />
                <span className="text-gray-400 text-sm">+82 010 0000 0000</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-[#C41E3A] flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@endowglobal.com</span>
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
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-12"
        >
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">Subscribe to Updates</h3>
            <p className="text-gray-400 mb-6">
              Get the latest news about universities, scholarships, and visa updates.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#C41E3A]"
              />
              <button className="px-6 py-3 bg-[#C41E3A] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Endow Global Education. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

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
  );
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
  );
}
