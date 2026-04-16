/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olympia: {
          dark: '#09090b', // zinc-950
          card: '#18181b', // zinc-900
          border: '#27272a', // zinc-800
          red: '#dc2626', // red-600
          redHover: '#b91c1c', // red-700
          text: '#f4f4f5', // zinc-50
          muted: '#a1a1aa', // zinc-400
        }
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
