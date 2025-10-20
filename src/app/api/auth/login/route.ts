// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body ?? {};

  // Basit kontrol – istersen ENV'den oku:
  const U = process.env.ADMIN_USER || "admin";
  const P = process.env.ADMIN_PASS || "logovit";

  if (username !== U || password !== P) {
    return NextResponse.json({ ok: false, message: "Geçersiz bilgiler" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Cookie’yi 12 saat gibi makul bir sürede tut
  res.cookies.set("logovit_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
