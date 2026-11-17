import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-950": "var(--green-950)",
        "green-900": "var(--green-900)",
        "green-800": "var(--green-800)",
        "green-700": "var(--green-700)",
        "green-600": "var(--green-600)",
        "green-500": "var(--green-500)",
        "green-400": "var(--green-400)",
        "green-200": "var(--green-200)",
        "green-100": "var(--green-100)",
        "cream-50": "var(--cream-50)",
        "cream-100": "var(--cream-100)",
        "cream-200": "var(--cream-200)",
        "gold-600": "var(--orange-woody)",
        "orange-woody": "var(--orange-woody)",
        "orange-cedar": "var(--orange-cedar)",
        "orange-amber": "var(--orange-amber)",
        "orange-rust": "var(--orange-cedar)",
        "ink-900": "var(--ink-900)",
        "ink-700": "var(--ink-700)",
        "ink-500": "var(--ink-500)",
      },
      fontFamily: {
        display: ["var(--font-source-sans)", "system-ui", "-apple-system", "sans-serif"],
        sans: ["var(--font-source-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "1240px",
      },
      spacing: {
        section: "96px",
        "section-mobile": "56px",
      },
      borderRadius: {
        brand: "18px",
        card: "24px",
        island: "32px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(11, 43, 30, 0.08)",
        glow: "0 0 40px -10px rgba(31, 163, 114, 0.35)",
        island: "0 20px 40px -15px rgba(6, 26, 18, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
