"use server";

import { db } from "@/lib/db";
import { commentSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateSpam, validateMathChallenge } from "@/lib/spam";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function submitComment(formData: FormData) {
    const ip = formData.get("ip") as string || "unknown";

    // Rate limit: max 5 comments per hour per IP
    const { allowed } = checkRateLimit(`comment:${ip}`, 5);
    if (!allowed) {
        throw new Error("Too many comments. Please try again later.");
    }

    // Honeypot + timestamp spam check
    const spamError = validateSpam(formData);
    if (spamError) {
        throw new Error(spamError);
    }

    // Math challenge validation
    const num1 = parseInt(formData.get("num1") as string, 10);
    const num2 = parseInt(formData.get("num2") as string, 10);
    const userAnswer = formData.get("answer") as string;
    const token = formData.get("token") as string;

    if (!validateMathChallenge(num1, num2, userAnswer, token)) {
        throw new Error("Incorrect math answer. Please try again.");
    }

    const raw = Object.fromEntries(formData.entries());
    const parsed = commentSchema.safeParse({
        projectId: parseInt(raw.projectId as string),
        parentId: raw.parentId ? parseInt(raw.parentId as string) : null,
        name: raw.name,
        content: raw.content,
        honeypot: raw.honeypot,
        timestamp: raw.timestamp,
    });

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }

    await db.comment.create({
        data: {
            projectId: parsed.data.projectId,
            parentId: parsed.data.parentId ?? null,
            name: parsed.data.name,
            content: parsed.data.content,
            status: "PENDING",
        },
    });

    revalidatePath("/projects/[slug]");
    revalidatePath("/projects");
}

export async function moderateComments(
    commentIds: number[],
    action: "APPROVE" | "SPAM" | "DELETE"
) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    if (action === "DELETE") {
        await db.comment.deleteMany({ where: { id: { in: commentIds } } });
    } else {
        await db.comment.updateMany({
            where: { id: { in: commentIds } },
            data: { status: action === "APPROVE" ? "APPROVED" : "SPAM" },
        });
    }
    revalidatePath("/admin/comments");
}