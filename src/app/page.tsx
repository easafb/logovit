"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Package, MessageSquare, Mail, Phone } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  tag?: string;
  image?: string;
};

const BRAND = {
  phone: "+90XXXXXXXXXX",
  whatsapp: "90XXXXXXXXX",
  email: "info@logovit.com",
};

export default function Page() {
  // Tema
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("logovit_dark") === "1";
    // SSR güvenli: class toggle sadece client’ta
    if (saved) document.documentElement.classList.add("dark");
    return saved;
  });

  // Ürünler
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // İletişim linkleri
  const whatsappLink = useMemo(() => `https://wa.me/${BRAND.whatsapp}`, []);
  const telLink = useMemo(() => `tel:${BRAND.phone.replaceAll(" ", "")}`, []);
  const mailLink = useMemo(() => `mailto:${BRAND.email}`, []);

  // Ürünleri API'den çek
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const list = (await res.json()) as Product[];
        setProducts(list);
        if (typeof window !== "undefined") {
          localStorage.setItem("logovit_products_cache", JSON.stringify(list));
        }
      } catch {
        // Fallback: cache varsa kullan
        const cache = typeof window !== "undefined" ? localStorage.getItem("logovit_products_cache") : null;
        if (cache) setProducts(JSON.parse(cache));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen" style={{ color: "var(--text-primary)", background: "var(--page-bg)" }}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAuthed={true /* ister gizle, ister bırak */}
        onContactClick={() =>
          document.getElementById("iletisim")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              LOGOVIT <span style={{ color: "var(--orange-base)" }}>YAPI</span> MARKET
            </h1>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Nalbur & yapı market ihtiyaçlarınız için güvenilir adres. Ürünleri inceleyin,
              sipariş için WhatsApp, e-posta veya telefonla hızlıca ulaşın.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#urunler" onClick={(e) => { e.preventDefault(); document.getElementById("urunler")?.scrollIntoView({ behavior: "smooth" }); }}>
                <Button className="h-11 px-6 text-white" style={{ backgroundColor: "var(--orange-base)" }}>
                  <Package className="h-4 w-4 mr-2" />
                  Ürünleri Gör
                </Button>
              </a>
              <a href="#kurumsal" onClick={(e) => { e.preventDefault(); document.getElementById("kurumsal")?.scrollIntoView({ behavior: "smooth" }); }}>
                <Button variant="outline" className="h-11 px-6 btn-outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Kurumsal
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kurumsal */}
      <section id="kurumsal" className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Kurumsal</h2>
          <p className="mt-4 md:text-lg leading-7" style={{ color: "var(--text-muted)" }}>
            LOGOVIT YAPI MARKET; el aletleri, elektrik, boya, tesisat ve hırdavat kategorilerinde geniş ürün
            yelpazesi sunar. Hızlı tedarik, adil fiyat ve yerinde çözüm yaklaşımıyla hizmet veriyoruz.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Geniş Stok", desc: "Sık dönen temel ürünler sürekli stokta." },
              { title: "Usta Dostu", desc: "İhtiyaca uygun ürün önerisi ve teknik destek." },
              { title: "Hızlı Tedarik", desc: "Aynı gün içinde temin/teslim seçenekleri." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border p-6" style={{ background: "var(--card-bg)", borderColor: "var(--line-color)" }}>
                <h3 className="text-lg md:text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section id="urunler" className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ürünler</h2>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                Satın almak veya teklif almak için WhatsApp / e-posta / telefonla iletişime geçin.
              </p>
            </div>
            <Badge className="text-white" style={{ backgroundColor: "var(--orange-base)" }}>
              Sepet Yok • Teklif Üzerinden
            </Badge>
          </div>

          {loading ? (
            <div className="mt-10 text-sm" style={{ color: "var(--text-muted)" }}>Yükleniyor…</div>
          ) : (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  whatsappLink={`${whatsappLink}?text=${encodeURIComponent(`Merhaba, ${p.name} (SKU: ${p.sku}) için bilgi ve fiyat teklifi rica ederim.`)}`}
                  mailLink={`${mailLink}?subject=${encodeURIComponent(`${p.name} teklifi`)}&body=${encodeURIComponent(`Merhaba, ${p.name} (SKU: ${p.sku}) için bilgi ve fiyat teklifi rica ederim.`)}`}
                  telLink={telLink}
                />
              ))}
              {products.length === 0 && (
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Şu anda listelenecek ürün bulunamadı.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-16 md:py-24 border-t" style={{ borderColor: "var(--line-color)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">İletişim</h2>
          <p className="mt-2" style={{ color: "var(--text-muted)" }}>
            Butonlardan direkt iletişime geçebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <Button className="text-white" style={{ backgroundColor: "#16a34a" }}>
                <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
            </a>
            <a href={mailLink}>
              <Button variant="outline" className="btn-outline">
                <Mail className="h-4 w-4 mr-2" /> {BRAND.email}
              </Button>
            </a>
            <a href={telLink}>
              <Button variant="outline" className="btn-outline">
                <Phone className="h-4 w-4 mr-2" /> {BRAND.phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)" }}>
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-extrabold tracking-tight">LOGOVIT</span>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} LOGOVIT YAPI MARKET • Tüm hakları saklıdır.
          </span>
        </div>
      </footer>
    </div>
  );
}
