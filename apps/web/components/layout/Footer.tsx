import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C41E3A]">
                <span className="text-sm font-bold leading-none text-white">E</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Endow<span className="text-[#C41E3A]">Global</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Your trusted partner for international education. We simplify the journey from
              application to enrollment with AI-powered matchmaking.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Students</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Find a Course
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Top Universities
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/counseling" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Free Counseling
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Destinations</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/destinations/uk"
                  className="text-sm text-gray-500 hover:text-[#C41E3A]"
                >
                  Study in UK
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/usa"
                  className="text-sm text-gray-500 hover:text-[#C41E3A]"
                >
                  Study in USA
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/australia"
                  className="text-sm text-gray-500 hover:text-[#C41E3A]"
                >
                  Study in Australia
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/canada"
                  className="text-sm text-gray-500 hover:text-[#C41E3A]"
                >
                  Study in Canada
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-gray-900">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#C41E3A]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons placeholder */}
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm transition-colors hover:bg-[#C41E3A] hover:text-white">
              in
            </div>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm transition-colors hover:bg-[#C41E3A] hover:text-white">
              fb
            </div>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm transition-colors hover:bg-[#C41E3A] hover:text-white">
              tw
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
