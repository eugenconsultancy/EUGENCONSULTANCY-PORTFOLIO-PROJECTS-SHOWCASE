import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certs = await db.certification.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(certs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db.profile.findFirst();
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 400 });

  const body = await req.json();
  const cert = await db.certification.create({
    data: {
      profileId: profile.id,
      title: body.title,
      issuer: body.issuer,
      date: body.date,
      verificationUrl: body.verificationUrl || null,
      logo: body.logo || null,
      status: body.status || "Active",
    },
  });
  return NextResponse.json(cert);
}
