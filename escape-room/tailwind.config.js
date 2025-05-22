/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'escape-primary': '#1a1a2e',
        'escape-secondary': '#16213e',
        'escape-accent': '#0f3460',
        'escape-highlight': '#e94560',
      },
      fontFamily: {
        'escape': ['var(--font-escape)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 