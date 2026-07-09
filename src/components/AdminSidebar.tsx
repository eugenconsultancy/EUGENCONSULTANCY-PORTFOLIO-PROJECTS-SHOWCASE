"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Command,
  Shield,
  Zap,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
    description: "Overview & analytics"
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
    badge: null,
    description: "Manage portfolio work"
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: Briefcase,
    badge: "New",
    description: "SPSS, SEO & more"
  },
  {
    href: "/admin/comments",
    label: "Comments",
    icon: MessageSquare,
    badge: null,
    description: "Moderate discussions"
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: Mail,
    badge: null,
    description: "Client messages"
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    badge: null,
    description: "Traffic & insights"
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    badge: null,
    description: "Profile & preferences"
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl md:hidden hover:shadow-2xl hover:scale-105 transition-all duration-200 group"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-80 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Branding Section */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-1">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-500/25">
                <Command className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <Link
                href="/admin"
                className="text-xl font-black text-gray-900 dark:text-white tracking-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 transition-all duration-200"
              >
                Admin Panel
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Portfolio Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 px-3">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
              Main Menu
            </p>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/5"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-violet-600 rounded-r-full" />
                  )}

                  {/* Icon container */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}>
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </div>

                  {/* Label and description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold truncate ${isActive ? "font-bold" : ""}`}>
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold shadow-lg shadow-amber-500/25 animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-blue-500/70 dark:text-blue-400/70" : "text-gray-400 dark:text-gray-500"
                      }`}>
                      {link.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${isActive || isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    } ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Separator */}
        <div className="px-4">
          <div className="border-t border-gray-100 dark:border-gray-800" />
        </div>

        {/* User Profile & Sign Out */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 p-4 mb-3">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 20px)"
              }}
            />

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
                  <span className="text-lg">A</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Administrator</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Super Admin
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors duration-200">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <span className="block">Sign Out</span>
              <span className="block text-[11px] text-gray-400 dark:text-gray-500 font-normal">Return to portfolio</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={closeMobile}
        />
      )}
    </>
  );
}