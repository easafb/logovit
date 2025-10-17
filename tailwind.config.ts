// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";   // <-- EKLENDİ

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        primary: "var(--orange-base)",
        "primary-hover": "var(--orange-hover)",
        "primary-ring": "var(--orange-ring)",
        foreground: "var(--text-primary)",
        muted: "var(--text-muted)",
        line: "var(--line-color)",
        card: "var(--card-bg)",
        soft: "var(--soft-bg)",
        page: "var(--page-bg)",
      },
      borderRadius: { lg: "0.75rem", xl: "1rem", "2xl": "1.5rem" },
      boxShadow: { soft: "0 6px 24px -8px rgba(0,0,0,.15)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],    // <-- BURADA
  safelist: ["btn-outline", "btn-orange", "input-base", "badge-contrast", "ap-table"],
};

export default config;
