/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.html`],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['fantasy'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

