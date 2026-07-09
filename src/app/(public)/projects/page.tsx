import { db } from "@/lib/db";
import { readingTime } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Eugen Consultancy",
  description: "A selection of production-grade work — click to explore full case studies.",
};

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

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    include: { images: true },
  });

  const projectsWithMeta: ProjectWithMeta[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    techStack: p.techStack,
    viewCount: p.viewCount,
    readingTime: readingTime(p.body),
    images: p.images,
  }));

  // Extract all unique tech tags
  const allTags = [
    ...new Set(
      projectsWithMeta.flatMap((p) =>
        p.techStack.split(",").map((t) => t.trim()).filter(Boolean)
      )
    ),
  ].sort();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Header */}
      <section className="relative py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-3">
            Portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Projects
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-xl">
            A selection of production-grade work — click to explore full case studies.
          </p>
        </div>
      </section>

      {/* Tag Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {projectsWithMeta.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No projects published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsWithMeta.map((project) => {
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
                    className="group flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
                  >
                    {/* Thumbnail */}
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
                          <span className="text-5xl opacity-25">📦</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                          View Case Study →
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">
                        {project.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                        {project.summary}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {techs.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                        {techs.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg text-xs font-semibold">
                            +{techs.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          👁 {project.viewCount.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱ {project.readingTime} min read
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