"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["👍", "🔥", "✨", "🚀", "💡"];

export function ReactionButtons({ projectId }: { projectId: number }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchCounts = async () => {
    const res = await fetch(`/api/projects/${projectId}/reactions`);
    const data = await res.json();
    setCounts(data.counts || {});
  };

  useEffect(() => {
    fetchCounts();
  }, [projectId]);

  const addReaction = async (emoji: string) => {
    await fetch(`/api/projects/${projectId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    fetchCounts();
  };

  return (
    <div className="flex flex-wrap gap-3">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => addReaction(emoji)}
          className="
            group flex items-center gap-2 px-4 py-2
            rounded-full
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-sm
            hover:shadow-md hover:scale-105 hover:-translate-y-1
            active:scale-95
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-300
          "
          title={`React with ${emoji}`}
        >
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">
            {counts[emoji] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
