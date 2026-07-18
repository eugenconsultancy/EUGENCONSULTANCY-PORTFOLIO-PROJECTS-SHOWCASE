import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);
  const body = await req.json();
  const cert = await db.certification.update({
    where: { id },
    data: {
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id);
  await db.certification.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
