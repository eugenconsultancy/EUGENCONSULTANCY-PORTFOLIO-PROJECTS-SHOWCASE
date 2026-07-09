import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET all services
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const services = await db.service.findMany({
        orderBy: { displayOrder: "asc" },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            status: true,
            displayOrder: true,
            createdAt: true,
        },
    });
    return NextResponse.json(services);
}

// POST create new service
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const service = await db.service.create({
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category,
                summary: body.summary,
                description: body.description,
                icon: body.icon,
                features: JSON.stringify(body.features),
                tools: JSON.stringify(body.tools),
                benefits: JSON.stringify(body.benefits),
                process: JSON.stringify(body.process),
                pricing: body.pricing ? JSON.stringify(body.pricing) : null,
                status: body.status || "DRAFT",
                displayOrder: body.displayOrder || 0,
            },
        });
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}