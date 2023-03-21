/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  important: true,
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    }
  },
  plugins: [],
};
