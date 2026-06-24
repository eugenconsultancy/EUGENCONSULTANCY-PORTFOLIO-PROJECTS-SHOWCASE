"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema, experienceSchema, certificationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse({
    name: raw.name,
    bio: raw.bio,
    status: raw.status,
    skills: raw.skills,
    certifications: raw.certifications,
    availability: raw.availability,
    website: raw.website,
    github: raw.github,
    linkedin: raw.linkedin,
    twitter: raw.twitter,
    radarJson: raw.radarJson,
  });

  if (!parsed.success) throw new Error(parsed.error.message);

  const existing = await db.profile.findFirst();

  if (existing) {
    await db.profile.update({ where: { id: existing.id }, data: parsed.data });
  } else {
    await db.profile.create({ data: parsed.data });
  }

  // Picture
  const pictureFile = formData.get("picture") as File | null;
  if (pictureFile && pictureFile.size > 0) {
    const bytes = await pictureFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = pictureFile.name.split(".").pop() || "jpg";
    const filename = `avatar-${Date.now()}.${ext}`;
    const avatarDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!existsSync(avatarDir)) mkdirSync(avatarDir, { recursive: true });
    await writeFile(path.join(avatarDir, filename), buffer);
    const picturePath = `/uploads/avatars/${filename}`;
    await db.profile.update({
      where: { id: existing?.id ?? (await db.profile.findFirst())?.id ?? 1 },
      data: { picture: picturePath },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/");
}

export async function addExperience(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const profile = await db.profile.findFirst();
  if (!profile) throw new Error("Profile not set up");

  const raw = Object.fromEntries(formData.entries());
  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.message);

  await db.experience.create({
    data: { ...parsed.data, profileId: profile.id },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function deleteExperience(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  await db.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function addCertification(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const profile = await db.profile.findFirst();
  if (!profile) throw new Error("Profile not set up");

  const raw = Object.fromEntries(formData.entries());
  const parsed = certificationSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.message);

  // handle logo upload
  let logoPath = "";
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = logoFile.name.split(".").pop() || "png";
    const filename = `cert-${Date.now()}.${ext}`;
    const certDir = path.join(process.cwd(), "public", "uploads", "certifications");
    if (!existsSync(certDir)) mkdirSync(certDir, { recursive: true });
    await writeFile(path.join(certDir, filename), buffer);
    logoPath = `/uploads/certifications/${filename}`;
  }

  await db.certification.create({
    data: { ...parsed.data, profileId: profile.id, logo: logoPath || null },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function deleteCertification(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  await db.certification.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}