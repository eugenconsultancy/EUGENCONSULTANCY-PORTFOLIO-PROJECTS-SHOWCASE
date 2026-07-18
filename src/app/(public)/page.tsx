export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const profile = await db.profile.findFirst();

  const latestProjects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { images: true }, // include all images, not just main
    take: 6,
  });

  const featuredProjects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    include: { images: true }, // same here
    take: 10,
  });

  const experiences = profile
    ? (await db.experience.findMany({ where: { profileId: profile.id }, orderBy: { startDate: "desc" } })).map((exp) => ({
        id: exp.id,
        role: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      }))
    : [];

  const dbCerts = await db.certification.findMany({
    orderBy: { date: "desc" },
  });

  const certifications = dbCerts.map((c) => ({
    id: c.id,
    name: c.title,
    issuer: c.issuer,
    year: c.date ? parseInt(c.date.substring(0, 4)) : null,
    url: c.verificationUrl,
  }));

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Profile not configured yet.
      </div>
    );
  }

  return (
    <HomeClient
      profile={{
        id: profile.id,
        name: profile.name,
        bio: profile.bio,
        picture: profile.picture,
        status: profile.status,
        skills: profile.skills,
        certifications: profile.certifications,
        availability: profile.availability,
        website: profile.website,
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        radarJson: profile.radarJson,
      }}
      latestProjects={latestProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        techStack: p.techStack,
        viewCount: p.viewCount,
        readingTime: 5,
        images: p.images,
      }))}
      featuredProjects={featuredProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        techStack: p.techStack,
        viewCount: p.viewCount,
        readingTime: 5,
        images: p.images,
      }))}
      experiences={experiences}
      certifications={certifications}
    />
  );
}
