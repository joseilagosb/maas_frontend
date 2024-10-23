/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        'condensed-light': ['Open\\ Sans\\ Condensed\\ Light', 'sans-serif'],
        'condensed-regular': ['Open\\ Sans\\ Condensed\\ Regular', 'sans-serif'],
        'condensed-medium': ['Open\\ Sans\\ Condensed\\ Medium', 'sans-serif'],
        'condensed-semibold': ['Open\\ Sans\\ Condensed\\ Semi\\ Bold', 'sans-serif'],
        'condensed-bold': ['Open\\ Sans\\ Condensed\\ Bold', 'sans-serif'],
        'condensed-extrabold': ['Open\\ Sans\\ Condensed\\ Extra\\ Bold', 'sans-serif'],
        light: ['Open\\ Sans\\ Light', 'sans-serif'],
        regular: ['Open\\ Sans\\ Regular', 'sans-serif'],
        medium: ['Open\\ Sans\\ Medium', 'sans-serif'],
        semibold: ['Open\\ Sans\\ Semi\\ Bold', 'sans-serif'],
        bold: ['Open\\ Sans\\ Bold', 'sans-serif'],
        'extra-bold': ['Open\\ Sans\\ Extra\\ Bold', 'sans-serif']
      }
    }
  },
  plugins: []
}
