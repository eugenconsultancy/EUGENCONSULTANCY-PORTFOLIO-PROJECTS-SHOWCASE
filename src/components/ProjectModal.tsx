"use client";

import { useEffect, useCallback, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Project = Awaited<ReturnType<typeof getProjectDetail>>;

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
      className={`rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ── Section label ──
function SectionLabel({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-3 ${color}`}
    >
      {label}
    </p>
  );
}

export function ProjectModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "gallery" | "casestudy"
  >("overview");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && activeTab === "gallery") {
        setGalleryIdx((prev) =>
          project ? Math.max(0, prev - 1) : 0
        );
      }
      if (e.key === "ArrowRight" && activeTab === "gallery") {
        setGalleryIdx((prev) =>
          project
            ? Math.min((project.images.length || 1) - 1, prev + 1)
            : 0
        );
      }
    },
    [onClose, activeTab, project]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  useEffect(() => {
    getProjectDetail(slug).then(setProject);
  }, [slug]);

  // ── Loading state ──
  if (!project) {
    const loadingOverlay = (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
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
  const imageList = project.images.map((img) => ({
    src: `${img.filename}`,
    alt: img.alt || img.filename,
  }));
  const readTime = readingTime(project.body);
  const mainImage = imageList[0];
  const hasCaseStudy =
    project.problem ||
    project.approach ||
    project.result ||
    project.metrics;

  const tabs = [
    { id: "overview" as const, icon: <Layout size={14} />, label: "Overview" },
    {
      id: "gallery" as const,
      icon: <ImageIcon size={14} />,
      label: `Gallery`,
      count: imageList.length,
    },
    ...(hasCaseStudy
      ? [
        {
          id: "casestudy" as const,
          icon: <FileText size={14} />,
          label: "Case Study",
        },
      ]
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
      >
        {/* ── Close button floating outside the modal ── */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Close"
        >
          <X size={16} />
        </motion.button>

        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-50 dark:bg-[#111318] border border-white/10 dark:border-gray-700/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Glassmorphism Header ── */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                  {project.title.charAt(0)}
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {project.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {project.viewCount.toLocaleString()}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105"
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all border border-gray-200 dark:border-gray-700 hover:scale-105"
                >
                  <GithubIcon size={12} />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* ── Pill Tab Bar ── */}
          <div className="flex-shrink-0 px-6 py-3 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${activeTab === tab.id
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
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait">
              {/* ─── Overview Tab ─── */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 space-y-5"
                >
                  {/* Hero image with gradient overlay */}
                  {mainImage && (
                    <div className="relative h-52 sm:h-72 w-full rounded-2xl overflow-hidden bg-gray-900">
                      <Image
                        src={mainImage.src}
                        alt={mainImage.alt || project.title}
                        fill
                        className={`object-cover transition-all duration-700 ${imgLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"
                          }`}
                        onLoad={() => setImgLoaded(true)}
                        priority
                      />
                      {/* Multi-stop gradient for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Tags floated over the image */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
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
                    <SectionLabel
                      color="text-blue-500 dark:text-blue-400"
                      label="About"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.summary}
                    </p>
                  </PremiumCard>

                  {/* Tech stack – full list */}
                  <PremiumCard>
                    <SectionLabel
                      color="text-violet-500 dark:text-violet-400"
                      label="Tech Stack"
                    />
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

                  {/* Description */}
                  <PremiumCard>
                    <SectionLabel
                      color="text-gray-400 dark:text-gray-500"
                      label="Description"
                    />
                    <div className="prose prose-sm prose-gray dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
                      <ProjectImagesRenderer
                        content={processedBody}
                        images={imageList}
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
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition hover:bg-blue-500"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold bg-white dark:bg-gray-800 transition hover:bg-gray-50"
                      >
                        <GithubIcon size={14} /> Source
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── Gallery Tab ─── */}
              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8"
                >
                  {imageList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ImageIcon size={28} className="opacity-40" />
                      </div>
                      <p className="text-sm font-medium">No images uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Cinematic main viewer – near-black bg */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0a0a0b]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={galleryIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={imageList[galleryIdx].src}
                              alt={imageList[galleryIdx].alt}
                              fill
                              className="object-contain"
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Gradient wings for arrow context */}
                        {imageList.length > 1 && (
                          <>
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

                            <button
                              onClick={() =>
                                setGalleryIdx((prev) => Math.max(0, prev - 1))
                              }
                              disabled={galleryIdx === 0}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              onClick={() =>
                                setGalleryIdx((prev) =>
                                  Math.min(imageList.length - 1, prev + 1)
                                )
                              }
                              disabled={galleryIdx === imageList.length - 1}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}

                        {/* Counter badge */}
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide border border-white/10">
                          {galleryIdx + 1} / {imageList.length}
                        </div>
                      </div>

                      {/* Thumbnail strip */}
                      {imageList.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                          {imageList.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setGalleryIdx(idx)}
                              className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 ${idx === galleryIdx
                                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-[#111318] opacity-100 scale-100"
                                  : "opacity-50 hover:opacity-80 scale-95 hover:scale-100"
                                }`}
                            >
                              <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Active image caption */}
                      {imageList[galleryIdx].alt && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                          {imageList[galleryIdx].alt}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── Case Study Tab ─── */}
              {activeTab === "casestudy" && (
                <motion.div
                  key="casestudy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8"
                >
                  {/* 2-column grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Problem – red accent, full width on its own row for prominence */}
                    {project.problem && (
                      <div className="sm:col-span-2">
                        <PremiumCard className="border-red-100 dark:border-red-900/30 bg-red-50/60 dark:bg-red-950/20">
                          <SectionLabel
                            color="text-red-500 dark:text-red-400"
                            label="Problem"
                          />
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {project.problem}
                          </p>
                        </PremiumCard>
                      </div>
                    )}

                    {/* Approach – blue */}
                    {project.approach && (
                      <PremiumCard className="border-blue-100 dark:border-blue-900/30 bg-blue-50/60 dark:bg-blue-950/20">
                        <SectionLabel
                          color="text-blue-500 dark:text-blue-400"
                          label="Approach"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {project.approach}
                        </p>
                      </PremiumCard>
                    )}

                    {/* Result – green */}
                    {project.result && (
                      <PremiumCard className="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/60 dark:bg-emerald-950/20">
                        <SectionLabel
                          color="text-emerald-600 dark:text-emerald-400"
                          label="Result"
                        />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {project.result}
                        </p>
                      </PremiumCard>
                    )}

                    {/* Metrics – purple, full width for data density */}
                    {project.metrics && (
                      <div className="sm:col-span-2">
                        <PremiumCard className="border-violet-100 dark:border-violet-900/30 bg-violet-50/60 dark:bg-violet-950/20">
                          <SectionLabel
                            color="text-violet-500 dark:text-violet-400"
                            label="Metrics"
                          />
                          {/* Parse metrics into a visual grid if they follow key: value format */}
                          {project.metrics.includes(":") ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {project.metrics
                                .split("\n")
                                .filter(Boolean)
                                .map((line, i) => {
                                  const [key, ...rest] = line.split(":");
                                  const val = rest.join(":").trim();
                                  return (
                                    <div key={i} className="space-y-1">
                                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
                                        {key.trim()}
                                      </p>
                                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {val}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
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