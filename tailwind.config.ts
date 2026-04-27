import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0e1511",
          dim: "#09100c",
          low: "#161d19",
          container: "#1a211d",
          high: "#242c27",
          highest: "#2f3732",
          bright: "#333b36",
          card: "#1f1f1f"
        }
      },
      borderRadius: {
        card: "12px"
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.3)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.4)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      transitionDuration: {
        DEFAULT: "200ms"
      }
    }
  },
  plugins: []
};

export default config;
