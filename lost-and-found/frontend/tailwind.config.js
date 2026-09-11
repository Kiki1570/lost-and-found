/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
        'lost-gradient': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        'found-gradient': 'linear-gradient(135deg, #0be881, #05c46b)',
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-rose':'0 0 20px rgba(244, 63, 94, 0.3)',
        'glow-teal':'0 0 20px rgba(20, 184, 166, 0.3)',
        'card':    '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover':'0 12px 40px rgba(0,0,0,0.14)',
        'float':   '0 20px 60px rgba(99,102,241,0.25)',
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out',
        'slide-up':  'slideUp 0.5s ease-out',
        'slide-in':  'slideIn 0.4s ease-out',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':     'float 6s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from:{opacity:'0'}, to:{opacity:'1'} },
        slideUp: { from:{transform:'translateY(24px)',opacity:'0'}, to:{transform:'translateY(0)',opacity:'1'} },
        slideIn: { from:{transform:'translateX(-16px)',opacity:'0'}, to:{transform:'translateX(0)',opacity:'1'} },
        float:   { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-12px)'} },
        shimmer: { from:{backgroundPosition:'-200% 0'}, to:{backgroundPosition:'200% 0'} },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
