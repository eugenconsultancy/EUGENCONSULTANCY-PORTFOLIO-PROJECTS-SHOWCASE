"use client";

import { useEffect } from "react";
import { incrementProjectView } from "@/lib/actions/projects";

export function ViewCounter({ slug, initialCount }: { slug: string; initialCount: number }) {
  useEffect(() => {
    incrementProjectView(slug);
  }, [slug]);

  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {initialCount} view{initialCount !== 1 ? "s" : ""}
    </span>
  );
}
