// src/lib/productsStore.ts
import { kv } from "@vercel/kv";

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  tag?: string;
  image?: string;
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Çekiç 16oz", sku: "LOG-CHK-16", price: 249.9, tag: "El Aleti" },
  { id: 2, name: "Yalıtım Silikonu", sku: "LOG-SLK-01", price: 129.5, tag: "Kimyasal" },
  { id: 3, name: "Matkap Ucu Seti 6'lı", sku: "LOG-MDU-06", price: 349.0, tag: "Aksesuar" },
];

const KEY_ALL = "products:all";
const KEY_SEQ = "products:seq";

export async function readProducts(): Promise<Product[]> {
  let list = await kv.get<Product[]>(KEY_ALL);
  if (!list || list.length === 0) {
    // ilk seeding
    await kv.set(KEY_ALL, INITIAL_PRODUCTS);
    await kv.set(KEY_SEQ, INITIAL_PRODUCTS.length);
    list = INITIAL_PRODUCTS;
  }
  return list;
}

export async function createProduct(p: Omit<Product, "id">): Promise<Product> {
  const id = (await kv.incr(KEY_SEQ)) || 1;
  const created: Product = { id, ...p };
  const list = (await readProducts()).concat(created);
  await kv.set(KEY_ALL, list);
  return created;
}

export async function updateProduct(p: Product): Promise<Product> {
  const list = await readProducts();
  const next = list.map((x) => (x.id === p.id ? { ...x, ...p } : x));
  await kv.set(KEY_ALL, next);
  return p;
}

export async function deleteProduct(id: number): Promise<void> {
  const list = await readProducts();
  const next = list.filter((x) => x.id !== id);
  await kv.set(KEY_ALL, next);
}
