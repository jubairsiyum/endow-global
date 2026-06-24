import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const universityLinks = [
  { label: 'All Universities', href: '/universities' },
  { label: 'Partner Universities', href: '/universities' },
  { label: 'Top Ranked Universities', href: '/universities' },
  { label: 'Admission Requirements', href: '/universities' },
  { label: 'Destinations', href: '/universities' },
] as const

const resourceLinks = [
  { label: 'Scholarships', href: '/universities' },
  { label: 'Visa Guidance', href: '/universities' },
  { label: 'Student Life', href: '/blog' },
  { label: 'Accommodation', href: '/universities' },
  { label: 'Application Process', href: '/universities' },
] as const

const socials = [
  { label: 'Facebook', href: '#', path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z' },
  { label: 'Instagram', href: '#', path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z' },
  { label: 'X', href: '#', path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/endow-global-education/', path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z' },
] as const

export default function UniversitiesFooter() {
  return (
    <footer className="bg-[#f6f7fb]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-14 lg:px-8">
        {/* Mobile: stacked layout | lg: 4-column grid */}
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column — full width on mobile */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo/endoedu.svg"
                alt="Endow Global Education"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="leading-none">
                <span className="block text-[13px] font-bold tracking-tight text-gray-900">
                  Endow Global
                </span>
                <span className="block text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
                  Education
                </span>
              </div>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500 text-justify sm:mt-4 lg:max-w-xs">
              Your gateway to world-class universities. We connect students with 250+ partner institutions across South Korea, Australia, and beyond — guiding you from selection to enrollment.
            </p>
            <div className="mt-4 flex gap-2 sm:mt-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-300 hover:bg-[#C41E3A] hover:text-white hover:shadow-[0_4px_12px_rgba(196,30,58,0.2)]"
                  aria-label={social.label}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 320 512" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* 2-column wrapper for Universities + Student Resources on mobile */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-2 lg:grid-cols-2 lg:gap-8">
            {/* Universities */}
            <div>
              <h5 className="text-sm font-bold text-gray-900">Universities</h5>
              <div className="mt-2 mb-3 h-px w-8 bg-[#C41E3A] sm:mt-3 sm:mb-4" />
              <ul className="space-y-1.5 sm:space-y-2.5">
                {universityLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]"
                    >
                      <ArrowRight size={11} className="text-[#C41E3A]/40 transition-transform group-hover:translate-x-0.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Resources */}
            <div>
              <h5 className="text-sm font-bold text-gray-900">Student Resources</h5>
              <div className="mt-2 mb-3 h-px w-8 bg-[#C41E3A] sm:mt-3 sm:mb-4" />
              <ul className="space-y-1.5 sm:space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]"
                    >
                      <ArrowRight size={11} className="text-[#C41E3A]/40 transition-transform group-hover:translate-x-0.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Get in Touch — full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h5 className="text-sm font-bold text-gray-900">Get in Touch</h5>
            <div className="mt-2 mb-3 h-px w-8 bg-[#C41E3A] sm:mt-3 sm:mb-4" />
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#C41E3A]" />
                <span className="text-[13px] leading-relaxed text-gray-500">
                  3rd floor, House -17, Road - 01, Mohammadia Housing Society, Mohammadpur, Adabor, Dhaka-1207
                </span>
              </li>
              <li>
                <a
                  href="mailto:contact@endowglobaledu.com"
                  className="group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]"
                >
                  <Mail size={14} className="shrink-0 text-[#C41E3A]" />
                  contact@endowglobaledu.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801901463200"
                  className="group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]"
                >
                  <Phone size={14} className="shrink-0 text-[#C41E3A]" />
                  +880 190146 3204
                </a>
              </li>
              <li>
                <a
                  href="tel:+821057672559"
                  className="group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]"
                >
                  <Phone size={14} className="shrink-0 text-[#C41E3A]" />
                  +82 1057 6725 59
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row sm:gap-4 sm:py-6 sm:px-6 lg:px-8">
          <p className="text-[12px] text-gray-400 sm:text-[13px]">
            &copy; {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="#" className="text-[11px] text-gray-400 transition-colors hover:text-gray-700 sm:text-[12px]">
              Terms of Service
            </Link>
            <Link href="#" className="text-[11px] text-gray-400 transition-colors hover:text-gray-700 sm:text-[12px]">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[11px] text-gray-400 transition-colors hover:text-gray-700 sm:text-[12px]">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
