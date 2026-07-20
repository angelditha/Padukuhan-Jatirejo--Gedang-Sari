"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Lock } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAdmin } from "./AdminContext";
import { useScrollActive } from "@/hooks/useScrollActive";

const navItems = [
  { id: "home", label: "Beranda" },
  { id: "profil", label: "Profil" },
  { id: "potensi", label: "Potensi" },
  { id: "budaya", label: "Budaya" },
  { id: "berita", label: "Berita & Kegiatan" },
  { id: "galeri", label: "Galeri" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { isAdmin, openLoginModal } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const sectionIds = navItems.map((item) => item.id);
  const activeSection = useScrollActive(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === "/") {
      const element = document.getElementById(id);

      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-md py-3 border-b border-emerald-100/10 dark:border-emerald-900/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center p-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <Image
                src="/Jatirejo Logo.png"
                alt="Logo Padukuhan Jatirejo"
                width={52}
                height={52}
                className="rounded-full object-contain"
                priority
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-tight font-sans tracking-tight">
                Padukuhan Jatirejo
              </span>

              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
                Hargomulyo • DIY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = isHome && activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </a>
              );
            })}

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors duration-200 ml-2 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-5 h-5 text-emerald-700" />
              )}
            </button>

            {/* Admin Login Button */}
            <button
              onClick={openLoginModal}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer border ${
                isAdmin
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent"
              }`}
              title={isAdmin ? "Admin Active (Klik untuk kelola/logout)" : "Login Admin"}
            >
              <Lock className={`w-5 h-5 ${isAdmin ? "text-amber-500" : ""}`} />
            </button>
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-emerald-700" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-emerald-100/5 dark:border-emerald-950/10 ${
          isOpen
            ? "max-h-96 opacity-100 bg-white dark:bg-zinc-950"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-inner">
          {navItems.map((item) => {
            const isActive = isHome && activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}