import type { Config } from "tailwindcss";

// The Creative Strategist palette. Exact hex values only.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1C192A",
        orange: "#F28D3D",
        yellow: "#FCDF09",
        blue: "#2B69D8",
        ink: "#4A4658",
        muted: "#8B8797",
        mist: "#EDECF1",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
};
export default config;
