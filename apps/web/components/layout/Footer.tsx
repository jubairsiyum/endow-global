import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

const exploreLinks = [
  { label: 'Universities', href: '/universities' },
  { label: 'Courses', href: '/courses' },
  { label: 'Study Destinations', href: '/universities' },
  { label: 'Application Roadmap', href: '/#roadmap' },
] as const

const resourceLinks = [
  { label: 'Visa Guide', href: '/resources' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Student Stories', href: '/#stories' },
] as const

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/endowglobaledu', path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z' },
  { label: 'Instagram', href: 'https://www.instagram.com/endowglobaledu', path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z' },
  { label: 'X', href: 'https://x.com/endowglobaledu', path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/endow-global-education/', path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z' },
] as const

const footerLink = 'text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#12141c]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/logo/endoedu.svg" alt="Endow Global Education" width={32} height={32} className="h-8 w-8" />
              <div className="leading-none">
                <span className="block text-sm font-bold tracking-tight text-gray-900 dark:text-white">Endow Global</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Education</span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Helping students turn international education goals into real opportunities.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#C41E3A] hover:bg-[#C41E3A] hover:text-white dark:border-gray-700 dark:text-gray-400"
                  aria-label={social.label}
                >
                  <svg className="h-4 w-4" viewBox="0 0 320 512" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Explore</h5>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h5>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Get in touch</h5>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#C41E3A]" />
                <span className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  H# 24/1 &amp; 24/2, Level# 8, Shyamoli Square, Mirpur Rd, Dhaka
                </span>
              </li>
              <li>
                <a href="mailto:contact@endowglobaledu.com" className="flex items-center gap-2.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Mail size={15} className="shrink-0 text-[#C41E3A]" />
                  contact@endowglobaledu.com
                </a>
              </li>
              <li>
                <a href="tel:+8801901463204" className="flex items-center gap-2.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <Phone size={15} className="shrink-0 text-[#C41E3A]" />
                  +880 190146 3204
                </a>
              </li>
              <li>
                <Link href="/about" className="text-sm font-medium text-[#C41E3A] transition-colors hover:text-[#A01830]">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row sm:px-8 lg:px-10">
          <p className="text-[13px] text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-[13px] text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">Terms</Link>
            <Link href="/privacy" className="text-[13px] text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">Privacy</Link>
            <Link href="/cookies" className="text-[13px] text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
