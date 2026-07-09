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

  const serviceMeta = {
    id: service.id,
    slug: service.slug,
    name: service.title,
    tagline: service.summary,
    description: service.description,
    icon: service.icon,
  };

  const features = JSON.parse(service.features);
  const benefits = JSON.parse(service.benefits);
  const process = JSON.parse(service.process);
  const pricing = service.pricing ? JSON.parse(service.pricing) : [];

  const testimonials = service.testimonials.map((t) => ({
    quote: t.quote,
    author: t.clientName,
    role: t.company || "Client",
  }));

  return (
    <ServicePageClient
      service={serviceMeta}
      features={features}
      benefits={benefits}
      process={process}
      techStack={{}}
      pricing={pricing}
      testimonials={testimonials}
      faq={[]}
    />
  );
}
