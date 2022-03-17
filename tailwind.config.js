const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        banner: ['Oswald', ...defaultTheme.fontFamily.sans],
        ui: ['"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
        serif: ['Quattrocento', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    typography,
  ],
};
