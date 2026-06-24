import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uuidv4()}.${ext}`;

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "projects");
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    // Write the file
    await writeFile(path.join(uploadDir, filename), buffer);

    let imgProjectId: number | null = null;
    if (projectId) {
        imgProjectId = parseInt(projectId, 10);
    }

    const image = await db.projectImage.create({
        data: {
            projectId: imgProjectId,
            filename,
            alt: alt || file.name,
        },
    });

    return NextResponse.json({
        id: image.id,
        filename,
        url: `/uploads/projects/${filename}`,
    });
}