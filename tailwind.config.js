/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        instrument: ['"Instrument Sans"', "sans-serif"],
        inria: ['"Inria Serif"', "serif"],
      },
      fontSize: {
        h1: "28px",
        h2: "18px",
        body: "14px",
      },
      colors: {
        brand: {
          bg: "#f5f0ed",
          text: "#000000",
          inactive: "#bdbdbd",
        },
      },
      spacing: {
        0.5: "2px",
        1.5: "6px",
        6: "24px",
        8.5: "34px",
      },
    },
  },
  plugins: [],
};

export default config;
