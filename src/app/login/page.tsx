"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.message || "Giriş başarısız");
      } else {
        // cookie set edilecek; admin'e gönder
        router.push("/admin");
      }
    } catch {
      setErr("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--page-bg)", color: "var(--text-primary)" }}>
      <form onSubmit={submit}
        className="w-full max-w-sm space-y-3 border rounded-2xl p-6"
        style={{ borderColor: "var(--line-color)", background: "var(--card-bg)" }}>
        <h1 className="text-xl font-bold">Yönetici Girişi</h1>

        <div className="space-y-1">
          <label className="text-sm">Kullanıcı adı</label>
          <input className="w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)", color: "var(--text-primary)" }}
            value={username} onChange={(e) => setU(e.target.value)} required />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Şifre</label>
          <input type="password" className="w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--line-color)", background: "var(--soft-bg)", color: "var(--text-primary)" }}
            value={password} onChange={(e) => setP(e.target.value)} required />
        </div>

        {err && <p className="text-sm" style={{ color: "var(--danger, #ef4444)" }}>{err}</p>}

        <button disabled={loading}
          className="w-full rounded-md px-4 py-2 text-white"
          style={{ background: "var(--orange-base)" }}>
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
    </main>
  );
}
