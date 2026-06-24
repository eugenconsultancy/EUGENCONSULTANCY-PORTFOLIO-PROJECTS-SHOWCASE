/**
 * Return estimated reading time in minutes.
 * Assumes average 200 words per minute.
 */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Homepage Person schema */
export function personJsonLd(profile: {
  name: string;
  bio: string;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  picture?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    description: profile.bio,
    url: profile.website || undefined,
    sameAs: [
      profile.github,
      profile.linkedin,
      profile.twitter,
    ].filter(Boolean),
    image: profile.picture || undefined,
  };
}

/** Project CreativeWork schema */
export function projectJsonLd(project: {
  title: string;
  summary: string;
  slug: string;
  createdAt: Date;
  images: { filename: string }[];
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${baseUrl}/projects/${project.slug}`,
    datePublished: project.createdAt.toISOString(),
    image: project.images.length > 0
      ? `${baseUrl}/uploads/projects/${project.images[0].filename}`
      : undefined,
  };
}
