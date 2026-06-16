import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#142033",
        muted: "#667085",
        surface: "#F6F8FB",
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        mint: {
          50: "#ECFDF8",
          500: "#20B8A5",
          600: "#119684",
        },
        amber: {
          50: "#FFFBEB",
          500: "#F59E0B",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 32, 51, 0.08)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
