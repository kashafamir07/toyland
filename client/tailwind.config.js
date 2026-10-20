/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        coral: {
          DEFAULT: "#FF7A59",
          dark: "#E85D3D",
          light: "#FFA98A",
        },
        peach: "#FFB37C",
        mint: "#A8E6CF",
        sky: "#AEE1F9",
        blush: "#FFD6E0",
        butter: "#FFE29A",
        plum: "#3D2C4E",
      },

      fontFamily: {
        display: ['"Baloo 2"', "cursive"],
        body: ['"Nunito Sans"', "sans-serif"],
      },

      boxShadow: {
        soft: "0 10px 30px -10px rgba(61, 44, 78, 0.15)",
        card: "0 6px 20px -6px rgba(61, 44, 78, 0.12)",
      },

      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-14px) rotate(3deg)",
          },
        },

        floatSlow: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "floatSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};