import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { processMarkdownImages } from "@/lib/markdown";
import { ProjectImagesRenderer } from "@/components/ProjectImagesRenderer";
import { CommentSection } from "@/components/CommentSection";
import { CaseStudySection } from "@/components/CaseStudySection";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { ReactionButtons } from "@/components/ReactionButtons";
import { ShareButton } from "@/components/ShareButton";
import { ViewCounter } from "@/components/ViewCounter";
import { readingTime, projectJsonLd } from "@/lib/seo";
import { ImageCarousel } from "@/components/ImageCarousel";
import {
  ExternalLink,
  Layers,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  ThumbsUp,
  Flame,
  Sparkles,
  Rocket,
  Brain,
} from "lucide-react";
import type { Metadata } from "next";

// ── Inline GitHub icon (lucide-react doesn't export one in your version) ──
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

type ProjectWithImages = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  techStack: string;
  dependencies: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  viewCount: number;
  status: string;
  previewToken: string | null;
  problem: string | null;
  approach: string | null;
  result: string | null;
  metrics: string | null;
  frameworkRationale?: string | null;
  beforeImageId: number | null;
  afterImageId: number | null;
  beforeImage: { filename: string } | null;
  afterImage: { filename: string } | null;
  images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
  createdAt: Date;
  updatedAt: Date;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await db.project.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: {
      title: true,
      summary: true,
      slug: true,
      images: { take: 1, select: { filename: true } },
    },
  });
  if (!project) return { title: "Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const imageUrl =
    project.images.length > 0
      ? `${project.images[0].filename}`
      : `${baseUrl}/api/og?title=${encodeURIComponent(project.title)}&tech=`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `${baseUrl}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${baseUrl}/projects/${project.slug}`,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [imageUrl],
    },
  };
}

// ─── Tech icon mapping ────────────────────────────────────────────────────────
const TECH_ICONS: Record<string, string> = {
  React: "⚛",
  "Next.js": "▲",
  TypeScript: "𝕋",
  JavaScript: "𝙅",
  Python: "🐍",
  Django: "🎸",
  "Node.js": "⬡",
  Node: "⬡",
  PostgreSQL: "🐘",
  MySQL: "🐬",
  MongoDB: "🍃",
  Redis: "⚡",
  Docker: "🐳",
  AWS: "☁",
  Tailwind: "🌊",
  GraphQL: "◈",
  Prisma: "◆",
  Supabase: "⚡",
  Stripe: "💳",
  Vercel: "▲",
};

const TECH_COLORS: Record<string, { from: string; to: string; text: string; glow: string }> = {
  React: { from: "#0ea5e9", to: "#38bdf8", text: "#bae6fd", glow: "rgba(14,165,233,0.4)" },
  "Next.js": { from: "#334155", to: "#475569", text: "#e2e8f0", glow: "rgba(255,255,255,0.2)" },
  TypeScript: { from: "#1d4ed8", to: "#3b82f6", text: "#bfdbfe", glow: "rgba(59,130,246,0.4)" },
  Python: { from: "#854d0e", to: "#ca8a04", text: "#fef08a", glow: "rgba(202,138,4,0.4)" },
  Django: { from: "#065f46", to: "#10b981", text: "#a7f3d0", glow: "rgba(16,185,129,0.4)" },
  "Node.js": { from: "#14532d", to: "#22c55e", text: "#bbf7d0", glow: "rgba(34,197,94,0.4)" },
  Node: { from: "#14532d", to: "#22c55e", text: "#bbf7d0", glow: "rgba(34,197,94,0.4)" },
  PostgreSQL: { from: "#1e3a5f", to: "#2563eb", text: "#bfdbfe", glow: "rgba(37,99,235,0.4)" },
  Docker: { from: "#0c4a6e", to: "#0284c7", text: "#bae6fd", glow: "rgba(2,132,199,0.4)" },
  AWS: { from: "#7c2d12", to: "#f97316", text: "#fed7aa", glow: "rgba(249,115,22,0.4)" },
  Redis: { from: "#7f1d1d", to: "#ef4444", text: "#fecaca", glow: "rgba(239,68,68,0.4)" },
  Tailwind: { from: "#0c4a6e", to: "#38bdf8", text: "#bae6fd", glow: "rgba(56,189,248,0.4)" },
  GraphQL: { from: "#4a044e", to: "#d946ef", text: "#f0abfc", glow: "rgba(217,70,239,0.4)" },
};

