"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, Mail, Shield } from "lucide-react";
import { useSession } from "next-auth/react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/projects", icon: FolderKanban, label: "Projects" },
    { href: "/contact", icon: Mail, label: "Contact" },
  ];
  if (session) {
    links.push({ href: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
