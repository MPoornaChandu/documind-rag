import type { Config } from "tailwindcss"

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.28)",
        "violet-glow": "0 0 50px rgba(139, 92, 246, 0.26)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at center, rgba(34, 211, 238, 0.12), transparent 28rem)",
      },
      animation: {
        "slow-float": "slow-float 8s ease-in-out infinite",
        "soft-pulse": "soft-pulse 4s ease-in-out infinite",
        "particle-rise": "particle-rise 12s linear infinite",
      },
      keyframes: {
        "slow-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.62", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "particle-rise": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "15%": { opacity: "0.75" },
          "100%": { opacity: "0", transform: "translateY(-110px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
