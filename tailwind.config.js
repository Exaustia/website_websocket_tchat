/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#151419",
        "secondary-color": "#514F4F",
        "tertiary-color": "#657786",
      },
      boxShadow: {
        header: " 0px 2px 7px rgba(7, 14, 20, 0.72)",
      },
    },
  },
  plugins: [],
};
