"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) =>
    `relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === href
      ? "text-blue-600 dark:text-blue-400"
      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/60 shadow-lg shadow-blue-500/5"
          : "bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* ── Logo + Branding ── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
            EG
          </div>
          <div className="hidden sm:block">
            <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight leading-tight">
              Eugen Gachie
            </span>
            <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
              Software Architect
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Pill ── */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <Link href="/" className={linkClass("/")}>
            Home
            {pathname === "/" && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(99,102,241,0.5)] transition-all duration-300" />
            )}
          </Link>
          <Link href="/projects" className={linkClass("/projects")}>
            Projects
            {pathname === "/projects" && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(99,102,241,0.5)] transition-all duration-300" />
            )}
          </Link>
          <Link href="/contact" className={linkClass("/contact")}>
            Contact
            {pathname === "/contact" && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(99,102,241,0.5)] transition-all duration-300" />
            )}
          </Link>
        </div>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Let&apos;s Build Together
            <ArrowRight size={14} />
          </Link>
          <button
            onClick={toggle}
            className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:rotate-180 transition-all duration-500"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* ── Mobile Right Actions ── */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/contact"
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md"
          >
            Hire Me
          </Link>
          <button
            onClick={toggle}
            className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl px-4 py-4 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${pathname === "/"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${pathname === "/projects"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            Projects
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${pathname === "/contact"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            Contact
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}