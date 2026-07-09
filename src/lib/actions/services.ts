"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── Create Service ──────────────────────────────────
export async function createService(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const raw = Object.fromEntries(formData.entries());

    const service = await db.service.create({
        data: {
            title: raw.title as string,
            slug: raw.slug as string,
            category: raw.category as string,
            summary: raw.summary as string,
            description: raw.description as string,
            icon: raw.icon as string,
            features: raw.features as string,
            tools: raw.tools as string,
            benefits: raw.benefits as string,
            process: raw.process as string,
            pricing: (raw.pricing as string) || null,
            status: (raw.status as string) || "DRAFT",
            displayOrder: parseInt(raw.displayOrder as string) || 0,
        },
    });

    revalidatePath("/admin/services");
    redirect("/admin/services");
}

// ─── Update Service ──────────────────────────────────
export async function updateService(id: number, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const raw = Object.fromEntries(formData.entries());

    await db.service.update({
        where: { id },
        data: {
            title: raw.title as string,
            slug: raw.slug as string,
            category: raw.category as string,
            summary: raw.summary as string,
            description: raw.description as string,
            icon: raw.icon as string,
            features: raw.features as string,
            tools: raw.tools as string,
            benefits: raw.benefits as string,
            process: raw.process as string,
            pricing: (raw.pricing as string) || null,
            status: raw.status as string,
            displayOrder: parseInt(raw.displayOrder as string) || 0,
        },
    });

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    redirect("/admin/services");
}

// ─── Delete Service ──────────────────────────────────
export async function deleteService(id: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await db.service.delete({
        where: { id },
    });

    revalidatePath("/admin/services");
    redirect("/admin/services");
}

// ─── Toggle Service Status ───────────────────────────
export async function toggleServiceStatus(id: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const service = await db.service.findUnique({
        where: { id },
        select: { status: true },
    });

    if (!service) throw new Error("Service not found");

    const newStatus = service.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    await db.service.update({
        where: { id },
        data: { status: newStatus },
    });

    revalidatePath("/admin/services");
    return { success: true, newStatus };
}

// ─── Update Services Order ───────────────────────────
export async function updateServicesOrder(ids: number[]) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    for (let i = 0; i < ids.length; i++) {
        await db.service.update({
            where: { id: ids[i] },
            data: { displayOrder: i },
        });
    }

    revalidatePath("/admin/services");
    redirect("/admin/services");
}

// ─── Get All Services (for admin) ────────────────────
export async function getAdminServices() {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

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

    return services;
}

// ─── Get Service by ID (for admin edit) ──────────────
export async function getAdminService(id: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const service = await db.service.findUnique({
        where: { id },
        include: {
            inquiries: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            testimonials: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!service) throw new Error("Service not found");

    return service;
}

// ─── Mark Inquiry as Read ────────────────────────────
export async function markInquiryRead(inquiryId: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await db.serviceInquiry.update({
        where: { id: inquiryId },
        data: { isRead: true },
    });

    revalidatePath("/admin/services");
    return { success: true };
}

// ─── Delete Inquiry ──────────────────────────────────
export async function deleteInquiry(inquiryId: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await db.serviceInquiry.delete({
        where: { id: inquiryId },
    });

    revalidatePath("/admin/services");
    return { success: true };
}

// ─── Add Testimonial ─────────────────────────────────
export async function addServiceTestimonial(
    serviceId: number,
    data: {
        clientName: string;
        company?: string;
        quote: string;
        rating: number;
    }
) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await db.serviceTestimonial.create({
        data: {
            serviceId,
            clientName: data.clientName,
            company: data.company || null,
            quote: data.quote,
            rating: data.rating,
        },
    });

    revalidatePath(`/admin/services/${serviceId}`);
    return { success: true };
}

// ─── Delete Testimonial ──────────────────────────────
export async function deleteServiceTestimonial(testimonialId: number) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await db.serviceTestimonial.delete({
        where: { id: testimonialId },
    });

    revalidatePath("/admin/services");
    return { success: true };
}

// ─── Get Service Statistics ──────────────────────────
export async function getServiceStats() {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const [
        totalServices,
        publishedServices,
        totalInquiries,
        unreadInquiries,
        totalTestimonials,
    ] = await Promise.all([
        db.service.count(),
        db.service.count({ where: { status: "PUBLISHED" } }),
        db.serviceInquiry.count(),
        db.serviceInquiry.count({ where: { isRead: false } }),
        db.serviceTestimonial.count(),
    ]);

    return {
        totalServices,
        publishedServices,
        totalInquiries,
        unreadInquiries,
        totalTestimonials,
    };
}