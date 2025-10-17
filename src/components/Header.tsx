"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, MessageSquare } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  isAuthed?: boolean;
  onContactClick?: () => void;
  onAdminClick?: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  isAuthed,
  onContactClick,
  onAdminClick,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("logovit_dark", newTheme ? "1" : "0");
      document.documentElement.classList.toggle("dark", newTheme);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

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
        <Link href="#home" onClick={() => scrollTo("home")} className="font-extrabold text-2xl tracking-tight">
          LOGOVIT<span style={{ color: "var(--orange-base)" }}>.</span>
        </Link>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="btn-outline h-9 px-3" onClick={() => scrollTo("kurumsal")}>
            Kurumsal
          </Button>
          <Button variant="outline" className="btn-outline h-9 px-3" onClick={() => scrollTo("urunler")}>
            Ürünler
          </Button>
          <Button variant="outline" className="btn-outline h-9 px-3" onClick={() => scrollTo("iletisim")}>
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

          {isAuthed && (
            <Button
              variant="outline"
              className="btn-outline h-9 px-3"
              onClick={onAdminClick}
            >
              Admin Panel
            </Button>
          )}
        </nav>

        {/* Mobil Menü Butonu */}
        <Button
          variant="outline"
          className="btn-outline md:hidden h-9 w-9"
          onClick={() => setMenuOpen((p) => !p)}
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
            <Button
              variant="outline"
              className="btn-outline w-full justify-start"
              onClick={() => scrollTo("kurumsal")}
            >
              Kurumsal
            </Button>
            <Button
              variant="outline"
              className="btn-outline w-full justify-start"
              onClick={() => scrollTo("urunler")}
            >
              Ürünler
            </Button>
            <Button
              variant="outline"
              className="btn-outline w-full justify-start"
              onClick={() => scrollTo("iletisim")}
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
            {isAuthed && (
              <Button
                variant="outline"
                className="btn-outline w-full justify-start"
                onClick={onAdminClick}
              >
                Admin Panel
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
