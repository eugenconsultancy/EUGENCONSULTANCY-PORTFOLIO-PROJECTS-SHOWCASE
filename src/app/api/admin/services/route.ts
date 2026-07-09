import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await db.service.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: {
            inquiries: true,
            testimonials: true,
          },
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/admin/services Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch services";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Log incoming request for debugging (truncated for security)
    console.log("POST /api/admin/services - Creating service:", {
      title: body.title,
      slug: body.slug,
      category: body.category,
      status: body.status,
    });

    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Ensure JSON fields are strings
    const features = typeof body.features === "string" ? body.features : JSON.stringify(body.features || []);
    const tools = typeof body.tools === "string" ? body.tools : JSON.stringify(body.tools || []);
    const benefits = typeof body.benefits === "string" ? body.benefits : JSON.stringify(body.benefits || []);
    const process = typeof body.process === "string" ? body.process : JSON.stringify(body.process || []);
    const pricing = body.pricing
      ? typeof body.pricing === "string"
        ? body.pricing
        : JSON.stringify(body.pricing)
      : null;

    const service = await db.service.create({
      data: {
        title: body.title.trim(),
        slug: body.slug.trim().toLowerCase(),
        category: body.category || "Other",
        summary: body.summary || "",
        description: body.description || "",
        icon: body.icon || "📦",
        features,
        tools,
        benefits,
        process,
        pricing,
        status: body.status || "DRAFT",
        displayOrder: parseInt(String(body.displayOrder)) || 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/services Error:", error);

    // Handle Prisma unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : "Failed to create service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}