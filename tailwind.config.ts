import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "@lg": "512px",
      "2xl": "1536px",
      "@4xl": "820px",
      "@5xl": "992px",
    },

    extend: {
      fontFamily: {
        lexend: ['"Lexend Deca"', "sans-serif"],
      },
      colors: {
        transparent: "transparent",
        main: "#232323",
        "blue-main": "#1fb0a8",
        white: "#FFFFFF",

        black: {
          default: "#000000",
          1: "#0a0a0a",
        },
        blue: {
          1: "#1fb0a8",
          2: "#e1f4fb",
          3: "#4a90e2",
        },
        green: {},
        gray: {},
        red: {
          1: "#f26659",
        },
      },

      translate: {},
    },
  },
  plugins: [],
} satisfies Config;

export default config;
