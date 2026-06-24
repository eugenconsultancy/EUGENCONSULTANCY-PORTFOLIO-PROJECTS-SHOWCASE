"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublishedProjects } from "@/lib/actions/projects";
import { ProjectModal } from "@/components/ProjectModal";

type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  techStack: string;
  readingTime: number;
  viewCount: number;
  images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [modalSlug, setModalSlug] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getPublishedProjects();
      setProjects(data);
      const tags = new Set<string>();
      data.forEach((p: Project) => {
        p.techStack.split(",").forEach((t) => tags.add(t.trim()));
      });
      setAllTags(Array.from(tags).sort());
    })();
  }, []);

  const filtered =
    selectedTags.length === 0
      ? projects
      : projects.filter((p) =>
          p.techStack.split(",").some((t) => selectedTags.includes(t.trim()))
        );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (projects.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading projects…</p>
      </main>
    );
  }

  // Duplicate items for continuous loop
  const carouselItems = [...filtered, ...filtered, ...filtered];

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16 overflow-x-hidden">
        {/* Hero Header */}
        <section className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-8 h-72 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-3">
              Portfolio
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Projects
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-xl">
              A selection of production‑grade work — hover to pause, click to explore.
            </p>
          </div>
        </section>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTags([])}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedTags.length === 0
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            All projects
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No projects match the selected tags.</p>
          ) : (
            <CarouselRow
              items={carouselItems}
              paused={paused}
              onSelect={(slug) => setModalSlug(slug)}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      {modalSlug && <ProjectModal slug={modalSlug} onClose={() => setModalSlug(null)} />}
    </>
  );
}

// ─── Carousel sub‑component ────────────────────────────────────
function CarouselRow({
  items,
  paused,
  onSelect,
}: {
  items: Project[];
  paused: boolean;
  onSelect: (slug: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const CARD_WIDTH = 320 + 24; // w-80 + gap-6

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setOffset((prev) => {
        const next = prev + 0.6;
        // Reset after one full set to keep it seamless
        return next >= CARD_WIDTH * (items.length / 3) ? 0 : next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [paused, items.length, CARD_WIDTH]);

  return (
    <div
      className="flex gap-6"
      style={{ transform: `translateX(-${offset}px)`, willChange: "transform" }}
    >
      {items.map((project, i) => {
        const mainImage = project.images.find((img) => img.isMain) ?? project.images[0];
        const techs = project.techStack.split(",").map((t) => t.trim());
        return (
          <div
            key={`${project.id}-${i}`}
            onClick={() => onSelect(project.slug)}
            className="cursor-pointer group flex-shrink-0 w-80 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              {mainImage ? (
                <Image
                  src={`/uploads/projects/${mainImage.filename}`}
                  alt={mainImage.alt ?? project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-100 dark:from-gray-800 dark:to-gray-700">
                  <span className="text-5xl opacity-25">📦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm">
                  View Project →
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {techs.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded text-xs font-medium">
                    {t}
                  </span>
                ))}
                {techs.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded text-xs">
                    +{techs.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>👁 {project.viewCount.toLocaleString()}</span>
                <span>⏱ {project.readingTime} min</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
