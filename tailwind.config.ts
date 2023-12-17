import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tran: "transparent",
        background: {
          light: "#fefefe",
          dark: "#232627",
        },
        surface: {
          light: "#f5f5f5",
          dark: "#141718",
        },
        primary: {
          light: "#6200ee",
          dark: "#bb86fc",
        },
        secondary: {
          light: "#03dac6",
          dark: "#03dac6",
        },
        onBG: {
          light: "#000000",
          dark: "#ffffff",
        },
        onSurface: {
          light: "#000000",
          dark: "#ffffff",
        },
        onPrimary: {
          light: "#ffffff",
          dark: "#000000",
        },
        onSecondary: {
          light: "#000000",
          dark: "#000000",
        },
        error: {
          light: "#B00020",
          dark: "#CF6679",
        },
        message: {
          in: {
            text: {
              light: "black",
              dark: "white",
            },
            bg: {
              light: "white",
              dark: "#1e1e26",
            },
          },
          out: {
            text: {
              light: "white",
              dark: "white",
            },
            bg: {
              light: "#51a2e5",
              dark: "#51a2e5",
            },
          },
        },
        active: "#0084ff",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      borderRadius: {
        circle: "50%",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: any) {
      addUtilities({
        ".drag-none": {
          "-webkit-user-drag": "none",
          "-khtml-user-drag": "none",
          "-moz-user-drag": "none",
          "-o-user-drag": "none",
          "user-drag": "none",
        },
      });
    }),
  ],
};

export default config;
