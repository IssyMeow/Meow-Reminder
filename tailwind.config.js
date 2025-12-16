/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-bg': 'rgba(25, 25, 40, 0.6)', 
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'accent-yellow': '#F3C969', 
        'accent-blue': '#5DA9E9',   
        'accent-brown': '#8B5E3C',  
        'accent-black': '#2C2C2C',  
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
