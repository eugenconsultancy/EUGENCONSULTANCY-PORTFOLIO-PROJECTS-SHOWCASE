// Minimal type so we don't depend on Prisma client types being generated
type ImageData = {
    id: number;
    filename: string;
    alt: string | null;
};

export function processMarkdownImages(
    markdown: string,
    images: ImageData[]
): string {
    return markdown.replace(/\[img:(\d+)\]/g, (match, id) => {
        const img = images.find((img) => img.id === parseInt(id));
        if (img) {
            return `![${img.alt || "image"}](${img.filename})`;
        }
        // If image not found, return original shortcode as fallback
        return match;
    });
}