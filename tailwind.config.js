const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        banner: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    typography,
  ],
}
