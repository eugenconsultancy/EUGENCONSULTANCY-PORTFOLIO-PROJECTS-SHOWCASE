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
    const files = formData.getAll("files") as File[];
    const projectId = formData.get("projectId") as string | null;
    const alt = (formData.get("alt") as string) || "";

    if (files.length === 0) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
        // ✅ Prevent overwrite conflicts by generating a unique pathname
        const blob = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true, // Appends a random string to the filename
        });

        let imgProjectId: number | null = null;
        if (projectId) {
            imgProjectId = parseInt(projectId, 10);
        }

        const image = await db.projectImage.create({
            data: {
                projectId: imgProjectId,
                filename: blob.url, // Stores the full public URL
                alt: alt || file.name,
            },
        });

        uploadedImages.push({
            id: image.id,
            filename: blob.url,
            url: blob.url,
        });
    }

    return NextResponse.json(uploadedImages);
}