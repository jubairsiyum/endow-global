import Link from 'next/link'
import { Button } from '../ui/button'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C41E3A] flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Endow<span className="text-[#C41E3A]">Global</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/destinations" className="text-sm font-medium text-gray-600 hover:text-[#C41E3A] transition-colors">Destinations</Link>
            <Link href="/universities" className="text-sm font-medium text-gray-600 hover:text-[#C41E3A] transition-colors">Universities</Link>
            <Link href="/courses" className="text-sm font-medium text-gray-600 hover:text-[#C41E3A] transition-colors">Courses</Link>
            <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-[#C41E3A] transition-colors">Services</Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up free</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
