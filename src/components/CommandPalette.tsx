"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type CommandItem = {
  label: string;
  href: string;
  category?: string;
};

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredItems = query
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      )
    : items.slice(0, 8);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] max-w-lg mx-auto mt-[15vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border rounded-lg p-3 pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
              <kbd className="absolute right-3 top-3 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                ESC
              </kbd>
            </div>
            <ul className="mt-4 space-y-1 max-h-64 overflow-y-auto">
              {filteredItems.length === 0 && (
                <li className="text-gray-500 text-center py-4">No results</li>
              )}
              {filteredItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => navigate(item.href)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
                  >
                    <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
                    {item.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.category}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
