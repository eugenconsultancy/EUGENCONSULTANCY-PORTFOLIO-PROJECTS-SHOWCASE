"use client";

import { useState, useRef } from "react";
import { submitContactForm } from "@/lib/actions/inquiries";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  num1: number;
  num2: number;
  token: string;
};

export function ContactForm({ num1, num2, token }: Props) {
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loadTimestamp] = useState(() => Date.now().toString());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    formData.append("ip", "client");
    formData.append("timestamp", loadTimestamp);
    formData.append("num1", num1.toString());
    formData.append("num2", num2.toString());
    formData.append("token", token);

    try {
      await submitContactForm(formData);
      toast.success("Message sent! Redirecting to homepage…");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" name="name" required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" name="email" required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input type="text" name="subject" required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea name="message" rows={5} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          What is {num1} + {num2}? (Spam check)
        </label>
        <input type="number" name="answer" required className="w-full border p-2 rounded" placeholder="Enter the sum" />
      </div>

      <div style={{ position: "absolute", left: "-9999px" }}>
        <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
