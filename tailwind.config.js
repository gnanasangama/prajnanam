module.exports = {
  theme: {
    extend: {
      colors: {
      },
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure your src directory is included
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require('@tailwindcss/typography')],
};