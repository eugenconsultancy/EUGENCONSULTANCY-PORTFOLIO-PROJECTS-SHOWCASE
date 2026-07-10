"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectImagesRenderer } from "./ProjectImagesRenderer";
import { processMarkdownImages } from "@/lib/markdown";
import { readingTime } from "@/lib/seo";
import { getProjectDetail } from "@/lib/actions/projects";
import {
  X,
  Eye,
  Clock,
  ExternalLink,
  Layout,
  ImageIcon,
  FileText,
} from "lucide-react";

type Project = Awaited<ReturnType<typeof getProjectDetail>>;

// ── Focusable element selectors for focus trap ──
const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// ── Inline GitHub icon ──
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Premium Card wrapper ──
function PremiumCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm p-5 sm:p-6 min-w-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

// ── Section label ──
function SectionLabel({ color, label }: { color: string; label: string }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-3 ${color}`}>
      {label}
    </p>
  );
}

// ── Strip markdown and HTML image syntax from a string ──
// Used to prevent images from appearing twice (once in Description,
// once in the dedicated Gallery tab).
function stripImages(content: string): string {
  return content
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "") // markdown: ![alt](url)
    .replace(/<img[^>]*\/?>/gi, "");          // HTML: <img ...>
}

export function ProjectModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "casestudy">("overview");
  const [imgLoaded, setImgLoaded] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Capture trigger element; restore focus on unmount
  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap on Tab / Shift+Tab
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [handleKeyDown]);

  // Move focus into modal once project data arrives
  useEffect(() => {
    if (!project || !modalRef.current) return;
    const firstFocusable = modalRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    firstFocusable?.focus();
  }, [project]);

  useEffect(() => {
    getProjectDetail(slug).then(setProject);
  }, [slug]);

  // ── Loading state ──
  if (!project) {
    const loadingOverlay = (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Loading project"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-blue-500 animate-spin" />
          </div>
          <p className="text-white/70 text-sm font-medium tracking-wide animate-pulse">
            Loading project…
          </p>
        </motion.div>
      </div>
    );
    return createPortal(loadingOverlay, document.body);
  }

  const processedBody = processMarkdownImages(project.body, project.images);

  // Strip images from the description body so images only appear in Gallery tab.
  const processedBodyNoImages = stripImages(processedBody);

  const imageList = project.images.map((img) => ({
    src: `${img.filename}`,
    alt: img.alt || img.filename,
  }));

  const readTime = readingTime(project.body);
  const mainImage = imageList[0];
  const hasCaseStudy =
    project.problem || project.approach || project.result || project.metrics;

  const tabs = [
    { id: "overview" as const, icon: <Layout size={14} />, label: "Overview" },
    {
      id: "gallery" as const,
      icon: <ImageIcon size={14} />,
      label: "Gallery",
      count: imageList.length,
    },
    ...(hasCaseStudy
      ? [{ id: "casestudy" as const, icon: <FileText size={14} />, label: "Case Study" }]
      : []),
  ];

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-lg p-4 sm:p-6"
        onClick={onClose}
        aria-hidden="true"
      >
        {/* ── Close button ── */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Close modal"
        >
          <X size={16} />
        </motion.button>

        <motion.div
          key="modal"
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-50 dark:bg-[#111318] border border-white/10 dark:border-gray-700/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] flex flex-col min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Glassmorphism Header ── */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                  {project.title.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900" />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="modal-title"
                  className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate leading-tight"
                >
                  {project.title}
                </h2>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {project.viewCount.toLocaleString()}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {readTime} min
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                >
                  <ExternalLink size={12} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all border border-gray-200 dark:border-gray-700 hover:scale-105 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
                >
                  <GithubIcon size={12} />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* ── Pill Tab Bar ── */}
          <div
            role="tablist"
            aria-label="Project sections"
            className="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
          >
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeTab === tab.id
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {"count" in tab && tab.count !== undefined && (
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-w-0">
            <AnimatePresence mode="wait">

              {/* ─── Overview Tab ─── */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  id="tabpanel-overview"
                  role="tabpanel"
                  aria-labelledby="tab-overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-6 lg:p-8 space-y-5 min-w-0"
                >
                  {/* Hero image */}
                  {mainImage && (
                    <div className="relative h-48 sm:h-64 lg:h-72 w-full rounded-2xl overflow-hidden bg-gray-900">
                      <Image
                        src={mainImage.src}
                        alt={mainImage.alt || project.title}
                        fill
                        className={`object-cover transition-all duration-700 ${imgLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"
                          }`}
                        onLoad={() => setImgLoaded(true)}
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                        {project.techStack
                          .split(",")
                          .slice(0, 4)
                          .map((tech) => (
                            <span
                              key={tech.trim()}
                              className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium border border-white/10"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        {project.techStack.split(",").length > 4 && (
                          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                            +{project.techStack.split(",").length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary card */}
                  <PremiumCard>
                    <SectionLabel color="text-blue-500 dark:text-blue-400" label="About" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                      {project.summary}
                    </p>
                  </PremiumCard>

                  {/* Tech stack – full list */}
                  <PremiumCard>
                    <SectionLabel color="text-violet-500 dark:text-violet-400" label="Tech Stack" />
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.split(",").map((tech) => (
                        <span
                          key={tech.trim()}
                          className="px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-semibold border border-violet-100 dark:border-violet-800/50 tracking-wide"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </PremiumCard>

                  {/* Description — images stripped so they only show in Gallery tab */}
                  <PremiumCard>
                    <SectionLabel color="text-gray-400 dark:text-gray-500" label="Description" />
                    <div className="prose prose-sm prose-gray dark:prose-invert max-w-none break-words overflow-hidden prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:overflow-x-auto">
                      {/*
                        Pass processedBodyNoImages (images stripped) so images are
                        not rendered here AND again inside the Gallery tab.
                        The imageList prop is intentionally empty to suppress any
                        image-gallery behaviour inside ProjectImagesRenderer itself.
                      */}
                      <ProjectImagesRenderer
                        content={processedBodyNoImages}
                        images={[]}
                      />
                    </div>
                  </PremiumCard>

                  {/* Mobile action buttons */}
                  <div className="flex flex-wrap gap-3 sm:hidden">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold bg-white dark:bg-gray-800 transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
                      >
                        <GithubIcon size={14} /> Source
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── Gallery Tab — 2-column grid ─── */}
              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  id="tabpanel-gallery"
                  role="tabpanel"
                  aria-labelledby="tab-gallery"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-6 lg:p-8"
                >
                  {imageList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ImageIcon size={28} className="opacity-40" />
                      </div>
                      <p className="text-sm font-medium">No images uploaded</p>
                    </div>
                  ) : (
                    /*
                      2-column grid — each cell is a fixed aspect-video box.
                      Cards are self-contained: no selection state, no prev/next nav.
                      Images wrap naturally into rows as the list grows.
                    */
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {imageList.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-2xl overflow-hidden bg-[#0a0a0b] group"
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Caption overlay — only rendered when alt text exists */}
                          {img.alt && (
                            <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                              <p className="text-white text-[11px] font-medium truncate">
                                {img.alt}
                              </p>
                            </div>
                          )}
                          {/* Index badge */}
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10 leading-none">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── Case Study Tab ─── */}
              {activeTab === "casestudy" && (
                <motion.div
                  key="casestudy"
                  id="tabpanel-casestudy"
                  role="tabpanel"
                  aria-labelledby="tab-casestudy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-6 lg:p-8"
                >
                  {/*
                    `items-start` is the critical fix here:
                    Without it, CSS grid stretches every card in a row to match
                    the tallest sibling. With `items-start`, each card is only
                    as tall as its own content — no artificial padding.
                  */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {project.problem && (
                      <div className="col-span-1 sm:col-span-2">
                        <PremiumCard className="border-red-100 dark:border-red-900/30 bg-red-50/60 dark:bg-red-950/20">
                          <SectionLabel color="text-red-500 dark:text-red-400" label="Problem" />
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                            {project.problem}
                          </p>
                        </PremiumCard>
                      </div>
                    )}

                    {project.approach && (
                      <PremiumCard className="border-blue-100 dark:border-blue-900/30 bg-blue-50/60 dark:bg-blue-950/20">
                        <SectionLabel color="text-blue-500 dark:text-blue-400" label="Approach" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                          {project.approach}
                        </p>
                      </PremiumCard>
                    )}

                    {project.result && (
                      <PremiumCard className="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/60 dark:bg-emerald-950/20">
                        <SectionLabel color="text-emerald-600 dark:text-emerald-400" label="Result" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                          {project.result}
                        </p>
                      </PremiumCard>
                    )}

                    {project.metrics && (
                      <div className="col-span-1 sm:col-span-2">
                        <PremiumCard className="border-violet-100 dark:border-violet-900/30 bg-violet-50/60 dark:bg-violet-950/20">
                          <SectionLabel color="text-violet-500 dark:text-violet-400" label="Metrics" />
                          {project.metrics.includes(":") ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {project.metrics
                                .split("\n")
                                .filter(Boolean)
                                .map((line, i) => {
                                  const [key, ...rest] = line.split(":");
                                  const val = rest.join(":").trim();
                                  return (
                                    <div key={i} className="space-y-1 min-w-0">
                                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide truncate">
                                        {key.trim()}
                                      </p>
                                      <p className="text-lg font-bold text-gray-900 dark:text-white break-words">
                                        {val}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line break-words">
                              {project.metrics}
                            </p>
                          )}
                        </PremiumCard>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}