const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

// Override default gray from Cool Gray to Gray
const themeColors = { ...defaultTheme.colors, ...{ gray: colors.gray } };

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: themeColors,
    extend: {
      fontFamily: {
        banner: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    typography,
  ],
}
