/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#02baff',
        secondary: '#ff6eb5',
        yellow: '#ffd000',
        background: '#f8fafc',
        text: '#1a1a2e',
        corporate: '#2e6a8e',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
