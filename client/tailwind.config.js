/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        display: ['"Archivo Black"', "system-ui", "sans-serif"],
      },
      colors: {
        neo: {
          bg: "#fff4e6",
          ink: "#0a0a0a",
          yellow: "#ffe500",
          pink: "#ff6b9d",
          mint: "#6dffc6",
          blue: "#4d9fff",
          lilac: "#c4a1ff",
          cream: "#fff8ee",
          paper: "#ffffff",
        },
      },
      boxShadow: {
        neo: "6px 6px 0 0 #0a0a0a",
        "neo-sm": "4px 4px 0 0 #0a0a0a",
      },
    },
  },
  plugins: [],
};
