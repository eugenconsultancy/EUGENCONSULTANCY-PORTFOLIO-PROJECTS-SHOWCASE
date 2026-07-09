export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { personJsonLd, readingTime } from "@/lib/seo";
import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await db.profile.findFirst();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("EUGEN CONSULTANCY")}&tech=`;
  return {
    title: "EUGEN CONSULTANCY — Full-Stack · Cloud · AI",
    description: profile?.bio?.slice(0, 160) || "Building intelligent digital solutions for businesses, institutions and startups.",
    alternates: { canonical: baseUrl },
    openGraph: {
      title: "EUGEN CONSULTANCY",
      description: profile?.bio?.slice(0, 160),
      url: baseUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "EUGEN CONSULTANCY",
      description: profile?.bio?.slice(0, 160),
      images: [ogImage],
    },
  };
}

export default async function HomePage() {
  // Core Profile
  const profile = await db.profile.findFirst();

  // Homepage Projects
  const latestProjects = (
    await db.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { images: true },
      take: 4,
    })
  ).map((p) => ({ ...p, readingTime: readingTime(p.body) }));

  const featuredProjects = (
    await db.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { displayOrder: "asc" },
      include: { images: true },
      take: 8,
    })
  ).map((p) => ({ ...p, readingTime: readingTime(p.body) }));

  // Professional Information
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

  const certifications = profile
    ? (await db.certification.findMany({ where: { profileId: profile.id } })).map((cert) => ({
      id: cert.id,
      name: cert.title,
      issuer: cert.issuer,
      year: cert.date ? parseInt(cert.date.match(/\d{4}/)?.[0] ?? "0") : null,
      url: cert.verificationUrl,
    }))
    : [];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Profile not configured yet.
      </div>
    );
  }

  const jsonLd = personJsonLd(profile);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClient
        profile={profile}
        latestProjects={latestProjects}
        featuredProjects={featuredProjects}
        experiences={experiences}
        certifications={certifications}
      />
    </>
  );
}