import { NextResponse } from "next/server";
import { readProducts, writeProducts, type Product } from "@/lib/productsStore";

// GET /api/products  -> tüm liste
export async function GET() {
  const list = await readProducts();
  return NextResponse.json(list);
}

// POST /api/products  {action, payload}
// action: "create" | "update" | "delete"
export async function POST(req: Request) {
  const { action, payload } = await req.json();

  let list = await readProducts();

  if (action === "create") {
    const p: Omit<Product, "id"> = payload;
    const id = Math.max(0, ...list.map((x) => x.id)) + 1;
    const item: Product = { id, ...p, price: Number(p.price ?? 0) };
    list.push(item);
    await writeProducts(list);
    return NextResponse.json(item);
  }

  if (action === "update") {
    const p: Product = payload;
    list = list.map((x) => (x.id === p.id ? { ...x, ...p, price: Number(p.price ?? 0) } : x));
    await writeProducts(list);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    const id: number = payload?.id;
    list = list.filter((x) => x.id !== id);
    await writeProducts(list);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
