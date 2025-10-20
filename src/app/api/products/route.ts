import { NextResponse } from "next/server";
import { readProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productsStore";
import type { Product } from "@/lib/productsStore";

export async function GET() {
  const rows = await readProducts();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { action, payload } = await req.json();

  if (action === "create") {
    const created = await createProduct(payload);
    return NextResponse.json({ ok: true, data: created });
  }
  if (action === "update") {
    await updateProduct(payload as Product);
    return NextResponse.json({ ok: true });
  }
  if (action === "delete") {
    await deleteProduct(Number(payload?.id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "INVALID_ACTION" }, { status: 400 });
}
