import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  icon?: ReactNode;
  value: string | number;
  title: string;
  description?: string;
  badge?: string;
  featured?: boolean;
  accent?: "blue" | "purple" | "green" | "orange" | "cyan";
}

const accentStyles = {
  blue: {
    ring: "from-blue-500 to-cyan-500",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
  purple: {
    ring: "from-violet-500 to-fuchsia-500",
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300",
  },
  green: {
    ring: "from-emerald-500 to-green-500",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
  orange: {
    ring: "from-orange-500 to-amber-500",
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
  },
  cyan: {
    ring: "from-cyan-500 to-sky-500",
    icon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    badge:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300",
  },
};

export default function Card({
  icon,
  value,
  title,
  description,
  badge,
  featured = false,
  accent = "blue",
}: CardProps) {
  const colors = accentStyles[accent];

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl border bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800",
        "transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-2xl",
        "flex flex-col",
        featured && "scale-[1.02]"
      )}
    >
      {/* Gradient Border */}
      <div
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          colors.ring
        )}
      />

      {/* Background Glow */}
      <div
        className={clsx(
          "absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br",
          colors.ring
        )}
      />

      <div className="relative p-7 flex flex-col flex-1">
        {/* Top */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          {icon && (
            <div
              className={clsx(
                "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                colors.icon
              )}
            >
              {icon}
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0",
                colors.badge
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="mt-6 flex-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white break-words">
            {value}
          </h2>

          <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100 break-words">
            {title}
          </h3>

          {description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 break-words hyphens-auto overflow-hidden line-clamp-6">
              {description}
            </p>
          )}
        </div>

        {/* Bottom Accent */}
        <div
          className={clsx(
            "mt-6 h-1 w-14 rounded-full transition-all duration-500 group-hover:w-24 bg-gradient-to-r",
            colors.ring
          )}
        />
      </div>
    </div>
  );
}