import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const reactions = await db.reaction.groupBy({
    by: ["emoji"],
    where: { projectId },
    _count: { emoji: true },
  });

  const counts: Record<string, number> = {};
  reactions.forEach((r: { emoji: string; _count: { emoji: number } }) => {
    counts[r.emoji] = r._count.emoji;
  });
  return NextResponse.json({ counts });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = parseInt(params.id, 10);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const body = await req.json();
  const { emoji } = body;
  if (!emoji) {
    return NextResponse.json({ error: "Emoji required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             "127.0.0.1";

  try {
    await db.reaction.create({
      data: { projectId, ip, emoji },
    });
  } catch {
    // duplicate – ignore
  }

  const reactions = await db.reaction.groupBy({
    by: ["emoji"],
    where: { projectId },
    _count: { emoji: true },
  });

  const counts: Record<string, number> = {};
  reactions.forEach((r: { emoji: string; _count: { emoji: number } }) => {
    counts[r.emoji] = r._count.emoji;
  });
  return NextResponse.json({ counts });
}
