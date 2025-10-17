// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "LOGOVIT YAPI MARKET",
  description: "Nalbur & yapı market – LOGOVIT",
};

export const viewport: Viewport = {
  colorScheme: "light dark", // Tarayıcı çubuk rengi vb. için
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Hydration sırasında class farklarından uyarı çıkmasın
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* 
          Dark mode’u HYDRATION’DAN ÖNCE uygular.
          - localStorage('logovit_dark') === "1" -> dark
          - Ayar yoksa OS tercihini izler (prefers-color-scheme)
        */}
        <script
          id="logovit-theme-init"
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var r = document.documentElement;
    var ls = null;
    try { ls = localStorage.getItem('logovit_dark'); } catch(e) {}
    var isDark = ls === '1';
    if (ls === null && window.matchMedia) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) r.classList.add('dark'); else r.classList.remove('dark');
  } catch (e) {}
})();
          `.trim(),
          }}
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
