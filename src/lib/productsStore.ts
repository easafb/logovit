import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "products.json");

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  tag?: string;
  image?: string;
};

async function ensureFile() {
  try { await fs.access(FILE); }
  catch {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function readProducts(): Promise<Product[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try { return JSON.parse(raw) as Product[]; } catch { return []; }
}

export async function writeProducts(list: Product[]) {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}
