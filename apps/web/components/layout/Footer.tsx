import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/endowglobaledu',
    viewBox: '0 0 24 24',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/endowglobaledu',
    viewBox: '0 0 24 24',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X',
    href: 'https://x.com/endowglobaledu',
    viewBox: '0 0 24 24',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/endow-global-education/',
    viewBox: '0 0 24 24',
    path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
  },
] as const

const footerLink =
  'text-base sm:text-[17px] text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 leading-relaxed'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#12141c]">
      <div className="mx-auto max-w-[1240px] px-6 pb-0 pt-12 sm:px-8 sm:pb-0 sm:pt-14 lg:px-10 lg:pb-0 lg:pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo/endoedu.svg"
                alt="Endow Global Education"
                width={48}
                height={48}
                className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
              />
              <div className="leading-tight">
                <span className="block text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                  Endow Global
                </span>
                <span className="block text-[13px] font-semibold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 sm:text-sm">
                  Education
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[17px]">
              Helping students turn international education goals into real opportunities.
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-[#C41E3A] hover:bg-[#C41E3A] hover:text-white dark:border-gray-700 dark:text-gray-400"
                  aria-label={social.label}
                >
                  <svg className="h-3.5 w-3.5" viewBox={social.viewBox} fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h5 className="text-[17px] font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
              Explore
            </h5>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-[17px] font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
              Resources
            </h5>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h5 className="text-[17px] font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg">
              Get in touch
            </h5>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 shrink-0 text-[#C41E3A]" />
                <span className="text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[17px]">
                  H# 24/1 &amp; 24/2, Level# 8, Shyamoli Square, Mirpur Rd, Dhaka
                </span>
              </li>
              <li>
                <a
                  href="mailto:contact@endowglobaledu.com"
                  className="flex items-center gap-3 text-base text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 sm:text-[17px]"
                >
                  <Mail size={20} className="shrink-0 text-[#C41E3A]" />
                  contact@endowglobaledu.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801901463204"
                  className="flex items-center gap-3 text-base text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 sm:text-[17px]"
                >
                  <Phone size={20} className="shrink-0 text-[#C41E3A]" />
                  +880 190146 3204
                </a>
              </li>
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="text-base font-semibold text-[#C41E3A] transition-colors hover:text-[#A01830] sm:text-[17px]"
                >
                  Contact us &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Full-width Giant Brand Typographic Watermark                 */}
      {/* Edge-to-edge full width with expanded letter spacing         */}
      {/* ============================================================ */}
      <div className="-mb-15 pointer-events-none relative -mt-4 w-full select-none overflow-hidden opacity-15 sm:-mt-8 lg:-mb-12 lg:-mt-10">
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full select-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="endow-global-watermark" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#C41E3A" stopOpacity="1" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="120"
            textAnchor="middle"
            textLength="1380"
            lengthAdjust="spacing"
            fill="url(#endow-global-watermark)"
            className="uppercase"
            style={{
              fontFamily:
                "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: '148px',
              fontWeight: 700,
            }}
          >
            Endow Global
          </text>
        </svg>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-[#12141c]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row sm:px-8 lg:px-10">
          <p className="text-[15px] text-gray-500 dark:text-gray-400 sm:text-base">
            &copy; {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-[15px] text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:text-base"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[15px] text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:text-base"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-[15px] text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 sm:text-base"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
