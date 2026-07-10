// app/api/projects/[id]/reactions/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ────────────────────────────────────────────────
// GET: Fetch reaction COUNTS for a project
// ────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  // Group reactions by emoji and count them
  const reactionGroups = await db.reaction.groupBy({
    by: ["emoji"],
    where: { projectId },
    _count: true,
  });

  // Build the counts object that the frontend expects
  const counts: Record<string, number> = {};
  reactionGroups.forEach((group) => {
    counts[group.emoji] = group._count;
  });

  return NextResponse.json({ counts });
}

// ────────────────────────────────────────────────
// POST: Toggle a reaction (unchanged)
// ────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  const body = await req.json();
  const { emoji } = body;

  if (!emoji) {
    return NextResponse.json({ error: "Missing emoji" }, { status: 400 });
  }

  const existing = await db.reaction.findFirst({
    where: { projectId, ip, emoji },
  });

  if (existing) {
    await db.reaction.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Reaction removed" });
  } else {
    const reaction = await db.reaction.create({
      data: { projectId, ip, emoji },
    });
    return NextResponse.json(reaction, { status: 201 });
  }
}