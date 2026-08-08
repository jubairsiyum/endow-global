/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#AD0819",
        brand: {
          50: "#fef2f4",
          100: "#fde6ea",
          200: "#fbd0d9",
          300: "#f7a8ba",
          400: "#f17393",
          500: "#e7446c",
          600: "#C41E3A",
          700: "#A01830",
          800: "#7A0713",
          900: "#5C0510",
        },
        surface: {
          0: "#ffffff",
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"IBM Plex Mono"',
          "ui-monospace",
          "monospace",
        ],
        grotesk: [
          '"Space Grotesk"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        "sa-ink": "#f8fafc",
        "sa-surface": "#ffffff",
        "sa-border": "#e5e7eb",
        "sa-text-primary": "#111827",
        "sa-text-secondary": "#6b7280",
        "sa-route": "#E8A33D",
        "sa-success": "#4FD1A5",
        "sa-alert": "#F0625B",
      },

      boxShadow: {
        "premium-sm": "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
        "premium": "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
        "premium-lg": "0 10px 15px -3px rgba(0,0,0,0.05), 0 20px 40px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
        "premium-xl": "0 20px 25px -5px rgba(0,0,0,0.06), 0 30px 60px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
        "glow-brand": "0 0 40px rgba(196, 30, 58, 0.15)",
        "glow-brand-lg": "0 0 80px rgba(196, 30, 58, 0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      backdropBlur: {
        xs: "2px",
      },

      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "marquee-slow": "marquee 40s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "logoGlow": "logoGlow 2.4s ease-in-out infinite",
        "premiumBounce": "premiumBounce 1.2s ease-in-out infinite",
        "status-pulse": "status-pulse 3s ease-in-out infinite",
        "arc-draw": "arc-draw 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        logoGlow: {
          "0%, 100%": { opacity: "0.6", filter: "drop-shadow(0 0 4px rgba(196, 30, 58, 0))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 12px rgba(196, 30, 58, 0.3))" },
        },
        premiumBounce: {
          "0%, 80%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.4" },
          "40%": { transform: "translateY(-12px) scale(1.15)", opacity: "1" },
        },
        "status-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "arc-draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },

  plugins: [],
};
