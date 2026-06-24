import { createHmac } from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-change-me";

/** Generate a random math challenge and an HMAC token */
export function generateMathChallenge() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = (num1 + num2).toString();

    const token = createHmac("sha256", SECRET)
        .update(`${num1}+${num2}`)
        .digest("hex");

    return { num1, num2, token, answer };
}

/** Validate the user's answer and token integrity */
export function validateMathChallenge(
    num1: number,
    num2: number,
    userAnswer: string,
    token: string
): boolean {
    const expected = num1 + num2;
    if (parseInt(userAnswer, 10) !== expected) return false;

    const expectedToken = createHmac("sha256", SECRET)
        .update(`${num1}+${num2}`)
        .digest("hex");

    return token === expectedToken;
}

/** Original spam validation (honeypot + timestamp) */
export function validateSpam(formData: FormData): string | null {
    const honeypot = formData.get("honeypot") as string;
    if (honeypot && honeypot.length > 0) {
        return "Spam detected.";
    }

    const timestamp = parseInt(formData.get("timestamp") as string, 10);
    if (isNaN(timestamp)) {
        return "Missing timestamp.";
    }

    const now = Date.now();
    const minimumTimeMs = 3000; // 3 seconds
    if (now - timestamp < minimumTimeMs) {
        return "Submission too fast. Please wait a moment and try again.";
    }

    return null;
}