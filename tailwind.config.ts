import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        // Apple-proof palette
        background: {
          DEFAULT: '#FAFAF8',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F5F7',
          dark: '#1C1C1E',
          'dark-secondary': '#2C2C2E',
        },
        foreground: {
          DEFAULT: '#1D1D1F',
          secondary: '#86868B',
          dark: '#F5F5F7',
          'dark-secondary': '#A1A1A6',
        },
        // Brand colors - sublimés
        sage: {
          DEFAULT: '#7A8B6F',
          light: '#A8B5A0',
          dark: '#5C6B52',
        },
        terracotta: {
          DEFAULT: '#C9A092',
          light: '#D4A59A',
          dark: '#B08878',
        },
        sky: {
          DEFAULT: '#5AC8FA',
          light: '#C8D8E4',
        },
        mauve: {
          DEFAULT: '#CCA6C8',
          light: '#E0C8DC',
          dark: '#A882A4',
        },
        // Legacy support
        beige: '#FAFAF8',
        brown: '#1D1D1F',
      },
      borderRadius: {
        'apple': '16px',
        'apple-lg': '20px',
        'apple-xl': '24px',
      },
      boxShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'apple-elevated': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      fontSize: {
        // Apple typography scale
        'hero': ['80px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline': ['40px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title': ['28px', { lineHeight: '1.14', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-large': ['21px', { lineHeight: '1.47', letterSpacing: '0' }],
        'body': ['17px', { lineHeight: '1.47', letterSpacing: '0' }],
        'callout': ['14px', { lineHeight: '1.43', letterSpacing: '0' }],
        'caption': ['12px', { lineHeight: '1.33', letterSpacing: '0' }],
      },
      spacing: {
        'apple-section': '120px',
        'apple-content': '80px',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}
export default config
