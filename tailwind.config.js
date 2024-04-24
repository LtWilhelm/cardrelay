/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ash: "#111418",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
};
