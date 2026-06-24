"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

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

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto text-sm">
      <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">On this page</h4>
      <ul className="space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 0.75}rem` }}>
            <a
              href={`#${h.id}`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
