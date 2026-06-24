"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Menu, X, Moon, Sun } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      pathname === href
        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            P
          </div>
          <span className="text-gray-900 dark:text-white">Portfolio</span>
        </Link>

        {/* Desktop Navigation Pill */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800">
          <Link href="/" className={linkClass("/")}>
            Home
            {pathname === "/" && (
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 transition-all duration-300 rounded-full" />
            )}
          </Link>
          <Link href="/projects" className={linkClass("/projects")}>
            Projects
            {pathname === "/projects" && (
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 transition-all duration-300 rounded-full" />
            )}
          </Link>
          <Link href="/contact" className={linkClass("/contact")}>
            Contact
            {pathname === "/contact" && (
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-blue-600 transition-all duration-300 rounded-full" />
            )}
          </Link>
        </div>

        {/* Admin + Theme toggle (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          >
            Admin
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

        {/* Mobile menu button + theme toggle */}
        <div className="md:hidden flex items-center gap-3">
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === "/projects"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === "/contact"
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
