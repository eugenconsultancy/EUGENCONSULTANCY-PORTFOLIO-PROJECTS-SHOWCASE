"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readingTime } from "@/lib/seo";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import path from "path";

export async function createDraftProject() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const token = uuidv4();
  const defaultSlug = `draft-${Date.now()}`;
  const project = await db.project.create({
    data: {
      title: "Untitled",
      slug: defaultSlug,
      summary: "",
      body: "",
      techStack: "",
      status: "DRAFT",
      previewToken: token,
    },
  });

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${project.slug}`);
}

export async function updateProject(slug: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse({
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary,
    body: raw.body,
    techStack: raw.techStack,
    dependencies: raw.dependencies,
    liveUrl: raw.liveUrl,
    githubUrl: raw.githubUrl,
    status: raw.status,
    displayOrder: raw.displayOrder ? parseInt(raw.displayOrder as string) : undefined,
    problem: raw.problem,
    approach: raw.approach,
    result: raw.result,
    metrics: raw.metrics,
    beforeImageId: raw.beforeImageId ? parseInt(raw.beforeImageId as string) : undefined,
    afterImageId: raw.afterImageId ? parseInt(raw.afterImageId as string) : undefined,
    frameworkRationale: raw.frameworkRationale,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  await db.project.update({
    where: { slug },
    data: parsed.data,
  });

  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await db.project.delete({ where: { slug } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectByForm(formData: FormData) {
  const slug = formData.get("slug") as string;
  if (!slug) throw new Error("Slug is required");
  await deleteProject(slug);
}

export async function getPublishedProjects() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    include: { images: true },
  });
  return projects.map((project) => ({
    ...project,
    readingTime: readingTime(project.body),
  }));
}

export async function getProjectDetail(slug: string) {
  const project = await db.project.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { images: true },
  });
  if (!project) return null;
  return {
    ...project,
    readingTime: readingTime(project.body),
  };
}

export async function incrementProjectView(slug: string) {
  if (!slug) return;
  await db.project.updateMany({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
}

export async function generatePreviewToken(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const token = uuidv4();
  await db.project.update({ where: { slug }, data: { previewToken: token } });
  revalidatePath("/admin/projects");
  return token;
}

export async function getProjectByPreview(slug: string, token: string) {
  const project = await db.project.findUnique({
    where: { slug },
    include: {
      images: true,
      beforeImage: { select: { filename: true } },
      afterImage: { select: { filename: true } },
    },
  });
  if (!project) return null;
  if (project.status === "PUBLISHED") return project;
  if (project.previewToken === token) return project;
  return null;
}

export async function recordProjectClick(projectId: number, linkType: string) {
  await db.projectClick.create({ data: { projectId, linkType } });
}

export async function updateProjectsOrder(slugs: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  for (let i = 0; i < slugs.length; i++) {
    await db.project.update({ where: { slug: slugs[i] }, data: { displayOrder: i } });
  }
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectImage(imageId: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const image = await db.projectImage.findUnique({ where: { id: imageId } });
  if (!image) throw new Error("Image not found");

  const filePath = path.join(process.cwd(), "public", "uploads", "projects", image.filename);
  try {
    await unlink(filePath);
  } catch (err) {}

  await db.projectImage.delete({ where: { id: imageId } });
  revalidatePath("/admin/projects/[slug]");
  return { success: true };
}
