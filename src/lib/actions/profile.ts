"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema, experienceSchema, certificationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

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

  // Upload profile picture to Vercel Blob (if a new file was provided)
  const pictureFile = formData.get("picture") as File | null;
  if (pictureFile && pictureFile.size > 0) {
    const ext = pictureFile.name.split(".").pop() || "jpg";
    const blob = await put(`avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`, pictureFile, {
      access: "public",
    });

    // Update the profile with the new picture URL
    const profileId = existing?.id ?? (await db.profile.findFirst())?.id;
    if (profileId) {
      await db.profile.update({
        where: { id: profileId },
        data: { picture: blob.url },
      });
    }
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

  // Handle logo upload via Vercel Blob
  let logoUrl: string | null = null;
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop() || "png";
    const blob = await put(`certifications/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`, logoFile, {
      access: "public",
    });
    logoUrl = blob.url;
  }

  await db.certification.create({
    data: { ...parsed.data, profileId: profile.id, logo: logoUrl },
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