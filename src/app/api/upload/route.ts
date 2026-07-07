import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob – 'access: public' makes the image directly viewable
    const blob = await put(file.name, file, { access: "public" });

    // If a projectId was passed, associate the image with the project
    let imgProjectId: number | null = null;
    if (projectId) {
        imgProjectId = parseInt(projectId, 10);
    }

    const image = await db.projectImage.create({
        data: {
            projectId: imgProjectId,
            filename: blob.url,   // store the full URL, not just the filename
            alt: alt || file.name,
        },
    });

    return NextResponse.json({
        id: image.id,
        filename: blob.url,
        url: blob.url,
    });
}