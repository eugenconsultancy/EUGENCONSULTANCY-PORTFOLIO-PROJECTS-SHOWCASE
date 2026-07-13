import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all published services (public)
export async function GET() {
    try {
        const services = await db.service.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { displayOrder: "asc" },
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                summary: true,
                description: true,
                icon: true,
                image: true,        // ✅ ADDED
                features: true,
                tools: true,
                benefits: true,
                process: true,
                pricing: true,
                displayOrder: true,
            },
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}