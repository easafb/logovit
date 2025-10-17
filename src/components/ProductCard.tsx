// src/components/ProductCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone, Image as ImageIcon } from "lucide-react";

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  tag?: string;
  image?: string;
};

type Props = {
  product: Product;
  whatsappLink: string;
  mailLink: string;
  telLink: string;
};

export default function ProductCard({ product, whatsappLink, mailLink, telLink }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border"
         style={{ background: "var(--card-bg)", borderColor: "var(--line-color)" }}>
      <div className="aspect-[4/3] flex items-center justify-center overflow-hidden"
           style={{ backgroundColor: "#141923", borderBottom: "1px solid var(--line-color)" }}>
        {product.image ? (
          // Next/Image'e geçirmek istersen dönüştürebiliriz; şu an <img> uyarı sadece "warning"
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            <ImageIcon className="h-5 w-5" /> Görsel yok
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>{product.tag || "Genel"}</div>
        <h3 className="mt-1 text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h3>
        <div className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          ₺{(product.price ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
        </div>
        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>SKU: {product.sku}</div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`${whatsappLink}?text=${encodeURIComponent(
              `Merhaba, ${product.name} için bilgi ve fiyat teklifi almak istiyorum. SKU: ${product.sku}`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm" style={{ backgroundColor: "#16a34a", color: "#fff" }}>
              <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
            </Button>
          </a>

          <a
            href={`${mailLink}?subject=${encodeURIComponent(`${product.name} teklifi`)}&body=${encodeURIComponent(
              `Merhaba, ${product.name} (SKU: ${product.sku}) için bilgi ve fiyat teklifi rica ederim.`
            )}`}
          >
            <Button variant="outline" size="sm" style={{ borderColor: "var(--line-color)", color: "var(--text-primary)" }}>
              <Mail className="h-4 w-4 mr-2" /> E-posta
            </Button>
          </a>

          <a href={telLink}>
            <Button variant="outline" size="sm" style={{ borderColor: "var(--line-color)", color: "var(--text-primary)" }}>
              <Phone className="h-4 w-4 mr-2" /> Ara
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
