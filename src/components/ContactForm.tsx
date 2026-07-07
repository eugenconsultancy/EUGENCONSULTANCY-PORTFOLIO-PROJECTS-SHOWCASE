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
  Phone,
  CheckCircle,
  Loader2,
  ChevronDown,
  Globe,
  Code2,
  Layers,
  Cloud,
  Palette,
  BarChart3,
  ArrowRight,
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
  { icon: <Code2 size={15} />, text: "Full-Stack Expertise", gradient: "from-blue-500 to-blue-600" },
  { icon: <Palette size={15} />, text: "Modern UI/UX Design", gradient: "from-violet-500 to-violet-600" },
  { icon: <Cloud size={15} />, text: "Cloud Deployment", gradient: "from-cyan-500 to-blue-500" },
  { icon: <Layers size={15} />, text: "Scalable Architecture", gradient: "from-indigo-500 to-violet-600" },
  { icon: <Globe size={15} />, text: "Global Delivery", gradient: "from-emerald-500 to-teal-500" },
  { icon: <BarChart3 size={15} />, text: "Ongoing Support", gradient: "from-amber-500 to-orange-500" },
];

const contactInfo = [
  {
    icon: <Mail size={14} />,
    label: "Email",
    value: "eugenbku@gmail.com",
    href: "mailto:eugenbku@gmail.com",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: <Phone size={14} />,
    label: "Phone",
    value: "+254 108 038 898",
    href: "tel:+254108038898",
    bg: "bg-violet-50 dark:bg-violet-950/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: <MapPin size={14} />,
    label: "Location",
    value: "Nairobi, Kenya",
    href: null,
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: <Clock size={14} />,
    label: "Working Hours",
    value: "Mon – Fri, 8 AM – 6 PM EAT",
    href: null,
    bg: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: <Zap size={14} />,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
    bg: "bg-rose-50 dark:bg-rose-950/50",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

// Shared input classes
const inputCls =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200";

const labelCls =
  "block text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-1.5";

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
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-20 scale-125 blur-xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/25">
              <CheckCircle size={42} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            Inquiry Submitted!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-1.5">
            Thank you for reaching out. I'll review your message and respond within{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">24–48 hours</span>.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Redirecting you to the homepage…</p>
          <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              style={{ animation: "grow 4s linear forwards" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes grow { from { width: 0% } to { width: 100% } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <section className="relative py-14 overflow-x-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/8 dark:bg-blue-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-400/8 dark:bg-violet-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ── Page header ────────────────────────────── */}
          <div className="text-center mb-14" style={{ animation: "fadeUp 0.6s ease both" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 mb-5">
              <MessageCircle size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black tracking-[0.15em] text-blue-700 dark:text-blue-300 uppercase">
                Contact Eugen Consultancy
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              Let's Discuss{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500">
                Your Project
              </span>
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
              Available for consultancy, web development, system architecture, and digital solutions.
              Let's build something remarkable together.
            </p>
          </div>

          {/* ── Two-column layout ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 xl:gap-8 items-start">

            {/* ── Left: Form ─────────────────────────── */}
            <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl shadow-gray-100/80 dark:shadow-black/30 overflow-hidden">
              {/* Form header stripe */}
              <div className="px-7 pt-7 pb-6 border-b border-gray-50 dark:border-gray-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                    <Send size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white">Send an Inquiry</h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">All fields marked are required</p>
                  </div>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name <span className="text-blue-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address <span className="text-blue-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Row 2: Service + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Service Needed <span className="text-blue-500">*</span></label>
                    <div className="relative">
                      <select
                        name="service"
                        required
                        defaultValue=""
                        className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                      >
                        <option value="" disabled>Select a service…</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Budget Range</label>
                    <div className="relative">
                      <select
                        name="budget"
                        defaultValue=""
                        className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                      >
                        <option value="" disabled>Select a range…</option>
                        {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className={labelCls}>Subject <span className="text-blue-500">*</span></label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Brief project title or topic"
                    className={inputCls}
                  />
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className={labelCls} style={{ marginBottom: 0 }}>
                      Message <span className="text-blue-500">*</span>
                    </label>
                    <span className={`text-[10px] tabular-nums font-semibold transition-colors ${messageLen > 900 ? "text-amber-500" : "text-gray-400 dark:text-gray-600"}`}>
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
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Security check */}
                <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/70 to-transparent dark:from-blue-950/20 dark:to-transparent p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                      Security Check
                    </p>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    What is{" "}
                    <span className="font-black text-blue-600 dark:text-blue-400">{num1}</span>
                    {" "}+{" "}
                    <span className="font-black text-blue-600 dark:text-blue-400">{num2}</span>?
                  </label>
                  <input
                    type="number"
                    name="answer"
                    required
                    placeholder="Enter the sum"
                    className="w-full sm:w-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Honeypot */}
                <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden>
                  <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-white text-sm bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending Inquiry…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Request Consultation
                      <ArrowRight size={14} className="ml-auto" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── Right: Info panels (stacked, no overflow) ── */}
            <div className="flex flex-col gap-5 min-w-0">

              {/* Availability pill */}
              <div className="rounded-2xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-5 py-4 flex items-center gap-3.5">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-green-800 dark:text-green-300 leading-tight">Available for Projects</p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Open for freelance & consultancy</p>
                </div>
              </div>

              {/* Contact details */}
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg shadow-gray-100/60 dark:shadow-black/20 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-gray-50 dark:border-gray-800/80">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                    Contact Details
                  </h3>
                </div>
                <ul className="divide-y divide-gray-50 dark:divide-gray-800/60">
                  {contactInfo.map((item) => (
                    <li key={item.label} className="flex items-center gap-4 px-6 py-4 group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={item.iconColor}>{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why work with me */}
              <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg shadow-gray-100/60 dark:shadow-black/20 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-gray-50 dark:border-gray-800/80">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                    Why Work With Us?
                  </h3>
                </div>
                <ul className="p-5 grid grid-cols-2 gap-3">
                  {benefits.map((b) => (
                    <li key={b.text} className="flex items-center gap-2.5 group">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${b.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                        {b.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}