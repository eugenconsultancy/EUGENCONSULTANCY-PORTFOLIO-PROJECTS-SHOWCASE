import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceId = parseInt(params.id);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }

    const service = await db.service.findUnique({
      where: { id: serviceId },
      include: {
        inquiries: { orderBy: { createdAt: "desc" } },
        testimonials: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("GET /api/admin/services/[id] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceId = parseInt(params.id);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }

    const body = await request.json();

    // Log update request
    console.log("PUT /api/admin/services/[id] - Updating service:", {
      id: serviceId,
      title: body.title,
      slug: body.slug,
      status: body.status,
    });

    // Check if service exists
    const existing = await db.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
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

    const service = await db.service.update({
      where: { id: serviceId },
      data: {
        title: body.title?.trim() || existing.title,
        slug: body.slug?.trim()?.toLowerCase() || existing.slug,
        category: body.category || existing.category,
        summary: body.summary ?? existing.summary,
        description: body.description ?? existing.description,
        icon: body.icon || existing.icon,
        features,
        tools,
        benefits,
        process,
        pricing,
        status: body.status || existing.status,
        displayOrder: body.displayOrder !== undefined ? parseInt(String(body.displayOrder)) : existing.displayOrder,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("PUT /api/admin/services/[id] Error:", error);

    // Handle Prisma unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : "Failed to update service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceId = parseInt(params.id);
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }

    // Check if service exists
    const existing = await db.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete related records first
    await db.serviceTestimonial.deleteMany({ where: { serviceId } });
    await db.serviceInquiry.deleteMany({ where: { serviceId } });
    await db.service.delete({ where: { id: serviceId } });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/services/[id] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}