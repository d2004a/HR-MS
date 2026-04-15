/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e27',
          800: '#141b3d',
          700: '#1e2854',
        },
        electric: {
          DEFAULT: '#667eea',
          dark: '#5a6fd1',
        },
        violet: {
          DEFAULT: '#764ba2',
          light: '#8b5dbf',
        },
        success: '#00c9a7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
