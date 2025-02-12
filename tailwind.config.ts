import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#d4e09b",   
        secondary: "#f6f4d2",
        accent: "#095038",
        highlight: "#f19c79",
        dark: "#a44a3f",
      },
    },
  },
  plugins: [],
} satisfies Config;
