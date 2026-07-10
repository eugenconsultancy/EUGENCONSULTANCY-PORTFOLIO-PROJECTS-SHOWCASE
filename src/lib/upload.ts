import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveServiceImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "services");
    const filePath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    return `/uploads/services/${filename}`;
}

export async function deleteServiceImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;
    const filename = imageUrl.replace(/^\/uploads\/services\//, "");
    const filePath = path.join(process.cwd(), "public", "uploads", "services", filename);
    try {
        await unlink(filePath);
    } catch {
        // ignore if file doesn't exist
    }
}