"use client";

import { useEffect, useState, useRef } from "react";
import { List } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from markdown
  useEffect(() => {
    const regex = /^(#{1,6})\s+(.*)/gm;
    const matches: Heading[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      matches.push({ id, text, level });
    }
    setHeadings(matches);
  }, [content]);

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break; // use the first visible one (top-most)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 mb-4">
        <List className="w-4 h-4 text-blue-500" />
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          On this page
        </h4>
      </div>

      {/* heading list */}
      <ul className="space-y-0.5 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.level - 1) * 0.6}rem` }}
              className="relative"
            >
              {/* active indicator dot */}
              {isActive && (
                <span className="absolute left-[-0.65rem] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={`
                  block py-1 text-[13px] leading-tight transition-colors duration-200
                  ${isActive
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }
                `}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}