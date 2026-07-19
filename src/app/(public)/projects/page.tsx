import { db } from "@/lib/db";
import { readingTime } from "@/lib/seo";
import { ProjectsClient } from "./projects-client";
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

  return <ProjectsClient projects={projectsWithMeta} />;
}