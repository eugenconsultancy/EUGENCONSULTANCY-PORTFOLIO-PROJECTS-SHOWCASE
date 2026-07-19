"use client";

import { useEffect, useState, useCallback } from "react";
import { ThumbsUp, Flame, Sparkles, Rocket, Brain } from "lucide-react";

// Map emoji strings (used by your API) to Lucide icons
const REACTIONS = [
  { emoji: "👍", icon: ThumbsUp, label: "Like" },
  { emoji: "🔥", icon: Flame, label: "Hot" },
  { emoji: "✨", icon: Sparkles, label: "Amazing" },
  { emoji: "🚀", icon: Rocket, label: "Launch" },
  { emoji: "💡", icon: Brain, label: "Insightful" },
] as const;

export function ReactionButtons({ projectId }: { projectId: number }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchCounts = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/reactions`);
    const data = await res.json();
    setCounts(data.counts || {});
  }, [projectId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const addReaction = async (emoji: string) => {
    // Optimistic update
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    await fetch(`/api/projects/${projectId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });

    // Re-sync with server
    fetchCounts();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(({ emoji, icon: Icon, label }) => (
        <button
          key={emoji}
          onClick={() => addReaction(emoji)}
          className="
            group inline-flex items-center gap-1.5 px-3 py-1.5
            rounded-full
            border border-blue-200 dark:border-blue-800
            text-blue-600 dark:text-blue-400
            bg-white dark:bg-gray-900
            shadow-sm
            hover:bg-blue-50 dark:hover:bg-blue-900/20
            hover:border-blue-300 dark:hover:border-blue-700
            active:scale-95
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
          "
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="text-xs font-semibold tabular-nums">
            {counts[emoji] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}