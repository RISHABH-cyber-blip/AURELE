import type { Config } from 'tailwindcss'

/**
 * AURELE — design tokens
 * Direction: "dense structure, calm visuals" (luxury/minimal core,
 * borrowing JustInTime's proven e-commerce structure)
 *
 * Palette locked with the user:
 *   - Background: warm cream
 *   - Accent: gold / champagne
 *   - Headings: modern thin serif (Fraunces)
 *   - Body: clean sans (Inter)
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF6F0', // base background
          soft: '#F0E9DE',    // secondary surfaces / cards
          deep: '#E7DDCC',    // borders, dividers
        },
        ink: {
          DEFAULT: '#1A1A1A', // primary text (not pure black)
          soft: '#4A4640',    // secondary text
          faint: '#8C857A',   // tertiary / muted text
        },
        gold: {
          DEFAULT: '#B8935F', // champagne gold accent
          deep: '#9C7A4A',    // hover / pressed state
          light: '#D9C4A0',   // subtle highlight / badge bg
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],   // Fraunces — headings
        body: ['var(--font-body)', 'sans-serif'],     // Inter — body copy
        mono: ['var(--font-mono)', 'monospace'],      // labels / SKUs
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        calm: '600ms',
        slow: '800ms',
      },
      spacing: {
        section: '7rem',      // ~112px vertical breathing room between sections
        'section-lg': '9rem',
      },
      maxWidth: {
        content: '1400px',
      },
    },
  },
  plugins: [],
}

export default config
