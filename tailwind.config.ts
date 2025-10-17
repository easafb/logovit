// tailwind.config.ts
import type { Config as TailwindConfig } from "tailwindcss/types/config";
import animate from "tailwindcss-animate";

/**
 * Tailwind v4 tiplerinde top-level `safelist` bazen tanımlı değil.
 * Burada kendi genişletilmiş tipimizi tanımlıyoruz, export'ta tekrar Tailwind tipine çeviriyoruz.
 */
type WithSafelist = TailwindConfig & {
  safelist?: Array<string | { pattern: RegExp; variants?: string[] }>;
};

const config: WithSafelist = {
  darkMode: "class", // veya ["class", ".dark"]
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
      // Renkleri globals.css’teki CSS değişkenlerinden okuyoruz
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

  plugins: [animate],

  /**
   * Safelist: production’da JIT tarafından üretilmeyen ama bizim global CSS’te
   * (veya runtime’ta) ihtiyaç duyabileceğimiz sınıfları korur.
   * Basit string listesi veya RegExp pattern’leri kullanabilirsiniz.
   */
  safelist: [
    "btn-outline",
    "btn-orange",
    "input-base",
    "badge-contrast",
    "ap-table",
    // Örnek desen: tüm text- ve bg-primary varyantlarını koru
    { pattern: /^text-(primary|foreground|muted)$/ },
    { pattern: /^bg-(card|soft|page)$/ },
    { pattern: /^border-(line)$/ },
  ],
};

// Export'u TailwindConfig tipine çeviriyoruz ki TS şikayet etmesin.
export default config as unknown as TailwindConfig;
