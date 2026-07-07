export const dynamic = "force-dynamic";
import { db } from "@/lib/db";

export async function GET() {
  const projects = await db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const feedItems = projects
    .map(
      (project) => `
    <item>
      <title>${escapeXml(project.title)}</title>
      <link>${baseUrl}/projects/${project.slug}</link>
      <description>${escapeXml(project.summary)}</description>
      <pubDate>${project.createdAt.toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/projects/${project.slug}</guid>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Developer Portfolio Projects</title>
    <link>${baseUrl}</link>
    <description>Latest published projects from my portfolio</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
