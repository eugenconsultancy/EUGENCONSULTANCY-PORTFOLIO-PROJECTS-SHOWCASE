// src/app/(public)/services/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServicePageClient from "./ServicePageClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await db.service.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });
  return {
    title: service ? `${service.title} — Eugen Consultancy` : "Service Not Found",
    description: service?.summary || "",
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await db.service.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      testimonials: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!service) notFound();

  // Safe JSON parse
  const safeParse = (str: string, fallback: any = []) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  const serviceMeta = {
    id: service.id,
    slug: service.slug,
    name: service.title,
    tagline: service.summary,
    description: service.description,
    icon: service.icon,
    image: service.image,   // ✅ Pass image URL
  };

  const features = safeParse(service.features, []);
  const benefitsRaw = safeParse(service.benefits, []);
  const process = safeParse(service.process, []);
  const pricing = service.pricing ? safeParse(service.pricing, []) : [];

  const benefits = Array.isArray(benefitsRaw) && benefitsRaw.length > 0 && typeof benefitsRaw[0] === "string"
    ? [{ title: "Key Benefits", items: benefitsRaw }]
    : benefitsRaw;

  // testimonials are no longer used by the new client component, so we can remove them
  // const testimonials = service.testimonials.map(...)  <-- removed

  return (
    <ServicePageClient
      service={serviceMeta}
      features={features}
      benefits={benefits}
      process={process}
      techStack={{}}
      pricing={pricing}
      faq={[]}
    />
  );
}