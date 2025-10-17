"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(251,146,60,.18), transparent 60%), radial-gradient(1000px 500px at 100% 10%, rgba(249,115,22,.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-40"
        style={{ backgroundImage: "linear-gradient(0deg, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <p className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1"
             style={{ background: "var(--soft-bg)", color: "var(--text-primary)", border: "1px solid var(--line-color)" }}>
            LOGOVIT YAPI MARKET • Usta Dostu Çözümler
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Güvenilir <span style={{ color: "var(--orange-base)" }}>nalbur</span> & yapı market
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Ürünleri inceleyin, satın alma için <strong>WhatsApp</strong>, <strong>e-posta</strong> veya <strong>telefon</strong> üzerinden bize ulaşın.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="#urunler" aria-label="Ürünleri Gör">
              <Button className="h-11 px-6 text-white btn-orange">Ürünleri Gör</Button>
            </a>
            <a href="#kurumsal" aria-label="Kurumsal Bilgiler">
              <Button variant="outline" className="h-11 px-6 btn-outline">Kurumsal</Button>
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            {[
              { t: "Geniş Stok", d: "Temel ürünler sürekli stokta" },
              { t: "Usta Dostu", d: "Doğru ürün önerisi" },
              { t: "Hızlı Tedarik", d: "Aynı gün temin opsiyonu" },
            ].map((i) => (
              <li key={i.t} className="rounded-xl px-3 py-2"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--line-color)", color: "var(--text-primary)" }}>
                <span className="font-semibold">{i.t}</span>
                <span className="block text-xs" style={{ color: "var(--text-muted)" }}>{i.d}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.05 }} className="hidden md:block">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden"
               style={{ background: "linear-gradient(135deg, rgba(249,115,22,.25), rgba(251,146,60,.15))", border: "1px solid var(--line-color)" }}
               aria-hidden />
          <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
            Satın alma siteden yapılmaz; teklif/iletişim üzerinden ilerlenir.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
