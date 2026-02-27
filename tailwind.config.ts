import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "gov-bg": "#f5f5f0",
        "gov-accent": "#1b4b7a"
      }
    }
  },
  plugins: []
};

export default config;
