/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx,css}',
    './layouts/**/*.json',
    './components.json',
    './routes.json',
    './template.json',
  ],
  safelist: [
    'fixed',
    'bottom-6',
    'right-6',
    'z-50',
    'dark',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
