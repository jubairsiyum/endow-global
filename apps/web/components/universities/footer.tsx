"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      "All Universities",
      "Scholarships",
      "Study Destinations",
      "Blog",
    ],
  },
  {
    title: "Popular Universities",
    links: [
      "Hanseo University",
      "Daejin University",
      "Dong-Eui University",
      "Sejong University",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Contact Us",
      "Privacy Policy",
      "Terms & Conditions",
    ],
  },
];

export default function UniversitiesFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-b border-gray-800"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Newsletter Form */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Stay Updated</h3>
              <p className="text-sm text-gray-400">
                Get the latest university opportunities, scholarship updates, and
                study tips delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-full border border-gray-700 bg-gray-800/50 px-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button className="h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 font-semibold hover:shadow-lg transition-shadow">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Downloads */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Resources</h3>
              <div className="space-y-3">
                <button className="block h-12 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-5 text-left text-sm hover:border-blue-500 transition-colors sm:w-auto">
                  Download Study Guide
                </button>
                <button className="block h-12 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-5 text-left text-sm hover:border-blue-500 transition-colors sm:w-auto">
                  Download Visa Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Endow
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Your gateway to global education excellence
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <a
                  href="mailto:info@endow.edu"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  info@endow.edu
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <a
                  href="tel:+18001234567"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>123 Education Lane</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Links Grid */}
          {footerLinks.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-3"
            >
              <h4 className="font-bold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 space-y-6 border-t border-gray-800 pt-8"
        >
          {/* Social Links - Text only for now */}
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">f</a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">x</a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">in</a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">ig</a>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              © 2026 Endow Global. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Trusted by students worldwide - Partner of 250+ Universities
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
