"use server";

import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateSpam, validateMathChallenge } from "@/lib/spam";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNewInquiryEmail } from "@/lib/email";

export async function submitContactForm(formData: FormData) {
  const ip = formData.get("ip") as string || "unknown";
  const { allowed } = checkRateLimit(`contact:${ip}`, 3);
  if (!allowed) throw new Error("Too many submissions. Please try again later.");

  const spamError = validateSpam(formData);
  if (spamError) throw new Error(spamError);

  const num1 = parseInt(formData.get("num1") as string, 10);
  const num2 = parseInt(formData.get("num2") as string, 10);
  const userAnswer = formData.get("answer") as string;
  const token = formData.get("token") as string;
  if (!validateMathChallenge(num1, num2, userAnswer, token)) {
    throw new Error("Incorrect math answer. Please try again.");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse({
    name: raw.name,
    email: raw.email,
    subject: raw.subject,
    message: raw.message,
    honeypot: raw.honeypot,
    timestamp: raw.timestamp,
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const inquiry = await db.inquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  // Send email notification (fire-and-forget – won't block the user)
  sendNewInquiryEmail(parsed.data).catch(console.error);

  revalidatePath("/contact");
}

export async function markInquiryRead(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  await db.inquiry.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(id: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  await db.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
}
