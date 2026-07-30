/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#111A2E',
          800: '#1C2942',
          700: '#2B3A59',
          600: '#3E5079',
        },
        paper: {
          50: '#F7F8FA',
          100: '#EFF2F6',
          200: '#E3E8EF',
        },
        brass: {
          400: '#C8942B',
          500: '#B37D1F',
          600: '#8F6417',
        },
        stamp: {
          approved: '#0F7B54',
          pending: '#B37D1F',
          rejected: '#B0392D',
          draft: '#5B6B85',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'perforation': 'repeating-linear-gradient(to right, transparent 0 6px, #D8DEE7 6px 8px)',
      },
    },
  },
  plugins: [],
};
