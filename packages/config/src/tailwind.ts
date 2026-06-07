import type { Config } from 'tailwindcss'

const config: Partial<Config> = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#FFF0F2',
          100: '#FFD6DC',
          200: '#FFB0BC',
          300: '#FF7A8D',
          400: '#FF3D58',
          500: '#C41E3A',
          600: '#A01830',
          700: '#8B1528',
          800: '#6B0F1E',
          900: '#4A0A15',
          DEFAULT: '#C41E3A',
        },
        brand: {
          primary: '#C41E3A',
          secondary: '#8B1528',
          accent: '#FF3D58',
          light: '#FFF0F2',
          dark: '#4A0A15',
        },
      },
      fontFamily: {
        heading: ['Quicksand', 'var(--font-quicksand)', 'sans-serif'],
        body: ['Google Sans', 'var(--font-google-sans)', 'sans-serif'],
        sans: ['Google Sans', 'var(--font-google-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'abstract-dots': 'radial-gradient(circle, #C41E3A15 1px, transparent 1px)',
        'abstract-lines':
          'repeating-linear-gradient(45deg, transparent, transparent 10px, #C41E3A08 10px, #C41E3A08 11px)',
        'hero-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C41E3A' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        brand: '0 4px 24px -4px rgba(196, 30, 58, 0.3)',
        'brand-lg': '0 8px 40px -4px rgba(196, 30, 58, 0.25)',
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}

export default config
