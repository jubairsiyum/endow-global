'use client';

import PillNav from '@/components/PillNav';

export default function Home() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Universities', href: '/universities' },
    { label: 'Courses', href: '/courses' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' }
  ];

  return (
    <div className="w-full">
      {/* PillNav at top center */}
      <div className="flex justify-center pt-8">
        <PillNav
          items={navItems}
          logo="/logo.svg"
          logoAlt="Logo"
          baseColor="#f3f4f6"
          pillColor="#ffffff"
          pillTextColor="#111827"
          hoveredPillTextColor="#ffffff"
          ease="power3.easeOut"
          initialLoadAnimation={true}
        />
      </div>

      {/* Your homepage content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
        <p className="text-lg text-gray-600">Navigate using the pill navbar at the top</p>
      </main>
    </div>
  );
}
