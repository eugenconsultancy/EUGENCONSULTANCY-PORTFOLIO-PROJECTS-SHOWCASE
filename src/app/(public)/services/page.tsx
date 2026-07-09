export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { ServicesClient } from "@/components/ServicesClient";

export const metadata: Metadata = {
    title: "Services — Data Analytics, SEO, Security & Content",
    description: "Professional SPSS data analysis, white-hat SEO, penetration testing, and blogging services. Transform your business with expert consulting.",
};

export default async function ServicesPage() {
    const services = await db.service.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { displayOrder: "asc" },
    });

    return <ServicesClient services={services} />;
}