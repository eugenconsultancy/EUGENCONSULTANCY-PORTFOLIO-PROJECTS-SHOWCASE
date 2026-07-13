// src/lib/upload.ts
import { put, del } from "@vercel/blob";

/**
 * Uploads a service image to Vercel Blob and returns the public URL.
 */
export async function saveServiceImage(file: File): Promise<string> {
    const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true, // Prevents overwrites
    });
    return blob.url;
}

/**
 * Deletes a service image from Vercel Blob.
 */
export async function deleteServiceImage(url: string): Promise<void> {
    if (!url) return;
    try {
        await del(url);
    } catch {
        // Ignore if file is already gone or URL invalid
    }
}