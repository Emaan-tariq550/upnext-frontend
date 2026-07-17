/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        upnext: {
          bg: '#0a0a0f',
          surface: '#14141c',
          border: '#232330',
          primary: '#a78bfa',
          primaryDark: '#7c3aed',
          gold: '#fbbf24',
          text: '#f4f4f5',
          muted: '#71717a',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};