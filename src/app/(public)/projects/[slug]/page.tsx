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
import { ProjectLinks } from "@/components/ProjectLinks";
import { ImageCarousel } from "@/components/ImageCarousel";
import type { Metadata } from "next";

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
  frameworkRationale?: string | null;   // optional
  beforeImageId: number | null;
  afterImageId: number | null;
  beforeImage: { filename: string } | null;
  afterImage: { filename: string } | null;
  images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
  createdAt: Date;
  updatedAt: Date;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await db.project.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { title: true, summary: true, slug: true, images: { take: 1, select: { filename: true } } },
  });
  if (!project) return { title: "Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const imageUrl = project.images.length > 0
    ? `${baseUrl}/uploads/projects/${project.images[0].filename}`
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
    twitter: { card: "summary_large_image", title: project.title, description: project.summary, images: [imageUrl] },
  };
}

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
  const imageList = project.images.map(img => ({
    src: `/uploads/projects/${img.filename}`,
    alt: img.alt || img.filename,
  }));
  const readTime = readingTime(project.body);
  const jsonLd = project.status === "PUBLISHED" ? projectJsonLd({ ...project, images: project.images }) : null;
  const deps = project.dependencies
    ? project.dependencies.split("\n").map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <>
      <ReadingProgress />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
        {project.status === "DRAFT" && (
          <div className="bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-xl text-sm font-medium">
            Preview mode — this project is not yet published.
          </div>
        )}

        <div className="text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-3">
            EUGENCONSULTANCY PROJECTS PREVIEW
          </h2>
        </div>

        {imageList.length > 1 && <ImageCarousel images={imageList} />}

        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-3">Project</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{project.title}</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">{project.summary}</p>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
              <ViewCounter slug={project.slug} initialCount={project.viewCount} />
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400">{readTime} min read</span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <ReactionButtons projectId={project.id} />
              <div className="ml-auto"><ShareButton title={project.title} slug={project.slug} /></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.split(",").map((tech: string) => (
              <span key={tech.trim()} className="px-3 py-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">{tech.trim()}</span>
            ))}
          </div>
        </div>

        {deps.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dependencies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {deps.map((dep, idx) => {
                const colourClass = DEPENDENCY_COLOURS[idx % DEPENDENCY_COLOURS.length];
                return (
                  <div key={dep} className={`px-4 py-2.5 rounded-xl border ${colourClass} font-mono text-sm font-medium hover:scale-105 hover:shadow-md transition-all cursor-default`} title={dep}>{dep}</div>
                );
              })}
            </div>
          </div>
        )}

        {project.frameworkRationale && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Why This Stack?</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{project.frameworkRationale}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <article className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 md:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400">
              <ProjectImagesRenderer content={processedBody} images={imageList} />
            </div>
          </article>
          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <TableOfContents content={processedBody} />
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Project Links</h3>
                <div className="space-y-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:scale-105 transition-transform">Live Demo</a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">View GitHub</a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {(project.problem || project.approach || project.result) && (
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 md:p-10">
            <CaseStudySection
              problem={project.problem || ""}
              approach={project.approach || ""}
              result={project.result || ""}
              metrics={project.metrics || ""}
              beforeImage={project.beforeImage ? `/uploads/projects/${project.beforeImage.filename}` : undefined}
              afterImage={project.afterImage ? `/uploads/projects/${project.afterImage.filename}` : undefined}
            />
          </div>
        )}

        {project.status === "PUBLISHED" && (
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 md:p-10">
            <CommentSection projectId={project.id} />
          </div>
        )}
      </main>
    </>
  );
}
