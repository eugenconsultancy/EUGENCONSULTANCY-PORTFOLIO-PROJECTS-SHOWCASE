import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loading = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        px-6 py-3
        rounded-xl
        font-semibold
        text-white
        bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
        shadow-lg shadow-blue-500/20
        transition-all duration-300
        hover:scale-105
        hover:shadow-xl hover:shadow-blue-500/30
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-300/40
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
