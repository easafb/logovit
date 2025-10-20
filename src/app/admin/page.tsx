"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Plus, Pencil, Trash2, Download, Upload, Search } from "lucide-react";

/* ---------- Tipler ---------- */
export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  tag?: string;
  image?: string; // URL veya base64
};

export default function AdminPage() {
  /* ---------- UI State ---------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: undefined,
    tag: "",
    image: "",
  });

  /* ---------- Data load ---------- */
  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const list = (await res.json()) as Product[];
      setProducts(list);
    } catch {
      // sessiz düş
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  /* ---------- Filtre ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tag ?? "").toLowerCase().includes(q)
    );
  }, [query, products]);

  /* ---------- Yardımcılar ---------- */
  const reset = () => {
    setEditingId(null);
    setForm({ name: "", sku: "", price: undefined, tag: "", image: "" });
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  /* ---------- CRUD (API) ---------- */
  const onCreate = async (payload: Omit<Product, "id">) => {
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", payload }),
    });
    if (r.ok) {
      const { data } = await r.json();
      setProducts((prev) => prev.concat(data));
    }
  };

  const onUpdate = async (payload: Product) => {
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", payload }),
    });
    if (r.ok) {
      setProducts((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
    }
  };

  const onDelete = async (id: number) => {
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", payload: { id } }),
    });
    if (r.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const submit = async () => {
    if (!form.name || !form.sku || form.price === undefined || form.price === null) {
      alert("Lütfen Ad, SKU ve Fiyat alanlarını doldurun.");
      return;
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum)) {
      alert("Fiyat sayı olmalıdır.");
      return;
    }

    if (editingId != null) {
      const payload: Product = {
        id: editingId,
        name: String(form.name),
        sku: String(form.sku),
        price: priceNum,
        tag: String(form.tag ?? ""),
        image: String(form.image ?? ""),
      };
      await onUpdate(payload);
    } else {
      const payload: Omit<Product, "id"> = {
        name: String(form.name),
        sku: String(form.sku),
        price: priceNum,
        tag: String(form.tag ?? ""),
        image: String(form.image ?? ""),
      };
      await onCreate(payload);
    }
    reset();
  };

  const edit = (p: Product) => {
    setEditingId(p.id);
    setForm({ ...p });
    document.getElementById("admin-form-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const del = async (id: number) => {
    if (!confirm("Bu ürünü silmek istiyor musunuz?")) return;
    await onDelete(id);
  };

  /* ---------- CSV Dışa/İçe Aktarım ---------- */
  const exportCsv = () => {
    const header = ["name", "sku", "price", "tag", "image"];
    const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const lines = [header.join(",")].concat(
      products.map((r) => [r.name, r.sku, r.price, r.tag ?? "", r.image ?? ""].map(esc).join(","))
    );
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logovit-urunler.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const txt = String(reader.result);
      const rows = txt.split(/\r?\n/).filter(Boolean);
      if (!rows.length) return;
      const body = rows.slice(1); // başlık satırını atla
      for (const line of body) {
        const cols = parseCsvLine(line);
        const [name, sku, price, tag, image] = cols;
        if (!name || !sku) continue;
        await onCreate({
          name,
          sku,
          price: Number(price || 0),
          tag,
          image,
        });
      }
    };
    reader.readAsText(file, "utf-8");
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--page-bg)", color: "var(--text-primary)" }}>
      {/* Üst Bar */}
      <div className="sticky top-0 z-10 border-b" style={{ borderColor: "var(--line-color)", background: "var(--card-bg)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Admin Panel</h1>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="input-base pl-9 w-72"
                placeholder="Ürünlerde ara…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" className="btn-outline h-9" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> Dışa Aktar
            </Button>

            <label className="inline-flex">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importCsv(f);
                }}
              />
              <Button variant="outline" className="btn-outline h-9">
                <Upload className="h-4 w-4 mr-1" /> İçe Aktar
              </Button>
            </label>
          </div>
        </div>

        {/* Mobil arama */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              className="input-base pl-9"
              placeholder="Ürünlerde ara…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Form Kartı */}
        <div id="admin-form-top" className="rounded-2xl border" style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)" }}>
          <div className="p-4 border-b" style={{ borderColor: "var(--line-color)" }}>
            <div className="font-semibold">Ürün Bilgisi</div>
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              {editingId != null ? "Ürünü güncelliyorsunuz" : "Yeni ürün ekleyin"}
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Ürün Adı</Label>
              <Input
                className="input-base"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>SKU</Label>
              <Input
                className="input-base"
                value={form.sku ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Fiyat (₺)</Label>
              <Input
                className="input-base"
                type="number"
                step="0.01"
                value={form.price ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: e.target.value === "" ? undefined : e.target.valueAsNumber,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Etiket</Label>
              <Input
                className="input-base"
                placeholder="El Aleti, Boya…"
                value={form.tag ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2 grid gap-2">
              <Label>Görsel (URL)</Label>
              <Input
                className="input-base"
                placeholder="https://…/urun.jpg"
                value={form.image ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />

              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <Button variant="outline" className="btn-outline h-8">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Dosyadan Yükle
                  </Button>
                </label>
                {form.image ? <span>Önizleme hazır</span> : null}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <Button onClick={submit} className="text-white" style={{ backgroundColor: "var(--orange-base)" }}>
                <Plus className="h-4 w-4 mr-2" />
                {editingId != null ? "Güncelle" : "Ekle"}
              </Button>
              {editingId != null && (
                <Button variant="outline" className="btn-outline" onClick={reset}>
                  İptal
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-3">
          <div className="text-sm font-semibold">
            {loading ? "Yükleniyor…" : <>Toplam {filtered.length} ürün</>}
          </div>

          <div className="ap-table border rounded-2xl overflow-hidden" style={{ borderColor: "var(--line-color)" }}>
            <Table>
              <TableHeader className="bg-[var(--soft-bg)]">
                <TableRow>
                  <TableHead style={{ color: "var(--text-primary)" }}>Görsel</TableHead>
                  <TableHead style={{ color: "var(--text-primary)" }}>Ad</TableHead>
                  <TableHead style={{ color: "var(--text-primary)" }}>SKU</TableHead>
                  <TableHead style={{ color: "var(--text-primary)" }}>Etiket</TableHead>
                  <TableHead style={{ color: "var(--text-primary)" }}>Fiyat</TableHead>
                  <TableHead className="text-right" style={{ color: "var(--text-primary)", width: 120 }}>
                    İşlem
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell style={{ color: "var(--text-primary)" }}>
                      <div
                        className="h-12 w-16 flex items-center justify-center overflow-hidden rounded"
                        style={{ background: "var(--soft-bg)", border: "1px solid var(--line-color)" }}
                      >
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                    </TableCell>

                    <TableCell style={{ color: "var(--text-primary)" }} className="font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell style={{ color: "var(--text-primary)" }}>{p.sku}</TableCell>
                    <TableCell style={{ color: "var(--text-primary)" }}>{p.tag || "—"}</TableCell>
                    <TableCell style={{ color: "var(--text-primary)" }}>
                      ₺{(p.price ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                    </TableCell>

                    <TableCell className="text-right space-x-2" style={{ color: "var(--text-primary)" }}>
                      <Button size="sm" variant="outline" className="btn-outline" onClick={() => edit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => del(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {(!loading && filtered.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                      Sonuç yok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Tabloda tema renkleri için kesin override */}
            <style jsx>{`
              .ap-table :global(thead th) {
                background: var(--soft-bg);
                color: var(--text-primary) !important;
              }
              .ap-table :global(tbody td),
              .ap-table :global(tbody th),
              .ap-table :global(tbody tr) {
                color: var(--text-primary) !important;
              }
            `}</style>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Basit CSV satır ayrıştırıcı (tırnak/virgül destekli) */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
