import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        tran: "transparent",
        background: {
          light: "#ffffff",
          dark: "#121212"
        },
        surface: {
          light: "#ffffff",
          dark: "#1e1e1e"
        },
        primary: {
          light: "#6200ee",
          dark: "#bb86fc"
        },
        secondary: {
          light: "#03dac6",
          dark: "#03dac6" 
        },
        onBG: {
          light: "#000000",
          dark: "#ffffff"
        },
        onSurface: {
          light: "#000000",
          dark: "#ffffff" 
        },
        onPrimary: {
          light: "#ffffff",
          dark: "#000000" 
        },
        onSecondary: {
          light: "#000000",
          dark: "#000000"
        },
        error:{
          light: "#B00020",
          dark: "#CF6679"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      borderRadius:{
        circle: "50%"
      },
    },
  },
  plugins: [],
}
export default config