const DEFAULT_TECH_COLOR = {
  from: "#312e81",
  to: "#818cf8",
  text: "#c7d2fe",
  glow: "rgba(129,140,248,0.4)",
};

function getTechColor(tech: string) {
  return TECH_COLORS[tech.trim()] ?? DEFAULT_TECH_COLOR;
}

function getTechIcon(tech: string) {
  return TECH_ICONS[tech.trim()] ?? "◉";
}

// ─── Dependency colour palette ────────────────────────────────────────────────
const DEPENDENCY_COLOURS = [
  "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800",
  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
  "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800",
  "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800",
  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800",
];

// ─── Metrics parsing with icon + label support ────────────────────────────────
const METRIC_ICONS = [BarChart3, TrendingUp, Layers, BookOpen];

function parseMetrics(raw: string): { value: string; label: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIdx = line.indexOf("|");
      if (pipeIdx !== -1) {
        return { value: line.slice(0, pipeIdx).trim(), label: line.slice(pipeIdx + 1).trim() };
      }
      // Support "value: label" colon format
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        return { value: line.slice(0, colonIdx).trim(), label: line.slice(colonIdx + 1).trim() };
      }
      const spaceIdx = line.search(/\s/);
      if (spaceIdx !== -1) {
        return { value: line.slice(0, spaceIdx).trim(), label: line.slice(spaceIdx).trim() };
      }
      return { value: line, label: "" };
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { preview?: string };
}) {
  const { slug } = params;
  const previewToken = searchParams?.preview;

  let project: ProjectWithImages | null;
  if (previewToken) {
    project = await db.project.findUnique({
      where: { slug },
      include: {
        images: true,
        beforeImage: { select: { filename: true } },
        afterImage: { select: { filename: true } },
      },
    });
    if (!project || project.previewToken !== previewToken) notFound();
  } else {
    project = await db.project.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        images: true,
        beforeImage: { select: { filename: true } },
        afterImage: { select: { filename: true } },
      },
    });
    if (!project) notFound();
  }

  const processedBody = processMarkdownImages(project.body, project.images);
  const imageList = project.images.map((img) => ({
    src: `${img.filename}`,
    alt: img.alt || img.filename,
  }));
  const readTime = readingTime(project.body);
  const jsonLd =
    project.status === "PUBLISHED"
      ? projectJsonLd({ ...project, images: project.images })
      : null;
  const deps = project.dependencies
    ? project.dependencies.split("\n").map((d) => d.trim()).filter(Boolean)
    : [];
  const techList = project.techStack.split(",").map((t) => t.trim()).filter(Boolean);
  const kpis = project.metrics ? parseMetrics(project.metrics) : [];
  const mainImage = imageList[0] ?? null;

  return (
    <>
      <ReadingProgress />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ── Draft banner ── */}
      {project.status === "DRAFT" && (
        <div className="bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-sm font-medium text-center">
          Preview mode — this project is not yet published.
        </div>
      )}

      {/* ── Consistent max-width container across ALL sections ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-10">

        {/* ══════════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #0f0f1e 0%, #12082b 50%, #0a1628 100%)",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 32px 64px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Ambient orbs */}
          <div className="absolute pointer-events-none" style={{ top: "-100px", left: "-80px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)" }} />
          <div className="absolute pointer-events-none" style={{ bottom: "-80px", right: "-60px", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)" }} />

          <div className="relative p-6 md:p-10">
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(129,140,248,0.8)" }}>
              Project Showcase
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left: text */}
              <div className="space-y-5">
                <h1
                  className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.1]"
                  style={{ background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {project.title}
                </h1>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(203,213,225,0.85)" }}>
                  {project.summary}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
                  <ViewCounter slug={project.slug} initialCount={project.viewCount} />
                  <span className="opacity-40">·</span>
                  <span>{readTime} min read</span>
                  <span className="opacity-40">·</span>
                  <ReactionButtons projectId={project.id} />
                  <div className="ml-auto">
                    <ShareButton title={project.title} slug={project.slug} />
                  </div>
                </div>

                {/* ── KPI stats — compact horizontal cards ── */}
                {kpis.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {kpis.slice(0, 4).map((kpi, i) => {
                      const Icon = METRIC_ICONS[i % METRIC_ICONS.length];
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 min-w-0 overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.25)" }}>
                            <Icon size={14} style={{ color: "#a5b4fc" }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-sm font-extrabold leading-tight truncate"
                              style={{ background: "linear-gradient(135deg, #a5b4fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                            >
                              {kpi.value}
                            </div>
                            <div
                              className="text-[10px] leading-tight break-words line-clamp-2"
                              style={{ color: "rgba(148,163,184,0.7)" }}
                            >
                              {kpi.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* CTA buttons — ONE set, sidebar removed below */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
                      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff", boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", backdropFilter: "blur(8px)" }}
                    >
                      <GithubIcon size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Right: main screenshot */}
              {mainImage && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))", filter: "blur(24px)", transform: "scale(0.95) translateY(8px)" }} />
                  <div className="relative overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mainImage.src} alt={mainImage.alt} className="w-full object-cover" style={{ maxHeight: "300px" }} />
                    <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(to top, rgba(12,8,30,0.6), transparent)" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            REACTION PILLS — Lucide icon row (replaces emoji-only display)
        ══════════════════════════════════════════════════════════════════════ */}
        <section className="flex flex-wrap gap-2 items-center">
          {[
            { icon: ThumbsUp, label: "Like", color: "#60a5fa", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
            { icon: Flame, label: "Hot", color: "#fb923c", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
            { icon: Sparkles, label: "Amazing", color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.25)" },
            { icon: Rocket, label: "Launch", color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
            { icon: Brain, label: "Insightful", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)" },
          ].map(({ icon: Icon, label, color, bg, border }) => (
            <button
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 hover:shadow-md cursor-pointer"
              style={{ background: bg, border: `1px solid ${border}`, color }}
              aria-label={`React with ${label}`}
            >
              <Icon size={13} />
              <span>{label}</span>
              <span className="opacity-60 ml-0.5">0</span>
            </button>
          ))}
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            TECH STACK — compact pill grid (no longer a tall section)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="rounded-2xl p-5 md:p-6"
          style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,0.4) 100%)", border: "1px solid rgba(99,102,241,0.15)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(129,140,248,0.7)" }}>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {techList.map((tech) => {
              const c = getTechColor(tech);
              const icon = getTechIcon(tech);
              return (
                <div
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 cursor-default"
                  style={{ background: `linear-gradient(135deg, ${c.from}22, ${c.to}18)`, border: `1px solid ${c.from}44`, color: c.text, boxShadow: `0 0 8px ${c.glow}` }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                  {tech}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            FRAMEWORK RATIONALE — compact grid layout (was a long vertical block)
        ══════════════════════════════════════════════════════════════════════ */}
        {project.frameworkRationale && (
          <section
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,0.4) 100%)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2" style={{ color: "rgba(129,140,248,0.7)" }}>
              <Layers size={13} style={{ color: "rgba(129,140,248,0.7)" }} />
              Why This Stack?
            </h2>
            {/* Split rationale into sentences and lay them in a 2-col grid */}
            {(() => {
              const sentences = project.frameworkRationale!
                .split(/(?<=[.!?])\s+/)
                .map((s) => s.trim())
                .filter(Boolean);
              return sentences.length >= 4 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sentences.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-4 py-3 text-sm text-gray-300 leading-relaxed"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.frameworkRationale}
                </p>
              );
            })()}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            IMAGE GALLERY
        ══════════════════════════════════════════════════════════════════════ */}
        {imageList.length > 1 && (
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(129,140,248,0.7)" }}>
              Gallery
            </h2>
            {imageList.length >= 3 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imageList.map((img, i) => (
                  <div
                    key={img.src}
                    className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", aspectRatio: i === 0 ? "16/9" : "4/3" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                      <span className="text-white text-xs font-medium opacity-80">{img.alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ImageCarousel images={imageList} />
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            BODY CONTENT — article + TOC sidebar
            Sidebar no longer has duplicate project-links card (removed redundancy)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
          <article className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 md:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
              <ProjectImagesRenderer content={processedBody} images={imageList} />
            </div>
          </article>

          {/* Sidebar — TOC only; project links removed (available in hero) */}
          <aside className="space-y-4">
            <div className="sticky top-24">
              <TableOfContents content={processedBody} />
            </div>
          </aside>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            DEPENDENCIES
        ══════════════════════════════════════════════════════════════════════ */}
        {deps.length > 0 && (
          <section
            className="rounded-2xl p-5 md:p-6"
            style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,0.4) 100%)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(129,140,248,0.7)" }}>
              Dependencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {deps.map((dep, idx) => {
                const colourClass = DEPENDENCY_COLOURS[idx % DEPENDENCY_COLOURS.length];
                return (
                  <div key={dep} className={`px-3 py-2 rounded-xl border ${colourClass} font-mono text-xs font-medium hover:scale-105 hover:shadow-md transition-all cursor-default truncate`} title={dep}>
                    {dep}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            CASE STUDY — horizontal 3-col row, compact (not tall vertical cards)
        ══════════════════════════════════════════════════════════════════════ */}
        {(project.problem || project.approach || project.result) && (
          <section className="space-y-5">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: "rgba(129,140,248,0.7)" }}>
              <BookOpen size={13} style={{ color: "rgba(129,140,248,0.7)" }} />
              Case Study
            </h2>

            {/* Horizontal compact cards — equal height, side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.problem && (
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.3) 0%, rgba(15,23,42,0.85) 100%)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                      <AlertTriangle size={14} style={{ color: "#f87171" }} />
                    </div>
                    <h3 className="text-xs font-bold tracking-[0.08em] uppercase" style={{ color: "#fca5a5" }}>Problem</h3>
                  </div>
                  <div className="w-6 h-px" style={{ background: "rgba(239,68,68,0.4)" }} />
                  <p className="text-gray-300 text-sm leading-relaxed">{project.problem}</p>
                </div>
              )}

              {project.approach && (
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "linear-gradient(135deg, rgba(30,27,75,0.5) 0%, rgba(15,23,42,0.85) 100%)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                      <Lightbulb size={14} style={{ color: "#a5b4fc" }} />
                    </div>
                    <h3 className="text-xs font-bold tracking-[0.08em] uppercase" style={{ color: "#a5b4fc" }}>Solution</h3>
                  </div>
                  <div className="w-6 h-px" style={{ background: "rgba(99,102,241,0.4)" }} />
                  <p className="text-gray-300 text-sm leading-relaxed">{project.approach}</p>
                </div>
              )}

              {project.result && (
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "linear-gradient(135deg, rgba(6,78,59,0.35) 0%, rgba(15,23,42,0.85) 100%)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <TrendingUp size={14} style={{ color: "#6ee7b7" }} />
                    </div>
                    <h3 className="text-xs font-bold tracking-[0.08em] uppercase" style={{ color: "#6ee7b7" }}>Results</h3>
                  </div>
                  <div className="w-6 h-px" style={{ background: "rgba(16,185,129,0.4)" }} />
                  <p className="text-gray-300 text-sm leading-relaxed">{project.result}</p>
                </div>
              )}
            </div>

            {/* Before / After images */}
            {(project.beforeImage || project.afterImage) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.beforeImage && (
                  <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid rgba(239,68,68,0.2)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.beforeImage.filename} alt="Before" className="w-full object-cover" />
                    <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(127,29,29,0.8)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)", backdropFilter: "blur(8px)" }}>
                      <AlertTriangle size={11} /> Before
                    </span>
                  </div>
                )}
                {project.afterImage && (
                  <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid rgba(16,185,129,0.2)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.afterImage.filename} alt="After" className="w-full object-cover" />
                    <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(6,78,59,0.8)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)", backdropFilter: "blur(8px)" }}>
                      <TrendingUp size={11} /> After
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Remaining KPIs (beyond the 4 shown in hero) */}
            {kpis.length > 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {kpis.slice(4).map((kpi, i) => {
                  const Icon = METRIC_ICONS[(i + 4) % METRIC_ICONS.length];
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.2)" }}>
                        <Icon size={12} style={{ color: "#a5b4fc" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold" style={{ background: "linear-gradient(135deg, #a5b4fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {kpi.value}
                        </div>
                        <div className="text-[10px] truncate" style={{ color: "rgba(148,163,184,0.7)" }}>{kpi.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hidden fallback */}
            <div className="hidden">
              <CaseStudySection
                problem={project.problem || ""}
                approach={project.approach || ""}
                result={project.result || ""}
                metrics={project.metrics || ""}
                beforeImage={project.beforeImage ? `${project.beforeImage.filename}` : undefined}
                afterImage={project.afterImage ? `${project.afterImage.filename}` : undefined}
              />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            COMMENTS
        ══════════════════════════════════════════════════════════════════════ */}
        {project.status === "PUBLISHED" && (
          <section
            className="rounded-3xl p-6 md:p-10"
            style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,0.4) 100%)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <CommentSection projectId={project.id} />
          </section>
        )}
      </main>
    </>
  );
}