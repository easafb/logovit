"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, MessageSquare } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  isAuthed?: boolean;
  onContactClick?: () => void; // opsiyonel: dışarıdan custom davranış
}

export default function Header({
  darkMode,
  setDarkMode,
  isAuthed,
  onContactClick,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = useCallback(() => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("logovit_dark", next ? "1" : "0");
      document.documentElement.classList.toggle("dark", next);
    }
  }, [darkMode, setDarkMode]);

  const smoothScroll = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  }, []);

  const handleContact = useCallback(() => {
    if (onContactClick) onContactClick();
    else smoothScroll("iletisim");
  }, [onContactClick, smoothScroll]);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--line-color)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* LOGO */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            smoothScroll("home");
          }}
          className="font-extrabold text-2xl tracking-tight"
          aria-label="Anasayfa"
        >
          LOGOVIT<span style={{ color: "var(--orange-base)" }}>.</span>
        </a>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-3">
          <a
            href="#kurumsal"
            onClick={(e) => {
              e.preventDefault();
              smoothScroll("kurumsal");
            }}
          >
            <Button variant="outline" className="btn-outline h-9 px-3">
              Kurumsal
            </Button>
          </a>

          <a
            href="#urunler"
            onClick={(e) => {
              e.preventDefault();
              smoothScroll("urunler");
            }}
          >
            <Button variant="outline" className="btn-outline h-9 px-3">
              Ürünler
            </Button>
          </a>

          <Button
            variant="outline"
            className="btn-outline h-9 px-3"
            onClick={handleContact}
            title="Bize Ulaşın"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Bize Ulaşın
          </Button>

          <Button
            variant="outline"
            className="btn-outline h-9 px-3"
            onClick={toggleTheme}
            title="Tema değiştir"
          >
            {darkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" /> Açık Tema
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" /> Karanlık Tema
              </>
            )}
          </Button>

          {isAuthed ? (
            <Link href="/admin">
              <Button variant="outline" className="btn-outline h-9 px-3">
                Admin Panel
              </Button>
            </Link>
          ) : null}
        </nav>

        {/* Mobil Menü Butonu */}
        <Button
          variant="outline"
          className="btn-outline md:hidden h-9 w-9"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Menüyü aç/kapat"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobil Menü */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: "var(--line-color)", background: "var(--card-bg)" }}
        >
          <nav className="flex flex-col p-4 gap-3">
            <a
              href="#kurumsal"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("kurumsal");
              }}
            >
              <Button variant="outline" className="btn-outline w-full justify-start">
                Kurumsal
              </Button>
            </a>

            <a
              href="#urunler"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("urunler");
              }}
            >
              <Button variant="outline" className="btn-outline w-full justify-start">
                Ürünler
              </Button>
            </a>

            <Button
              variant="outline"
              className="btn-outline w-full justify-start"
              onClick={handleContact}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Bize Ulaşın
            </Button>

            <Button
              variant="outline"
              className="btn-outline w-full justify-start"
              onClick={toggleTheme}
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4 mr-2" /> Açık Tema
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" /> Karanlık Tema
                </>
              )}
            </Button>

            {isAuthed ? (
              <Link href="/admin" className="w-full">
                <Button variant="outline" className="btn-outline w-full justify-start">
                  Admin Panel
                </Button>
              </Link>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
