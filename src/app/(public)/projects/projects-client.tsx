"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Tech categorisation map ──────────────────────────────────────────────────
const TECH_CATEGORIES: Record<string, string[]> = {
    Frontend: [
        "React", "Next.js", "Vue", "Nuxt", "Svelte", "SvelteKit", "Angular",
        "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "SCSS",
        "Framer Motion", "Three.js", "Vite", "Webpack",
    ],
    Backend: [
        "Node.js", "Express", "Fastify", "Hono", "NestJS", "Django", "FastAPI",
        "Flask", "Laravel", "Rails", "Go", "Rust", "Python", "Java", "PHP",
        "tRPC", "GraphQL", "REST", "WebSockets",
    ],
    Database: [
        "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Supabase",
        "PlanetScale", "Neon", "Prisma", "Drizzle", "Firebase",
    ],
    "DevOps & Cloud": [
        "AWS", "GCP", "Azure", "Vercel", "Netlify", "Docker", "Kubernetes",
        "Terraform", "GitHub Actions", "CI/CD", "Nginx", "Linux",
    ],
    "Auth & APIs": [
        "NextAuth", "Auth.js", "Clerk", "JWT", "OAuth", "Stripe", "Twilio",
        "SendGrid", "Resend", "OpenAI", "Anthropic", "Cloudinary", "Uploadthing",
    ],
};

// Map a raw tag string to its category
function categorise(tag: string): string {
    for (const [cat, tags] of Object.entries(TECH_CATEGORIES)) {
        if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return cat;
    }
    return "Other";
}

// Subtle per-category pill colour (bg / text) – both light and dark via Tailwind
const CAT_COLOURS: Record<string, { pill: string; dot: string }> = {
    Frontend: { pill: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/25 dark:text-violet-300 dark:border-violet-800", dot: "bg-violet-400" },
    Backend: { pill: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/25 dark:text-sky-300 dark:border-sky-800", dot: "bg-sky-400" },
    Database: { pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/25 dark:text-amber-300 dark:border-amber-800", dot: "bg-amber-400" },
    "DevOps & Cloud": { pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-800", dot: "bg-emerald-400" },
    "Auth & APIs": { pill: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/25 dark:text-rose-300 dark:border-rose-800", dot: "bg-rose-400" },
    Other: { pill: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700", dot: "bg-gray-400" },
};

// ─── Types ────────────────────────────────────────────────────────────────────
type ProjectWithMeta = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    techStack: string;
    viewCount: number;
    readingTime: number;
    images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
};

// ─── Client component ─────────────────────────────────────────────────────────
export function ProjectsClient({ projects }: { projects: ProjectWithMeta[] }) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    // Build categorised tag map from all projects
    const categorisedTags = useMemo(() => {
        const allTags = [
            ...new Set(
                projects.flatMap((p) =>
                    p.techStack.split(",").map((t) => t.trim()).filter(Boolean)
                )
            ),
        ].sort();

        const map: Record<string, string[]> = {};
        for (const tag of allTags) {
            const cat = categorise(tag);
            if (!map[cat]) map[cat] = [];
            map[cat].push(tag);
        }
        // Ensure canonical order
        const ORDER = ["Frontend", "Backend", "Database", "DevOps & Cloud", "Auth & APIs", "Other"];
        const sorted: Record<string, string[]> = {};
        for (const cat of ORDER) {
            if (map[cat]?.length) sorted[cat] = map[cat];
        }
        for (const cat of Object.keys(map)) {
            if (!sorted[cat]) sorted[cat] = map[cat];
        }
        return sorted;
    }, [projects]);

    // Filter projects by active tag
    const filtered = useMemo(() => {
        if (!activeTag) return projects;
        return projects.filter((p) =>
            p.techStack
                .split(",")
                .map((t) => t.trim())
                .some((t) => t.toLowerCase() === activeTag.toLowerCase())
        );
    }, [projects, activeTag]);

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">

            {/* ── Hero ── */}
            <section className="relative py-20 overflow-hidden">
                {/* subtle dot grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                {/* blue glow top-right */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 right-0 w-[480px] h-[480px] rounded-full opacity-[0.07] dark:opacity-[0.12]"
                    style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
                />
                <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
                    <span className="inline-block px-3 py-1 mb-4 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                        Portfolio
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                        Projects
                    </h1>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                        Production-grade work across the full stack — click any card to read the full case study.
                    </p>
                </div>
            </section>

            {/* ── Categorised tech stack filter ── */}
            <section className="pb-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-5 space-y-5">

                        {/* header row */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                Filter by technology
                            </p>
                            {activeTag && (
                                <button
                                    onClick={() => setActiveTag(null)}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">✕</span>
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* category groups */}
                        <div className="space-y-4">
                            {Object.entries(categorisedTags).map(([cat, tags]) => {
                                const colours = CAT_COLOURS[cat] ?? CAT_COLOURS.Other;
                                return (
                                    <div key={cat}>
                                        {/* category label */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${colours.dot}`} />
                                            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                {cat}
                                            </span>
                                        </div>
                                        {/* pills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map((tag) => {
                                                const isActive = activeTag === tag;
                                                return (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setActiveTag(isActive ? null : tag)}
                                                        className={[
                                                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150",
                                                            "hover:scale-105 active:scale-100",
                                                            isActive
                                                                ? "ring-2 ring-offset-1 ring-blue-400 dark:ring-blue-500 scale-105 " + colours.pill
                                                                : colours.pill,
                                                        ].join(" ")}
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* active filter banner */}
                    {activeTag && (
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Showing{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {filtered.length}
                            </span>{" "}
                            project{filtered.length !== 1 ? "s" : ""} tagged{" "}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{activeTag}</span>
                        </p>
                    )}
                </div>
            </section>

            {/* ── Projects grid ── */}
            <section className="py-4 pb-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-gray-400 dark:text-gray-500 text-lg">
                                No projects match <span className="font-semibold text-gray-700 dark:text-gray-300">{activeTag}</span>.
                            </p>
                            <button
                                onClick={() => setActiveTag(null)}
                                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Show all projects
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((project) => {
                                const mainImage =
                                    project.images.find((img) => img.isMain) ?? project.images[0];
                                const techs = project.techStack
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean);

                                return (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.slug}`}
                                        className="group flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
                                    >
                                        {/* thumbnail */}
                                        <div className="relative h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                            {mainImage ? (
                                                <Image
                                                    src={mainImage.filename}
                                                    alt={mainImage.alt ?? project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-100 dark:from-gray-800 dark:to-gray-700">
                                                    <span className="text-5xl opacity-20">📦</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-sm">
                                                    View case study →
                                                </span>
                                            </div>
                                        </div>

                                        {/* content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base leading-snug">
                                                {project.title}
                                            </h3>
                                            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                                                {project.summary}
                                            </p>

                                            {/* tech pills */}
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {techs.slice(0, 4).map((t) => {
                                                    const cat = categorise(t);
                                                    const colours = CAT_COLOURS[cat] ?? CAT_COLOURS.Other;
                                                    return (
                                                        <span
                                                            key={t}
                                                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colours.pill}`}
                                                        >
                                                            {t}
                                                        </span>
                                                    );
                                                })}
                                                {techs.length > 4 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-md text-[11px] font-semibold border border-gray-200 dark:border-gray-700">
                                                        +{techs.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            {/* meta */}
                                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {project.viewCount.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {project.readingTime} min read
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}