/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6d28d9',
        secondary: '#4c1d95',
        dark: '#0f172a',
        darker: '#020617',
        accent: '#38bdf8',
      }
    },
  },
  plugins: [],
}
