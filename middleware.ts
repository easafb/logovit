// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isAdminPage = url.pathname.startsWith("/admin");

  // Tarayıcıda set edilmiş bir cookie varsa kontrol et
  const authed = request.cookies.get("logovit_admin")?.value === "1";

  if (isAdminPage && !authed) {
    url.pathname = "/"; // giriş yoksa anasayfaya at
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Sadece /admin path’inde çalışsın:
export const config = {
  matcher: ["/admin/:path*"],
};
