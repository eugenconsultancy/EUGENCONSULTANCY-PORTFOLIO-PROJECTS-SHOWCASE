// app/api/projects/[id]/reactions/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ────────────────────────────────────────────────
// GET: Fetch all reactions for a project
// ────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Optional: Protect this endpoint if you want
  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const reactions = await db.reaction.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    // ✅ No `include` needed – Reaction has no relations
  });

  return NextResponse.json(reactions);
}

// ────────────────────────────────────────────────
// POST: Toggle a reaction (like, bookmark, heart, etc.)
// ────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Optional admin check – remove if you want public reactions
  const session = await getServerSession(authOptions);
  // If you want to restrict reactions to logged-in admins only:
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  // ── Get the client's IP address ──
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  // ── Parse request body ──
  const body = await req.json();
  const { emoji } = body; // e.g., '❤️', '⭐', '🔥', '👍'

  if (!emoji) {
    return NextResponse.json(
      { error: "Missing emoji" },
      { status: 400 }
    );
  }

  // ── Check if this IP already reacted with this emoji ──
  const existing = await db.reaction.findFirst({
    where: {
      projectId,
      ip,
      emoji,
    },
  });

  if (existing) {
    // Toggle OFF: Delete the existing reaction
    await db.reaction.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Reaction removed" });
  } else {
    // Toggle ON: Create a new reaction
    const reaction = await db.reaction.create({
      data: {
        projectId,
        ip,
        emoji,
      },
    });
    return NextResponse.json(reaction, { status: 201 });
  }
}