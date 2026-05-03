import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#C41E3A] flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">E</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                Endow<span className="text-[#C41E3A]">Global</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your trusted partner for international education. We simplify the journey from application to enrollment with AI-powered matchmaking.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Students</h3>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-sm text-gray-500 hover:text-[#C41E3A]">Find a Course</Link></li>
              <li><Link href="/universities" className="text-sm text-gray-500 hover:text-[#C41E3A]">Top Universities</Link></li>
              <li><Link href="/scholarships" className="text-sm text-gray-500 hover:text-[#C41E3A]">Scholarships</Link></li>
              <li><Link href="/counseling" className="text-sm text-gray-500 hover:text-[#C41E3A]">Free Counseling</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Destinations</h3>
            <ul className="space-y-3">
              <li><Link href="/destinations/uk" className="text-sm text-gray-500 hover:text-[#C41E3A]">Study in UK</Link></li>
              <li><Link href="/destinations/usa" className="text-sm text-gray-500 hover:text-[#C41E3A]">Study in USA</Link></li>
              <li><Link href="/destinations/australia" className="text-sm text-gray-500 hover:text-[#C41E3A]">Study in Australia</Link></li>
              <li><Link href="/destinations/canada" className="text-sm text-gray-500 hover:text-[#C41E3A]">Study in Canada</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-[#C41E3A]">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 hover:text-[#C41E3A]">Careers</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-[#C41E3A]">Contact Support</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-[#C41E3A]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Endow Global Education. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons placeholder */}
            <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#C41E3A] hover:text-white transition-colors cursor-pointer flex items-center justify-center text-sm">in</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#C41E3A] hover:text-white transition-colors cursor-pointer flex items-center justify-center text-sm">fb</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-[#C41E3A] hover:text-white transition-colors cursor-pointer flex items-center justify-center text-sm">tw</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
