// src/app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveServiceImage } from "@/lib/upload";

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
          select: { inquiries: true, testimonials: true },
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/admin/services Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const summary = formData.get("summary") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const features = formData.get("features") as string;
    const tools = formData.get("tools") as string;
    const benefits = formData.get("benefits") as string;
    const process = formData.get("process") as string;
    const pricing = formData.get("pricing") as string | null;
    const status = (formData.get("status") as string) || "DRAFT";
    const displayOrder = parseInt((formData.get("displayOrder") as string) || "0", 10);

    // Image file
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveServiceImage(imageFile);
    }

    // Validate required
    if (!title?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const service = await db.service.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        category: category || "Other",
        summary: summary || "",
        description: description || "",
        icon: icon || "📦",
        image: imageUrl,
        features: features || "[]",
        tools: tools || "[]",
        benefits: benefits || "[]",
        process: process || "[]",
        pricing: pricing || null,
        status,
        displayOrder,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/services Error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}