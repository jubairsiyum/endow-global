'use client';

import { useState } from 'react';
import Link from 'next/link';

type MenuItem = {
  id: string;
  label: string;
  href: string;
  badge?: number;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'explore', label: 'Explore', href: '/explore' },
  { id: 'match', label: 'My Match', href: '/match' },
  { id: 'shortlist', label: 'Shortlist', href: '/shortlist' },
  { id: 'applications', label: 'Applications', href: '/applications' },
  { id: 'sessions', label: 'Sessions', href: '/sessions' },
  { id: 'messages', label: 'Messages', href: '/messages', badge: 3 },
  { id: 'referral', label: 'Refer & Earn', href: '/referral' },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 px-4 py-6 flex flex-col">
      {/* Logo/Branding - Optional */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Endow</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          const hasNotification = item.badge && item.badge > 0;

          return (
            <Link key={item.id} href={item.href}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {/* Left dot indicator */}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>

                {/* Right notification badge */}
                {hasNotification && (
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
                    {item.badge}
                  </div>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer section - Optional */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
