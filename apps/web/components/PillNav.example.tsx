/**
 * PILNAV INTEGRATION EXAMPLE
 *
 * This file demonstrates how to use the PillNav component in your Next.js application.
 * 
 * Setup:
 * 1. GSAP dependency is already installed
 * 2. PillNav.tsx and PillNav.css are in components/
 * 3. Import and use as shown below
 */

import PillNav from '@/components/PillNav';

// Example 1: Basic Usage with Default Colors
export function BasicPillNav() {
  return (
    <PillNav
      items={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Contact', href: '/contact' }
      ]}
      activeHref="/"
      logo="/logo.svg"
      logoAlt="Company Logo"
    />
  );
}

// Example 2: Dark Theme with Custom Colors
export function DarkPillNav() {
  return (
    <PillNav
      logo="/logo.svg"
      logoAlt="Endow Logo"
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Explore', href: '/explore' },
        { label: 'Match', href: '/match' },
        { label: 'Messages', href: '/messages', ariaLabel: 'Messages (3 unread)' }
      ]}
      activeHref="/dashboard"
      baseColor="#1a1a1a"
      pillColor="#ffffff"
      pillTextColor="#000000"
      hoveredPillTextColor="#000000"
      ease="power2.easeOut"
      initialLoadAnimation
    />
  );
}

// Example 3: Endow Application Navigation
export function EndowPillNav() {
  return (
    <PillNav
      logo="/endow-logo.svg"
      logoAlt="Endow"
      items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Explore', href: '/explore' },
        { label: 'My Match', href: '/match' },
        { label: 'Shortlist', href: '/shortlist' },
        { label: 'Applications', href: '/applications' },
        { label: 'Sessions', href: '/sessions' },
        { label: 'Messages', href: '/messages', ariaLabel: 'Messages' },
        { label: 'Refer & Earn', href: '/referral' }
      ]}
      activeHref="/dashboard"
      baseColor="#ffffff"
      pillColor="#f3f4f6"
      pillTextColor="#1f2937"
      hoveredPillTextColor="#1f2937"
      ease="power3.easeOut"
      initialLoadAnimation={true}
      onMobileMenuClick={() => console.log('Mobile menu toggled')}
    />
  );
}

/**
 * INTEGRATION INTO LAYOUT
 *
 * Add PillNav to your root layout like this:
 *
 * app/layout.tsx
 * ──────────────
 *
 * import PillNav from '@/components/PillNav';
 *
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <PillNav
 *           logo="/logo.svg"
 *           logoAlt="Logo"
 *           items={[
 *             { label: 'Home', href: '/' },
 *             { label: 'Dashboard', href: '/dashboard' },
 *             { label: 'Products', href: '/products' },
 *           ]}
 *           activeHref="/"
 *           baseColor="#ffffff"
 *           pillColor="#f3f4f6"
 *           pillTextColor="#1f2937"
 *           hoveredPillTextColor="#000000"
 *         />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */

/**
 * PROP REFERENCE
 *
 * logo?: string
 *   - URL to the logo image
 *   - Displays in a circular container with rotation on hover
 *
 * logoAlt?: string (default: 'Logo')
 *   - Alt text for the logo image for accessibility
 *
 * items: PillNavItem[]
 *   - Array of navigation items
 *   - Each item has: label (string), href (string), ariaLabel? (string)
 *   - Supports both internal routes and external links
 *
 * activeHref?: string
 *   - The href of the currently active navigation item
 *   - Automatically adds the 'is-active' class with styling
 *
 * className?: string (default: '')
 *   - Additional CSS classes for the navigation container
 *
 * ease?: string (default: 'power3.easeOut')
 *   - GSAP easing function for animations
 *   - Examples: 'power1.easeOut', 'power2.easeOut', 'power3.easeOut'
 *
 * baseColor?: string (default: '#fff')
 *   - Base background color for the navigation
 *   - Used as fallback for pill text color
 *
 * pillColor?: string (default: '#120F17')
 *   - Background color for navigation pills
 *
 * hoveredPillTextColor?: string (default: '#120F17')
 *   - Text color when hovering over pills
 *
 * pillTextColor?: string
 *   - Text color for navigation pills
 *   - If not provided, defaults to baseColor
 *
 * onMobileMenuClick?: () => void
 *   - Callback triggered when mobile menu button is clicked
 *
 * initialLoadAnimation?: boolean (default: false)
 *   - Enable scale and reveal animation on component mount
 *   - Animates logo scale and nav items width
 */

/**
 * STYLING NOTES
 *
 * The component uses CSS custom properties (variables) for theming:
 * - --base: baseColor prop
 * - --pill-bg: pillColor prop
 * - --hover-text: hoveredPillTextColor prop
 * - --pill-text: pillTextColor prop
 *
 * These are set as inline styles on the <nav> element and
 * can be overridden via the className prop if needed.
 */

/**
 * RESPONSIVE BEHAVIOR
 *
 * Desktop (> 768px):
 * - Displays full pill navigation menu
 * - Logo with rotation hover animation
 * - Smooth animations on hover
 *
 * Mobile (≤ 768px):
 * - Hamburger menu button
 * - Logo and mobile menu toggle
 * - Animated mobile menu popover
 * - Full-width responsive layout
 */

/**
 * ACCESSIBILITY
 *
 * - Proper ARIA labels for all interactive elements
 * - Role attributes for proper semantic structure
 * - Keyboard accessible navigation
 * - Optional ariaLabel prop for custom labels
 * - External links detected automatically
 */
