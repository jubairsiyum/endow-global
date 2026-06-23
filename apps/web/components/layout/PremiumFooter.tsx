import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const footerLinks = {
  Students: [
    { label: 'Find a Course', href: '/courses' },
    { label: 'Top Universities', href: '/universities' },
    { label: 'Scholarships', href: '/scholarships' },
    { label: 'Free Counseling', href: '/register' },
    { label: 'Application Tracker', href: '/dashboard' },
  ],
  Destinations: [
    { label: 'Study in South Korea', href: '/universities?country=south-korea' },
    { label: 'Study in UK', href: '/universities?country=uk' },
    { label: 'Study in Finland', href: '/universities?country=finland' },
    { label: 'Study in Australia', href: '/universities?country=australia' },
    { label: 'Study in USA', href: '/universities?country=usa' },
    { label: 'Study in Canada', href: '/universities?country=canada' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Study Abroad Guide', href: '/blog' },
    { label: 'Visa Requirements', href: '/blog' },
    { label: 'Scholarship Guide', href: '/blog' },
    { label: 'Student Stories', href: '/blog' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Contact Support', href: '/about' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
  ],
} as const

export default function PremiumFooter() {
  return (
    <footer className="border-t border-surface-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C41E3A]">
                <span className="text-sm font-bold leading-none text-white">E</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight text-surface-900">
                Endow<span className="text-[#C41E3A]">Global</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-400">
              Your trusted partner for international education. We simplify the
              journey from application to enrollment.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500">
                Stay updated
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-9 flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 text-xs outline-none transition-all focus:border-[#C41E3A]/30 focus:bg-white focus:ring-2 focus:ring-[#C41E3A]/10"
                />
                <button className="flex h-9 items-center gap-1 rounded-lg bg-[#C41E3A] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#A01830]">
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-surface-900">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-400 transition-colors hover:text-[#C41E3A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-100 py-6 sm:flex-row">
          <p className="text-xs text-surface-400">
            © {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Trust badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-surface-100 bg-surface-50 px-2 py-0.5 text-[10px] font-semibold text-surface-500">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                SSL Secure
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-surface-100 bg-surface-50 px-2 py-0.5 text-[10px] font-semibold text-surface-500">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                FERPA Compliant
              </span>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {['LinkedIn', 'Facebook', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-50 text-[10px] font-bold text-surface-400 transition-colors hover:bg-[#C41E3A]/[0.06] hover:text-[#C41E3A]"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
