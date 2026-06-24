"use client";

import { useState, useRef } from "react";
import { submitContactForm } from "@/lib/actions/inquiries";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Send,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Zap,
  CheckCircle,
  Loader2,
  ChevronDown,
  Globe,
  Code2,
  Layers,
  Cloud,
  Palette,
  BarChart3,
} from "lucide-react";

type Props = {
  num1: number;
  num2: number;
  token: string;
};

const services = [
  "Website Development",
  "Portfolio Website",
  "Business Website",
  "E-Commerce Solution",
  "Consultancy Services",
  "System Development",
  "UI/UX Design",
  "Cloud Deployment",
  "Other",
];

const budgetRanges = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000+",
  "Let's Discuss",
];

const benefits = [
  { icon: <Code2 size={16} />, text: "Full-Stack Expertise" },
  { icon: <Palette size={16} />, text: "Modern UI/UX Design" },
  { icon: <Cloud size={16} />, text: "Cloud Deployment" },
  { icon: <Layers size={16} />, text: "Scalable Solutions" },
  { icon: <Globe size={16} />, text: "Global Delivery" },
  { icon: <BarChart3 size={16} />, text: "Ongoing Support" },
];

export function ContactForm({ num1, num2, token }: Props) {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageLen, setMessageLen] = useState(0);
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
      setSubmitted(true);
      setTimeout(() => router.push("/"), 4000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Inquiry Submitted!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
            Thank you for reaching out. I'll review your message and respond
            within <span className="font-semibold text-blue-600 dark:text-blue-400">24–48 hours</span>.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Redirecting you to the homepage…</p>
          <div className="mt-6 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-[grow_4s_linear_forwards]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <MessageCircle size={15} />
            <span>CONTACT EUGENCONSULTANCY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Let's Discuss{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Project
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Available for consultancy, web development, system architecture,
            and digital solutions. Let's build something remarkable together.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Form (left, wider) ── */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-black/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Send size={18} className="text-blue-600" />
                Send an Inquiry
              </h2>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Service + Budget row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Service Needed
                    </label>
                    <div className="relative">
                      <select
                        name="service"
                        required
                        defaultValue=""
                        className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select a service…</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <select
                        name="budget"
                        defaultValue=""
                        className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select a range…</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Brief project title or topic"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Message + counter */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Message
                    </label>
                    <span className={`text-xs tabular-nums transition-colors ${messageLen > 900 ? "text-amber-500" : "text-gray-400 dark:text-gray-600"}`}>
                      {messageLen} / 1000
                    </span>
                  </div>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    maxLength={1000}
                    placeholder="Describe your project, goals, and any specific requirements…"
                    onChange={(e) => setMessageLen(e.target.value.length)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Spam check */}
                <div className="rounded-2xl border border-dashed border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle size={13} />
                    Security Check
                  </p>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What is{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{num1}</span>
                    {" "}+{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{num2}</span>?
                  </label>
                  <input
                    type="number"
                    name="answer"
                    required
                    placeholder="Enter the sum"
                    className="w-full sm:w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Honeypot */}
                <div style={{ position: "absolute", left: "-9999px" }}>
                  <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] hover:scale-[1.01] shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Inquiry…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Request Consultation
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Benefits card */}
            <div className="rounded-3xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                Why Work With Me?
              </h3>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b.text} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-500/30">
                      {b.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info card */}
            <div className="rounded-3xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                Contact Details
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                    <a href="mailto:hello@eugenconsultancy.com" className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      hello@eugenconsultancy.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Location</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nairobi, Kenya</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Availability</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Mon – Fri, 8 AM – 6 PM EAT</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Response Time</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Within 24 hours</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Availability badge */}
            <div className="rounded-3xl border border-green-200 dark:border-green-900/50 bg-green-50/80 dark:bg-green-950/30 backdrop-blur-xl p-5 flex items-center gap-4">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Available for Projects</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Open for freelance & consultancy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}