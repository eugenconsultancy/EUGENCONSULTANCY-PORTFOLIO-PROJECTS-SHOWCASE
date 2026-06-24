"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { ProjectImagesRenderer } from "./ProjectImagesRenderer";
import { processMarkdownImages } from "@/lib/markdown";
import { readingTime } from "@/lib/seo";
import { getProjectDetail } from "@/lib/actions/projects";

type Project = Awaited<ReturnType<typeof getProjectDetail>>;

export function ProjectModal({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<Project | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
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

  if (!project) {
    return (
      <div className="fixed top-16 inset-x-0 bottom-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-white text-lg animate-pulse">Loading project…</div>
      </div>
    );
  }

  const processedBody = processMarkdownImages(project.body, project.images);
  const imageList = project.images.map((img) => ({
    src: `/uploads/projects/${img.filename}`,
    alt: img.alt || img.filename,
  }));
  const readTime = readingTime(project.body);
  const mainImage = imageList[0];

  return (
    <div
      className="fixed top-16 inset-x-0 bottom-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl shadow-black/50 animate-in zoom-in-95 fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-blue-300 hover:text-blue-200 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero image */}
        {mainImage && (
          <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-t-3xl">
            <Image
              src={mainImage.src}
              alt={mainImage.alt || project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-10 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-200 tracking-tight">
              {project.title}
            </h1>
            <p className="mt-3 text-blue-100/80 text-base leading-relaxed">
              {project.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200/60">
            <span className="flex items-center gap-1">
              <span>👁</span> {project.viewCount.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <span>⏱</span> {readTime} min read
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.split(",").map((tech) => (
              <span
                key={tech.trim()}
                className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 text-sm font-medium border border-blue-800/50"
              >
                {tech.trim()}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none prose-headings:text-blue-200 prose-a:text-blue-400 prose-strong:text-blue-100">
            <ProjectImagesRenderer content={processedBody} images={imageList} />
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow-lg shadow-blue-600/20"
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-blue-700 text-blue-300 hover:bg-blue-900/40 font-medium transition"
              >
                View GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
