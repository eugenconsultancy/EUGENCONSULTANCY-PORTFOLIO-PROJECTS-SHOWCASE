import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveServiceImage, deleteServiceImage } from "@/lib/upload";

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
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
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

    const existing = await db.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // ✅ Parse multipart form data
    const formData = await request.formData();

    // Extract text fields
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
    const status = (formData.get("status") as string) || existing.status;
    const displayOrder = parseInt((formData.get("displayOrder") as string) || String(existing.displayOrder), 10);
    const removeImage = formData.get("removeImage") === "true";

    // ✅ Handle image file
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = existing.image;

    // If user explicitly wants to remove the image
    if (removeImage && existing.image) {
      await deleteServiceImage(existing.image);
      imageUrl = null;
    }

    // If a new image is uploaded, replace the old one
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existing.image) {
        await deleteServiceImage(existing.image);
      }
      imageUrl = await saveServiceImage(imageFile);
    }

    // Update service
    const service = await db.service.update({
      where: { id: serviceId },
      data: {
        title: title?.trim() || existing.title,
        slug: slug?.trim()?.toLowerCase() || existing.slug,
        category: category || existing.category,
        summary: summary ?? existing.summary,
        description: description ?? existing.description,
        icon: icon || existing.icon,
        image: imageUrl,
        features: features || existing.features,
        tools: tools || existing.tools,
        benefits: benefits || existing.benefits,
        process: process || existing.process,
        pricing: pricing ?? existing.pricing,
        status,
        displayOrder,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("PUT /api/admin/services/[id] Error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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

    const existing = await db.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete associated image if exists
    if (existing.image) {
      await deleteServiceImage(existing.image);
    }

    // Delete related records
    await db.serviceTestimonial.deleteMany({ where: { serviceId } });
    await db.serviceInquiry.deleteMany({ where: { serviceId } });
    await db.service.delete({ where: { id: serviceId } });

    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/services/[id] Error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}