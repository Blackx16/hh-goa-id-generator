import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // HH Goa 5-color system
        "hhgoa-green":  "#0b6839",
        "hhgoa-yellow": "#fee101",
        "hhgoa-pink":   "#ff0080",
        "hhgoa-white":  "#ffffff",
        "hhgoa-cream":  "#fffbe8",
        "hhgoa-black":  "#000000",
        // legacy aliases so old refs don't hard-crash
        background: "var(--background)",
        foreground: "var(--foreground)",
        "hh-border": "rgba(254,225,1,0.25)",
      },
      fontFamily: {
        // HH Goa typography
        heading: ["Imbue", "Georgia", "serif"],
        body:    ["Victor Mono", "Courier New", "monospace"],
        mono:    ["Victor Mono", "Courier New", "monospace"],
        // old aliases removed but keep sans for safety
        sans:    ["Victor Mono", "Courier New", "monospace"],
        display: ["Imbue", "Georgia", "serif"],
      },
      animation: {
        "cta-glow":  "ctaGlow 2.5s ease-in-out infinite",
        "marquee":   "marquee 28s linear infinite",
        "live-dot":  "livePulse 1.4s ease-in-out infinite",
        "fade-in":   "fadeIn 0.3s ease forwards",
        // keep spin-slow for compatibility
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        ctaGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(254,225,1,0.6), 0 0 20px rgba(254,225,1,0.3)" },
          "50%":      { boxShadow: "0 0 18px rgba(254,225,1,0.9), 0 0 40px rgba(254,225,1,0.5)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        livePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(0.8)" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        // HH Goa card shadow — hard offset, no blur
        "card":       "6px 8px 0 rgba(0, 0, 0, 0.25)",
        "card-sm":    "3px 4px 0 rgba(0, 0, 0, 0.20)",
        "yellow-glow": "0 0 16px rgba(254,225,1,0.5)",
        "pink-glow":   "0 0 14px rgba(255,0,128,0.5)",
      },
      borderRadius: {
        "none": "0px",
      },
    },
  },
  plugins: [],
};
export default config;
