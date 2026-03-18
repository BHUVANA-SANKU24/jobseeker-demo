import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gov-bg": "#071328",
        "gov-accent": "#FDBA12",
        "gov-accent-hover": "#D99D0F",
        "gov-panel": "#101D35",
        "gov-border": "#1E2B45",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "float-twinkle": {
          "0%": { opacity: "0", transform: "translateY(0) scale(0.5)" },
          "50%": { opacity: "1", transform: "translateY(-50px) scale(1.2)" },
          "100%": { opacity: "0", transform: "translateY(-100px) scale(0.5)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "slide-down": "slide-down 2s linear infinite",
        "float-twinkle": "float-twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
