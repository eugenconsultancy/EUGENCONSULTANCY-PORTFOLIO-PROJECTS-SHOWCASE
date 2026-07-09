import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const services = await db.service.findMany({
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { inquiries: true, testimonials: true } } },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const service = await db.service.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category || "Other",
        summary: body.summary,
        description: body.description,
        icon: body.icon || "📦",
        features: body.features || "[]",
        tools: body.tools || "[]",
        benefits: body.benefits || "[]",
        process: body.process || "[]",
        pricing: body.pricing || null,
        status: body.status || "DRAFT",
        displayOrder: body.displayOrder || 0,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
