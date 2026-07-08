"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
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

// ── Inline GitHub icon (lucide-react doesn't export one) ──
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
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
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "casestudy">("overview");
  const [galleryIdx, setGalleryIdx] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && activeTab === "gallery") {
        setGalleryIdx((prev) => (project ? Math.max(0, prev - 1) : 0));
      }
      if (e.key === "ArrowRight" && activeTab === "gallery") {
        setGalleryIdx((prev) => (project ? Math.min((project.images.length || 1) - 1, prev + 1) : 0));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-white text-sm font-medium animate-pulse">Loading project…</p>
        </div>
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
  const hasCaseStudy = project.problem || project.approach || project.result || project.metrics;

  const tabs = [
    { id: "overview" as const, icon: <Layout size={15} />, label: "Overview" },
    { id: "gallery" as const, icon: <ImageIcon size={15} />, label: `Gallery (${imageList.length})` },
    ...(hasCaseStudy ? [{ id: "casestudy" as const, icon: <FileText size={15} />, label: "Case Study" }] : []),
  ];

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {project.title.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">{project.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="flex items-center gap-1"><Eye size={12} /> {project.viewCount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold transition"
              >
                <GithubIcon size={13} />
                GitHub
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex-shrink-0 flex border-b border-gray-100 dark:border-gray-800 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-6">
              {/* Hero image */}
              {mainImage && (
                <div className="relative h-48 sm:h-64 w-full rounded-xl overflow-hidden">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt || project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              )}

              {/* Summary */}
              <div>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Tech stack */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.split(",").map((tech) => (
                    <span
                      key={tech.trim()}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800/50"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded text-sm">
                  <ProjectImagesRenderer content={processedBody} images={imageList} />
                </div>
              </div>

              {/* Mobile action buttons */}
              <div className="flex flex-wrap gap-3 sm:hidden pt-4 border-t border-gray-100 dark:border-gray-800">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold transition"
                  >
                    <GithubIcon size={14} /> GitHub
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="p-6">
              {imageList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <ImageIcon size={48} className="mb-3 opacity-30" />
                  <p className="text-sm">No images available</p>
                </div>
              ) : (
                <>
                  {/* Main gallery image */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                    <Image
                      src={imageList[galleryIdx].src}
                      alt={imageList[galleryIdx].alt}
                      fill
                      className="object-contain"
                    />
                    {/* Navigation arrows */}
                    {imageList.length > 1 && (
                      <>
                        <button
                          onClick={() => setGalleryIdx((prev) => Math.max(0, prev - 1))}
                          disabled={galleryIdx === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => setGalleryIdx((prev) => Math.min(imageList.length - 1, prev + 1))}
                          disabled={galleryIdx === imageList.length - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-medium">
                      {galleryIdx + 1} / {imageList.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {imageList.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {imageList.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIdx(idx)}
                          className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${idx === galleryIdx
                            ? "border-blue-500 ring-2 ring-blue-500/30"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100"
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
                </>
              )}
            </div>
          )}

          {/* Case Study Tab */}
          {activeTab === "casestudy" && (
            <div className="p-6 space-y-6">
              {project.problem && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Problem
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{project.problem}</p>
                </div>
              )}

              {project.approach && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Approach
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{project.approach}</p>
                </div>
              )}

              {project.result && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> Result
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{project.result}</p>
                </div>
              )}

              {project.metrics && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Metrics
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{project.metrics}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}