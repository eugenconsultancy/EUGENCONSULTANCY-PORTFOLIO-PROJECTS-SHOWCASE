import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET single service
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const service = await db.service.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
}

// PUT update service
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const service = await db.service.update({
            where: { id: parseInt(params.id) },
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
                status: body.status,
                displayOrder: body.displayOrder,
            },
        });
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

// DELETE service
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await db.service.delete({
            where: { id: parseInt(params.id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}