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

        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },

      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],

        heading: [
          "var(--font-quicksand)",
          "sans-serif",
        ],
      },

      boxShadow: {
        soft:
          "0 10px 40px rgba(0,0,0,0.08)",
      },

      borderRadius: {
        "4xl": "2rem",
      },
    },
  },

  fontFamily: {
  sans: ["Inter", "sans-serif"],
  heading: ["var(--font-quicksand)", "sans-serif"],
},

  plugins: [],
};