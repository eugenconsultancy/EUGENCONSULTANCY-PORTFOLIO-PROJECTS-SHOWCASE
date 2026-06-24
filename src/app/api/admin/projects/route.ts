import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.project.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, title: true, slug: true, status: true, displayOrder: true },
  });
  return NextResponse.json(projects);
}
