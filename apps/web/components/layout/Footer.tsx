import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

import { contactDetails } from '@/components/marketing/contact-details'

const studentLinks = [
  { label: 'Top Universities', href: '/universities' },
  { label: 'Explore Courses', href: '/courses' },
  { label: 'Stories', href: '/blog' },
  { label: 'Apply Now', href: '/register' },
] as const

const aboutLinks = [
  { label: 'About Us', href: '/about' },
  { label: "Founder's Message", href: '/founders-message' },
  { label: 'Why Endow Global', href: '/why-endow-global' },
  { label: 'Mission & Vision', href: '/mission-vision' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C41E3A]">
                <span className="text-sm font-bold leading-none text-white">E</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Endow<span className="text-[#C41E3A]">Global</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Guiding Bangladeshi students toward international academic success in South
              Korea with personalized support and experienced consultants.
            </p>
            <p className="mt-4 text-sm font-semibold text-[#C41E3A]">
              Global Vision, Guided Path
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Students</h3>
            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#C41E3A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">About Endow</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-[#C41E3A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Get in touch</h3>
            <ul className="space-y-4 text-sm leading-6 text-gray-500">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-[#C41E3A]" />
                <span>{contactDetails.address}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 flex-none text-[#C41E3A]" />
                <span>{contactDetails.email}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-none text-[#C41E3A]" />
                <span>{contactDetails.phoneBangladesh}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-none text-[#C41E3A]" />
                <span>{contactDetails.phoneKorea}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-[#C41E3A]">
              Privacy Policy
            </Link>
            <span className="text-sm text-gray-300">Terms of services</span>
            <span className="text-sm text-gray-300">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
