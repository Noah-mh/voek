/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        Barlow: ["Barlow", "sans-serif"],
        Merriweather: ["Merriweather", "serif"],
      },
      colors: {
        purpleAccent: "#310d20",
        greyAccent: "#484848",
        softerPurple: "#5c4444",
        lighterGreyAccent: "#dbdce0",
        pink: "#de8285",
      },
    },
  },
  plugins: [],
};
