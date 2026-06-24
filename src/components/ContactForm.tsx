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
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      toast.success("Message received!");
      // Keep success state inside form; no auto‑redirect
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-green-200 dark:border-green-800 bg-green-50/80 dark:bg-green-950/30 backdrop-blur-md p-8 md:p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Message Sent</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Thank you! I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Back to Homepage
        </button>
      </div>
    );
  }

  // Floating label style utility
  const inputClass = `
    peer w-full rounded-xl border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    px-4 pt-5 pb-2
    text-gray-800 dark:text-gray-100
    shadow-sm
    transition-all duration-300
    focus:border-blue-500 dark:focus:border-blue-400
    focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50
    focus:outline-none
    placeholder-transparent
  `;

  const labelClass = `
    absolute left-4 top-3 text-gray-500 dark:text-gray-400
    transition-all duration-200 ease-in-out
    pointer-events-none
    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
    peer-focus:-top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
    peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:text-xs
    bg-white dark:bg-gray-800 px-1
  `;

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Soft background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl opacity-[0.04] dark:opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle at top left, #6366f1 0%, transparent 60%), radial-gradient(circle at bottom right, #a78bfa 0%, transparent 60%)",
        }}
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 md:p-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
            Contact
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Get In Touch
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
            Have a project, question, or collaboration in mind?
            Send a message and I'll get back to you shortly.
          </p>
        </div>

        {/* Two‑column row */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              placeholder=" "
              className={inputClass}
            />
            <label className={labelClass}>Name</label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder=" "
              className={inputClass}
            />
            <label className={labelClass}>Email</label>
          </div>
        </div>

        {/* Subject */}
        <div className="relative">
          <input
            type="text"
            name="subject"
            required
            placeholder=" "
            className={inputClass}
          />
          <label className={labelClass}>Subject</label>
        </div>

        {/* Message */}
        <div className="relative">
          <textarea
            name="message"
            rows={6}
            required
            placeholder=" "
            className={`${inputClass} min-h-[180px] resize-none`}
          />
          <label className={labelClass}>Message</label>
        </div>

        {/* Math challenge */}
        <div className="relative">
          <input
            type="number"
            name="answer"
            required
            placeholder=" "
            className={inputClass}
          />
          <label className={labelClass}>
            What is {num1} + {num2}? (Spam check)
          </label>
        </div>

        {/* Honeypot */}
        <div style={{ position: "absolute", left: "-9999px" }}>
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {sending ? (
            <span className="inline-flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending…
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
