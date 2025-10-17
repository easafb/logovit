import { NextResponse } from "next/server";
import { readProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productsStore";
import type { Product } from "@/lib/productsStore";

// GET: liste
export async function GET() {
  try {
    const rows = await readProducts();
    return NextResponse.json(rows, { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST: { action, payload }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action as "create" | "update" | "delete";
    const payload = body?.payload;

    if (action === "create") {
      const p = payload as Omit<Product, "id">;
      const created = await createProduct(p);
      return NextResponse.json({ ok: true, data: created });
    }
    if (action === "update") {
      const p = payload as Product;
      await updateProduct(p);
      return NextResponse.json({ ok: true });
    }
    if (action === "delete") {
      await deleteProduct(Number(payload?.id));
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "INVALID_ACTION" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
