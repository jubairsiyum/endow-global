import Link from 'next/link'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Universities', href: '/universities' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const

type NavbarProps = {
  activeItem?: (typeof navItems)[number]['label']
}

export function Navbar({ activeItem = 'Universities' }: NavbarProps) {
  return (
    <div className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 sm:px-6">
      <nav className="w-fit max-w-[calc(100vw-2rem)] rounded-full border border-gray-200 bg-gray-100 px-6 py-2 shadow-md shadow-gray-200/70">
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-6 whitespace-nowrap font-sans text-sm font-medium">
            {navItems.map((item) => {
              const isActive = item.label === activeItem

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-red-500 px-4 py-1.5 font-semibold text-white hover:bg-red-600 hover:scale-[1.02]'
                      : 'px-3 py-2 text-gray-600 hover:text-gray-900',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}