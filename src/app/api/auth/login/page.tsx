// src/app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.message || "Giriş başarısız");
      }
      // cookie set edildi, admin'e git
      window.location.href = "/admin";
    } catch (e: any) {
      setErr(e.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Yönetici Girişi</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="input-base w-full"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          className="input-base w-full"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
        <button
          className="btn-orange px-4 py-2 rounded text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Giriş Yap"}
        </button>
        {err && <p className="text-red-500 text-sm">{err}</p>}
      </form>
    </main>
  );
}
