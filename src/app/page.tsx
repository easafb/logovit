"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mail, Phone } from "lucide-react";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AdminPanel from "@/components/AdminPanel";
import ProductCard, { type Product as ProductType } from "@/components/ProductCard";
import { useThemeVars } from "@/hooks/useThemeVars";

/* ---------- Marka bilgisi ---------- */
const BRAND = {
  phone: "+90XXXXXXXXXX",
  whatsapp: "90XXXXXXXXX",
  email: "info@logovit.com",
};

export default function Page() {
  /* ---------- Tema ---------- */
  const [darkMode, setDarkMode] = useState(false);
  useThemeVars(darkMode);

  /* ---------- Ürünler (DB üzerinden kalıcı) ---------- */
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadProducts = async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const list = (await res.json()) as ProductType[];
    setProducts(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("logovit_products_cache", JSON.stringify(list));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await reloadProducts();
      } catch {
        const cache = typeof window !== "undefined" ? localStorage.getItem("logovit_products_cache") : null;
        if (cache) setProducts(JSON.parse(cache));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createProduct = async (p: Omit<ProductType, "id">) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", payload: p }),
    });
    await reloadProducts();
  };

  const updateProduct = async (p: ProductType) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", payload: p }),
    });
    await reloadProducts();
  };

  const deleteProduct = async (id: number) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", payload: { id } }),
    });
    await reloadProducts();
  };

  /* ---------- Linkler ---------- */
  const whatsappLink = useMemo(() => `https://wa.me/${BRAND.whatsapp}`, []);
  const telLink = useMemo(() => `tel:${BRAND.phone.replaceAll(" ", "")}`, []);
  const mailLink = useMemo(() => `mailto:${BRAND.email}`, []);

  /* ---------- Admin Panel ---------- */
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ color: "var(--text-primary)", backgroundColor: "var(--page-bg)" }}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAuthed={true}
        onContactClick={() => document.getElementById("iletisim")?.scrollIntoView({ behavior: "smooth" })}
        onAdminClick={() => setAdminOpen(true)}
      />

      {/* Hero (ayrı bileşen) */}
      <Hero />

      {/* Kurumsal */}
      <section
        id="kurumsal"
        className="py-12 md:py-20 border-t"
        style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Kurumsal</h2>
          <p className="mt-3 md:text-lg" style={{ color: "var(--text-muted)" }}>
            LOGOVIT YAPI MARKET; el aletleri, elektrik, boya, tesisat ve hırdavat kategorilerinde geniş ürün yelpazesi sunar.
            Hızlı tedarik, adil fiyat ve yerinde çözüm yaklaşımıyla hizmet veriyoruz.
          </p>
        </div>
      </section>

      {/* Ürünler */}
      <section
        id="urunler"
        className="py-16 md:py-24 border-t"
        style={{ borderColor: "var(--line-color)", backgroundColor: "var(--soft-bg)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ürünler</h2>
              <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                Satın almak veya teklif için bize ulaşın.
              </p>
            </div>
            <Badge className="text-white" style={{ backgroundColor: "var(--orange-base)" }}>
              Sepet Yok • Teklif
            </Badge>
          </div>

          {loading ? (
            <div className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
              Yükleniyor…
            </div>
          ) : (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} whatsappLink={whatsappLink} mailLink={mailLink} telLink={telLink} />
              ))}
              {products.length === 0 && (
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Şu an listelenecek ürün yok.
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

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <Button className="btn-orange">
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

          <form className="mt-8 grid md:grid-cols-2 gap-4">
            <Input className="input-base" placeholder="Ad Soyad" required />
            <Input className="input-base" type="email" placeholder="E-posta" required />
            <Input className="input-base md:col-span-2" placeholder="Konu" />
            <Textarea className="input-base md:col-span-2" placeholder="Mesajınız" rows={5} />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full md:w-auto text-white btn-orange">
                Gönder
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Mobil yüzen tema düğmesi */}
      <button
        onClick={() => {
          const next = !darkMode;
          setDarkMode(next);
          if (typeof window !== "undefined") {
            localStorage.setItem("logovit_dark", next ? "1" : "0");
            document.documentElement.classList.toggle("dark", next);
          }
        }}
        className="md:hidden fixed bottom-4 right-4 h-11 w-11 rounded-full border shadow-lg flex items-center justify-center"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--line-color)",
          color: "var(--text-primary)",
          zIndex: 60,
        }}
        aria-label={darkMode ? "Açık tema" : "Karanlık tema"}
        title={darkMode ? "Açık tema" : "Karanlık tema"}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Admin Panel (masaüstünde) */}
      <div className="hidden md:block">
        <AdminPanel
          open={adminOpen}
          setOpen={setAdminOpen}
          products={products}
          setProducts={setProducts}
          onCreate={createProduct}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      </div>
    </div>
  );
}
