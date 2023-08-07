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
        darkerPurple: "#1b1625",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }

        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
