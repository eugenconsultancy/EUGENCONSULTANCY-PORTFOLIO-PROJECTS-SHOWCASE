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
  },
  purple: {
    ring: "from-violet-500 to-fuchsia-500",
    icon: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  },
  green: {
    ring: "from-emerald-500 to-green-500",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  orange: {
    ring: "from-orange-500 to-amber-500",
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  cyan: {
    ring: "from-cyan-500 to-sky-500",
    icon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
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

      <div className="relative p-7">

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
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              {badge}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="mt-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {value}
          </h2>

          <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>

          {description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
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