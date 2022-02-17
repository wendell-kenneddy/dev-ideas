module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    'src/styles/**/*.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      screens: {
        fold: { max: '280px' }
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
