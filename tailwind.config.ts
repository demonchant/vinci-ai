import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "#09090B",
        surface: "#111113",
        border: "rgba(255,255,255,0.08)",
        primary: {
          DEFAULT: "#6D5DFB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#00D4FF",
          foreground: "#09090B",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#09090B",
        },
        muted: {
          DEFAULT: "#18181B",
          foreground: "#A1A1AA",
        },
        gray: {
          300: "#D4D4D8",
          500: "#71717A",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "vinci-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(109,93,251,0.25) 0%, rgba(9,9,11,0) 70%)",
        "vinci-aurora":
          "linear-gradient(120deg, #6D5DFB 0%, #7C3AED 45%, #00D4FF 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(109, 93, 251, 0.35)",
        "glow-accent": "0 0 40px rgba(0, 212, 255, 0.25)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
