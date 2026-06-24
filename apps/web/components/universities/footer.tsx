import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/config/site'
import {
  universityFooterLinks,
  resourceFooterLinks,
  socialLinks,
  legalFooterLinks,
} from '@/components/footer/footer-data'

const linkItemClass =
  'group flex items-center gap-2 text-[13px] text-gray-500 transition-colors hover:text-[#C41E3A]'

const accentBar = 'mt-2 mb-3 h-px w-8 bg-[#C41E3A] sm:mt-3 sm:mb-4'

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
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.logoAlt}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="leading-none">
                <span className="block text-[13px] font-bold tracking-tight text-gray-900">
                  {SITE_CONFIG.shortName}
                </span>
                <span className="block text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
                  {SITE_CONFIG.tagline}
                </span>
              </div>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500 text-justify sm:mt-4 lg:max-w-xs">
              Your gateway to world-class universities. We connect students with 250+ partner
              institutions across South Korea, Australia, and beyond — guiding you from selection to
              enrollment.
            </p>
            <div className="mt-4 flex gap-2 sm:mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-300 hover:bg-[#C41E3A] hover:text-white hover:shadow-[0_4px_12px_rgba(196,30,58,0.2)]"
                  aria-label={social.ariaLabel}
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
              <div className={accentBar} />
              <ul className="space-y-1.5 sm:space-y-2.5">
                {universityFooterLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkItemClass}>
                      <ArrowRight
                        size={11}
                        className="text-[#C41E3A]/40 transition-transform group-hover:translate-x-0.5"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Resources */}
            <div>
              <h5 className="text-sm font-bold text-gray-900">Student Resources</h5>
              <div className={accentBar} />
              <ul className="space-y-1.5 sm:space-y-2.5">
                {resourceFooterLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkItemClass}>
                      <ArrowRight
                        size={11}
                        className="text-[#C41E3A]/40 transition-transform group-hover:translate-x-0.5"
                      />
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
            <div className={accentBar} />
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-[#C41E3A]"
                  aria-hidden="true"
                />
                <span className="text-[13px] leading-relaxed text-gray-500">
                  {SITE_CONFIG.address}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className={linkItemClass}
                  aria-label={`Email ${SITE_CONFIG.companyName}`}
                >
                  <Mail size={14} className="shrink-0 text-[#C41E3A]" aria-hidden="true" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.phoneBDHref}
                  className={linkItemClass}
                  aria-label="Bangladesh Office Phone"
                >
                  <Phone size={14} className="shrink-0 text-[#C41E3A]" aria-hidden="true" />
                  {SITE_CONFIG.phoneBD}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.phoneKRHref}
                  className={linkItemClass}
                  aria-label="South Korea Office Phone"
                >
                  <Phone size={14} className="shrink-0 text-[#C41E3A]" aria-hidden="true" />
                  {SITE_CONFIG.phoneKR}
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
            &copy; {new Date().getFullYear()} {SITE_CONFIG.companyName}. All rights reserved.
          </p>
          <nav aria-label="Legal links">
            <div className="flex items-center gap-4 sm:gap-5">
              {legalFooterLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] text-gray-400 transition-colors hover:text-gray-700 sm:text-[12px]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
