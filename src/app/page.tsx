import { db } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const profile = await db.profile.findFirst();

  const latestProjects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      images: { where: { isMain: true } },
    },
  });

  const featuredProjects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 10,
    include: {
      images: { where: { isMain: true } },
    },
  });

  const experiences = await db.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  const dbCerts = await db.certification.findMany({
    orderBy: { date: "desc" },
  });

  // Map DB fields to the shape expected by HomeClient
  const certifications = dbCerts.map((c) => ({
    id: c.id,
    name: c.title,
    issuer: c.issuer,
    year: c.date ? parseInt(c.date.substring(0, 4)) : null,  // extract year as number
    url: c.verificationUrl,
  }));

  return (
    <HomeClient
      profile={{
        id: profile?.id ?? 0,
        name: profile?.name ?? "",
        bio: profile?.bio ?? "",
        picture: profile?.picture ?? null,
        status: profile?.status ?? null,
        skills: profile?.skills ?? null,
        certifications: profile?.certifications ?? null,
        availability: profile?.availability ?? null,
        website: profile?.website ?? null,
        github: profile?.github ?? null,
        linkedin: profile?.linkedin ?? null,
        twitter: profile?.twitter ?? null,
        radarJson: profile?.radarJson ?? null,
      }}
      latestProjects={latestProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        techStack: p.techStack,
        viewCount: p.viewCount,
        readingTime: 5, // placeholder; you can calculate from body length
        images: p.images.map((img) => ({
          id: img.id,
          filename: img.filename,
          alt: img.alt,
          isMain: img.isMain,
        })),
      }))}
      featuredProjects={featuredProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        techStack: p.techStack,
        viewCount: p.viewCount,
        readingTime: 5,
        images: p.images.map((img) => ({
          id: img.id,
          filename: img.filename,
          alt: img.alt,
          isMain: img.isMain,
        })),
      }))}
      experiences={experiences.map((e) => ({
        id: e.id,
        role: e.title,       // Experience.title maps to role
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
      }))}
      certifications={certifications}
    />
  );
}
