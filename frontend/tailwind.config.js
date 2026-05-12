/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#0D1B2A",
          mid: "#1B3A5C",
          DEFAULT: "#0D1B2A",
        },
        accent: {
          blue: "#2D7DD2",
          teal: "#10B981",
          amber: "#F59E0B",
          coral: "#EF4444",
        },
        surface: {
          light: "#F0F4F8",
          card: "#FFFFFF",
        },
        muted: "#64748B",
        border: {
          subtle: "#E2E8F0",
        },
        text: {
          primary: "#0F172A",
          secondary: "#475569",
        }
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        'card': '6px',
        'input': '4px',
      }
    },
  },
  plugins: [],
}
