import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single service by slug (public)
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const service = await db.service.findUnique({
            where: { slug, status: "PUBLISHED" },
            include: {
                testimonials: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        clientName: true,
                        company: true,
                        quote: true,
                        rating: true,
                    },
                },
            },
        });

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
    }
}

// POST submit inquiry for a service (public)
export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;
        const service = await db.service.findUnique({ where: { slug } });

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const body = await request.json();
        const inquiry = await db.serviceInquiry.create({
            data: {
                serviceId: service.id,
                name: body.name,
                email: body.email,
                company: body.company || null,
                message: body.message,
                budget: body.budget || null,
                timeline: body.timeline || null,
            },
        });

        return NextResponse.json({ success: true, message: "Inquiry submitted successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}