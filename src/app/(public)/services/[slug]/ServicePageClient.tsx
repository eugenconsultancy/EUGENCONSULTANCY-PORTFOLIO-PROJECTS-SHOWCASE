"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
type ServiceMeta = {
    id: number;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    icon: string;
    image: string | null;   // ✅ Added image
};

interface ServicePageClientProps {
    service: ServiceMeta;
    features: string[];
    benefits: { title: string; items: string[] }[];
    process: { step: string; desc: string }[];
    techStack: Record<string, string[]>;
    pricing: { name: string; price: string; features: string[] }[];
    testimonials: { quote: string; author: string; role: string }[];
    faq: { q: string; a: string }[];
}

// ─── Static page data ─────────────────────────────────────────────────────────

const PAIN_POINTS = [
    { icon: "📉", text: "Poor decision making from scattered, unstructured data" },
    { icon: "🐌", text: "Slow, outdated business systems that block growth" },
    { icon: "📊", text: "No reporting dashboards or real-time KPI visibility" },
    { icon: "📈", text: "Low Google rankings and invisible organic presence" },
    { icon: "🔒", text: "Weak website security leaving you exposed" },
    { icon: "☁️", text: "No cloud infrastructure — manual, error-prone deploys" },
    { icon: "⚡", text: "Manual workflows consuming hours that should be automated" },
    { icon: "🤖", text: "No AI integration while competitors pull ahead" },
];

const DEFAULT_GAINS = [
    {
        icon: "📊",
        title: "Business Intelligence",
        gradient: "from-blue-600 to-cyan-500",
        glow: "rgba(59,130,246,0.25)",
        items: ["Interactive dashboards", "Executive reports", "KPI monitoring", "Trend analysis"],
    },
    {
        icon: "🔍",
        title: "SEO Visibility",
        gradient: "from-amber-500 to-orange-500",
        glow: "rgba(245,158,11,0.25)",
        items: ["Keyword strategy", "Technical SEO", "Content optimization", "Schema markup"],
    },
    {
        icon: "☁️",
        title: "Cloud Infrastructure",
        gradient: "from-violet-600 to-indigo-600",
        glow: "rgba(139,92,246,0.25)",
        items: ["Docker & AWS", "CI/CD pipelines", "Zero-downtime deploys", "Observability"],
    },
    {
        icon: "🤖",
        title: "AI & Automation",
        gradient: "from-emerald-600 to-teal-500",
        glow: "rgba(16,185,129,0.25)",
        items: ["ML model integration", "LLM APIs", "Workflow automation", "Predictive analytics"],
    },
    {
        icon: "📱",
        title: "Mobile Applications",
        gradient: "from-pink-600 to-rose-500",
        glow: "rgba(236,72,153,0.25)",
        items: ["Flutter & React Native", "App Store ready", "Offline capable", "Push notifications"],
    },
    {
        icon: "🏗",
        title: "System Architecture",
        gradient: "from-slate-600 to-gray-700",
        glow: "rgba(100,116,139,0.25)",
        items: ["Scalability blueprints", "Microservices", "API design", "Tech audits"],
    },
];

const TECH_DISCIPLINES = [
    {
        label: "Software Engineering",
        icon: "⚡",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.2)",
        tools: ["Next.js", "React", "Vue", "TypeScript", "React Native", "Flutter", "Tailwind", "Material UI"],
    },
    {
        label: "Backend Engineering",
        icon: "🏗",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.08)",
        border: "rgba(139,92,246,0.2)",
        tools: ["Django", "Django Ninja", "FastAPI", "Flask", "Node.js", "PHP", "REST APIs", "WebSockets"],
    },
    {
        label: "Cloud & DevOps",
        icon: "☁️",
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.08)",
        border: "rgba(6,182,212,0.2)",
        tools: ["Docker", "AWS", "Azure", "Nginx", "GitHub Actions", "CI/CD", "Redis", "Celery"],
    },
    {
        label: "Databases",
        icon: "🗄",
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.2)",
        tools: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "ElasticSearch"],
    },
];

const ANALYTICS_DISCIPLINES = [
    {
        icon: "📊",
        title: "Statistical Analysis",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.18)",
        tools: ["SPSS", "Statsmodels", "SciPy", "Hypothesis Testing", "Regression Analysis", "ANOVA", "T-tests", "Time Series"],
    },
    {
        icon: "🧹",
        title: "Data Cleaning",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.08)",
        border: "rgba(139,92,246,0.18)",
        tools: ["Pandas", "NumPy", "Data Wrangling", "ETL Pipelines", "Data Validation", "Missing Value Analysis"],
    },
    {
        icon: "🤖",
        title: "Machine Learning",
        color: "#EC4899",
        bg: "rgba(236,72,153,0.08)",
        border: "rgba(236,72,153,0.18)",
        tools: ["scikit-learn", "Classification", "Regression", "Clustering", "Predictive Analytics", "Feature Engineering"],
    },
    {
        icon: "📈",
        title: "Data Visualization",
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.18)",
        tools: ["Plotly", "Matplotlib", "Interactive Dashboards", "Business Reports", "KPIs", "Executive Dashboards"],
    },
];

const SEO_PIPELINE = [
    "Website Audit",
    "Technical SEO",
    "Core Web Vitals",
    "Content Optimization",
    "Structured Data",
    "Indexing",
    "Performance Monitoring",
    "Continuous Growth",
];

const SEO_CARDS = [
    {
        icon: "⚡",
        title: "Technical SEO",
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.2)",
        items: ["Core Web Vitals", "Lighthouse", "PageSpeed", "Lazy Loading", "Rendering", "Performance", "CLS", "LCP", "INP"],
    },
    {
        icon: "🔑",
        title: "Keyword Research",
        color: "#3B82F6",
        bg: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.2)",
        items: ["Ahrefs", "Google Trends", "Competitor Analysis", "Search Intent", "SERP Analysis", "Keyword Clustering"],
    },
    {
        icon: "🔍",
        title: "Search Console",
        color: "#10B981",
        bg: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.2)",
        items: ["Google Search Console", "Coverage", "Performance", "Sitemaps", "Indexing", "Rich Results", "URL Inspection"],
    },
    {
        icon: "🌐",
        title: "WordPress SEO",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.08)",
        border: "rgba(139,92,246,0.2)",
        items: ["RankMath", "Yoast", "Schema", "Canonical URLs", "Internal Linking", "Breadcrumbs", "OpenGraph", "Meta Optimization"],
    },
    {
        icon: "🌍",
        title: "Webmaster Platforms",
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.08)",
        border: "rgba(6,182,212,0.2)",
        items: ["Google Search Console", "Bing Webmaster Tools", "Yandex Webmaster", "XML Sitemap Submission", "robots.txt", "IndexNow", "URL Inspection", "Crawl Diagnostics"],
    },
    {
        icon: "🏷",
        title: "Technical Optimization",
        color: "#EF4444",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.2)",
        items: ["Schema Markup", "JSON-LD", "Open Graph", "Twitter Cards", "Canonical URLs", "Image SEO", "Mobile Optimization", "Structured Data"],
    },
    {
        icon: "📊",
        title: "SEO Monitoring",
        color: "#84CC16",
        bg: "rgba(132,204,22,0.08)",
        border: "rgba(132,204,22,0.2)",
        items: ["Rank Tracking", "Index Coverage", "CTR Analysis", "Keyword Monitoring", "Crawl Errors", "404 Analysis", "Backlink Monitoring", "Traffic Growth"],
    },
];

const WP_CARDS = [
    { icon: "🎨", title: "Custom Themes", desc: "Hand-crafted WordPress themes built to your brand, pixel-perfect and fully responsive." },
    { icon: "🔌", title: "Plugin Integration", desc: "Seamless integration of best-in-class plugins with custom configuration and conflict resolution." },
    { icon: "🛒", title: "WooCommerce", desc: "Full e-commerce builds — product pages, checkout, payment gateways, and order management." },
    { icon: "⚡", title: "Performance Optimization", desc: "Sub-2s load times via caching, image optimization, CDN setup, and database tuning." },
    { icon: "🔒", title: "Security Hardening", desc: "Firewall rules, login protection, malware scanning, SSL, and OWASP-aligned hardening." },
    { icon: "🚚", title: "Migration", desc: "Zero-downtime migrations from any host or platform, preserving SEO and all content." },
    { icon: "🖼", title: "Elementor & Gutenberg", desc: "Visual builder expertise — custom blocks, templates, and advanced CSS customizations." },
    { icon: "🐘", title: "Custom PHP", desc: "Bespoke plugin development, hooks, filters, REST endpoint extensions, and theme functions." },
    { icon: "📋", title: "Advanced Custom Fields", desc: "Complex ACF field groups, flexible content layouts, and custom post type architectures." },
    { icon: "🔍", title: "SEO Optimization", desc: "RankMath/Yoast configuration, sitemap setup, schema markup, and Search Console integration." },
];

const DEFAULT_FAQ = [
    { q: "Do you optimize Core Web Vitals?", a: "Yes. We audit every Lighthouse metric — LCP, CLS, and INP — and implement targeted fixes: lazy loading, image formats, render-blocking resource elimination, and server-side caching to hit 90+ scores." },
    { q: "Can you migrate WordPress websites?", a: "Yes. We perform zero-downtime migrations using staging environments, database export/import, domain DNS cutover, and full redirect mapping to preserve your SEO rankings." },
    { q: "Can you submit my website to Google?", a: "Yes. We handle complete search engine submission including Google Search Console verification, sitemap submission, Bing Webmaster Tools, Yandex, and IndexNow for instant indexing signals." },
    { q: "Do you perform technical SEO audits?", a: "Yes. Our audits cover crawlability, indexation, site architecture, mobile usability, page speed, structured data validity, duplicate content, and canonical URL health — delivered as a prioritised action report." },
    { q: "Can you build analytics dashboards?", a: "Yes. We build interactive dashboards using Plotly, Power BI, and custom web solutions that connect to your data sources and display KPIs, trends, and executive summaries in real time." },
    { q: "Can you deploy to AWS?", a: "Yes. We handle end-to-end AWS deployments: EC2 provisioning, S3 asset storage, CloudFront CDN, RDS databases, auto-scaling groups, and CloudWatch monitoring with Sentry error tracking." },
    { q: "Do you provide SPSS analysis for research?", a: "Yes. We support academic and business research with full SPSS workflows — hypothesis testing, regression, ANOVA, chi-square, reliability testing, and professionally formatted output reports." },
    { q: "Can you integrate AI into an existing product?", a: "Yes. We embed LLM APIs (OpenAI, Anthropic, Gemini), build retrieval-augmented generation (RAG) systems, and deploy ML models as microservices within your existing architecture." },
];

const DEFAULT_TESTIMONIALS = [
    { quote: "Exceptional engineering quality. The platform handled launch-day traffic with zero downtime and Core Web Vitals scores above 95.", author: "Dr. A. Mwangi", role: "Director, EdTech Startup" },
    { quote: "The SPSS analysis and research dashboard were delivered ahead of schedule. The visualisations made our findings immediately clear to the board.", author: "Prof. J. Ochieng", role: "Head of Research, University of Nairobi" },
    { quote: "Our organic traffic grew 340% in four months after the technical SEO audit and RankMath configuration. Tangible, measurable results.", author: "S. Kimani", role: "Founder, E-commerce Brand" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-3">
            <span className="w-6 h-px bg-blue-500" />
            {children}
        </p>
    );
}

function SectionHeading({
    children,
    sub,
    center,
    light,
}: {
    children: React.ReactNode;
    sub?: string;
    center?: boolean;
    light?: boolean;
}) {
    return (
        <div className={`mb-10 ${center ? "text-center" : ""}`}>
            <h2
                className={`text-3xl md:text-4xl font-black tracking-tight leading-tight ${light ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
            >
                {children}
            </h2>
            {sub && (
                <p
                    className={`mt-3 text-base max-w-2xl leading-relaxed ${center ? "mx-auto" : ""
                        } ${light ? "text-blue-100/80" : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    {sub}
                </p>
            )}
        </div>
    );
}

function Sparkline({ color }: { color: string }) {
    const points = [8, 22, 14, 30, 18, 38, 26, 32, 40, 28, 44, 36, 50];
    const path = points
        .map((y, i) => `${i === 0 ? "M" : "L"} ${i * 9} ${52 - y}`)
        .join(" ");
    return (
        <svg width="108" height="52" viewBox="0 0 108 52" fill="none" className="opacity-20" aria-hidden>
            <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
            style={{ transition: "box-shadow 0.2s" }}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
                aria-expanded={open}
            >
                <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {q}
                </span>
                <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                        background: open ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.1)",
                        color: open ? "#fff" : "#6366f1",
                        transform: open ? "rotate(45deg)" : "none",
                    }}
                >
                    <span className="text-base font-black leading-none">+</span>
                </span>
            </button>
            {open && (
                <div
                    className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4"
                    style={{ animation: "fadeDown 0.22s ease" }}
                >
                    {a}
                </div>
            )}
        </div>
    );
}

function PricingCard({
    plan,
    featured,
    slug,
}: {
    plan: { name: string; price: string; features: string[] };
    featured: boolean;
    slug: string;
}) {
    return (
        <div
            className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${featured ? "shadow-2xl scale-105" : "hover:-translate-y-1 hover:shadow-xl"
                }`}
            style={{
                background: featured
                    ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
                    : "white",
                border: featured
                    ? "1px solid rgba(129,140,248,0.4)"
                    : "1px solid rgba(229,231,235,1)",
            }}
        >
            {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                        className="px-4 py-1 rounded-full text-xs font-black"
                        style={{
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            color: "#fff",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.5)",
                        }}
                    >
                        Most Popular
                    </span>
                </div>
            )}
            <h3 className={`text-xl font-black mb-1 ${featured ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {plan.name}
            </h3>
            <p className={`text-3xl font-black mb-6 ${featured ? "text-indigo-300" : "text-blue-600 dark:text-blue-400"}`}>
                {plan.price}
            </p>
            <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                    <li
                        key={j}
                        className={`flex items-start gap-2 text-sm ${featured ? "text-indigo-200" : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        <span
                            className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                            style={{
                                background: featured ? "rgba(129,140,248,0.2)" : "rgba(16,185,129,0.15)",
                                color: featured ? "#a5b4fc" : "#10b981",
                            }}
                        >
                            ✓
                        </span>
                        {f}
                    </li>
                ))}
            </ul>
            <Link
                href={`/contact?service=${slug}`}
                className="block text-center py-3 rounded-xl font-bold text-sm transition-all"
                style={
                    featured
                        ? {
                            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                            color: "#fff",
                            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                        }
                        : {}
                }
            >
                {featured ? "Get Started" : "Choose Plan"}
            </Link>
        </div>
    );
}

// ─── Main client component ─────────────────────────────────────────────────────

export default function ServicePageClient({
    service,
    features,
    benefits,
    process,
    techStack,
    pricing,
    testimonials,
    faq,
}: ServicePageClientProps) {
    const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);

    // Merge DB data with static defaults
    const gainCards =
        benefits.length > 0
            ? benefits.map((b, i) => ({
                icon: DEFAULT_GAINS[i % DEFAULT_GAINS.length].icon,
                title: b.title,
                gradient: DEFAULT_GAINS[i % DEFAULT_GAINS.length].gradient,
                glow: DEFAULT_GAINS[i % DEFAULT_GAINS.length].glow,
                items: b.items,
            }))
            : DEFAULT_GAINS;

    const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
    const displayFaq = faq.length > 0 ? faq : DEFAULT_FAQ;

    const showAnalytics = true;
    const showSEO = true;
    const showWordPress = true;

    return (
        <>
            <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aurora1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(60px,-40px) scale(1.15); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-50px,30px) scale(1.1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.65s ease both; }
      `}</style>

            <main className="overflow-x-hidden">

                {/* ════════════════════════════════════════════════════════════════════
            1. HERO — aurora gradient, authority positioning
        ════════════════════════════════════════════════════════════════════ */}
                <section
                    className="relative min-h-[88vh] flex items-center overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0f0f1e 0%, #130a2e 45%, #0a1628 100%)",
                    }}
                >
                    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div
                            className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full blur-[130px]"
                            style={{ background: "rgba(99,102,241,0.18)", animation: "aurora1 16s ease-in-out infinite" }}
                        />
                        <div
                            className="absolute top-1/3 right-1/5 w-[420px] h-[420px] rounded-full blur-[120px]"
                            style={{ background: "rgba(139,92,246,0.14)", animation: "aurora2 20s ease-in-out infinite" }}
                        />
                        <div
                            className="absolute bottom-1/4 left-1/3 w-[340px] h-[340px] rounded-full blur-[100px]"
                            style={{ background: "rgba(6,182,212,0.10)" }}
                        />
                        <div
                            className="absolute inset-0 opacity-[0.035]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 56px),repeating-linear-gradient(90deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 56px)",
                            }}
                        />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-28 w-full">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left: copy */}
                            <div className="fade-up space-y-6">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
                                    style={{
                                        background: "rgba(99,102,241,0.15)",
                                        border: "1px solid rgba(99,102,241,0.3)",
                                        color: "#a5b4fc",
                                    }}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }}
                                    />
                                    EugenConsultancy · Professional Services
                                </div>

                                <h1
                                    className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight"
                                    style={{
                                        background: "linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {service.icon && <span className="mr-3" style={{ WebkitTextFillColor: "initial" }}>{service.icon}</span>}
                                    {service.name}
                                </h1>

                                <p
                                    className="text-lg leading-relaxed max-w-xl"
                                    style={{ color: "rgba(203,213,225,0.85)" }}
                                >
                                    {service.tagline ||
                                        "Helping organizations transform raw data into business decisions, high-performance software, and measurable online growth."}
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className="text-lg"
                                                style={{ color: "#FBBF24", filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))" }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span style={{ color: "rgba(148,163,184,0.8)", fontSize: "0.8rem", fontWeight: 600 }}>
                                        Trusted Engineering Practices
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Link
                                        href={`/contact?service=${service.slug}`}
                                        className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                                        style={{
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            color: "#fff",
                                            boxShadow: "0 0 24px rgba(99,102,241,0.5)",
                                        }}
                                    >
                                        Book Consultation
                                    </Link>
                                    <Link
                                        href="/projects"
                                        className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                                        style={{
                                            background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            color: "#e2e8f0",
                                            backdropFilter: "blur(8px)",
                                        }}
                                    >
                                        View Projects →
                                    </Link>
                                </div>
                            </div>

                            {/* Right: feature list OR image */}
                            <div
                                className="hidden md:block rounded-3xl p-8"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                {service.image ? (
                                    // ✅ Display uploaded image
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    // Fallback: feature list
                                    <>
                                        <p
                                            className="text-xs font-black tracking-[0.2em] uppercase mb-5"
                                            style={{ color: "rgba(129,140,248,0.7)" }}
                                        >
                                            {features.length > 0 ? "What's Included" : "Core Capabilities"}
                                        </p>
                                        <ul className="space-y-3">
                                            {(features.length > 0 ? features : [
                                                "End-to-end project delivery",
                                                "Production-grade code quality",
                                                "Security & performance built-in",
                                                "Cloud-native deployment",
                                                "Ongoing support & documentation",
                                                "Weekly progress updates",
                                            ]).map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(203,213,225,0.85)" }}>
                                                    <span
                                                        className="mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                                                        style={{
                                                            background: "rgba(99,102,241,0.2)",
                                                            color: "#a5b4fc",
                                                            border: "1px solid rgba(99,102,241,0.3)",
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ────────────────────────────────
            All other sections remain exactly the same
            (Business Challenges, What You'll Gain, Tech Stack, etc.)
            ──────────────────────────────── */}

                {/* ═══ 2. BUSINESS CHALLENGES WE SOLVE ═══ */}
                <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <SectionLabel>Pain points</SectionLabel>
                        <SectionHeading sub="We understand the operational friction that holds businesses back. Here's what we fix.">
                            Business Challenges We Solve
                        </SectionHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PAIN_POINTS.map((pain, i) => (
                                <div
                                    key={i}
                                    className="group flex items-start gap-4 rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                                >
                                    <span className="text-2xl flex-shrink-0 mt-0.5">{pain.icon}</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
                                        {pain.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 3. WHAT YOU'LL GAIN ═══ */}
                <section className="py-20 bg-white dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <SectionLabel>Outcomes</SectionLabel>
                        <SectionHeading sub="Every engagement is anchored to measurable business outcomes — not just deliverables.">
                            What You&apos;ll Gain
                        </SectionHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {gainCards.map((card, i) => (
                                <div
                                    key={i}
                                    className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient}`} />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(ellipse at top left, ${card.glow}, transparent 60%)`,
                                        }}
                                    />
                                    <div className="relative">
                                        <div
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            {card.icon}
                                        </div>
                                        <h3 className="font-black text-gray-900 dark:text-white mb-3 text-base">
                                            {card.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {card.items.map((item, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="text-green-500 font-black text-xs">✓</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 4. TECHNOLOGY BY DISCIPLINE ═══ */}
                <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <SectionLabel>Technical depth</SectionLabel>
                        <SectionHeading sub="Organised by discipline — not scattered lists. Every tool chosen for a reason.">
                            Technology Stack
                        </SectionHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {(Object.keys(techStack).length > 0
                                ? Object.entries(techStack).map(([label, tools], i) => ({
                                    label,
                                    icon: TECH_DISCIPLINES[i % TECH_DISCIPLINES.length].icon,
                                    color: TECH_DISCIPLINES[i % TECH_DISCIPLINES.length].color,
                                    bg: TECH_DISCIPLINES[i % TECH_DISCIPLINES.length].bg,
                                    border: TECH_DISCIPLINES[i % TECH_DISCIPLINES.length].border,
                                    tools,
                                }))
                                : TECH_DISCIPLINES
                            ).map((disc, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl p-6"
                                    style={{
                                        background: disc.bg,
                                        border: `1px solid ${disc.border}`,
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                                            style={{ background: `${disc.color}22`, border: `1px solid ${disc.color}44` }}
                                        >
                                            {disc.icon}
                                        </div>
                                        <h3 className="font-black text-base" style={{ color: disc.color }}>
                                            {disc.label}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {disc.tools.map((tool) => (
                                            <span
                                                key={tool}
                                                className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                                                style={{
                                                    background: `${disc.color}11`,
                                                    border: `1px solid ${disc.color}30`,
                                                    color: disc.color,
                                                }}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 5. DELIVERY PROCESS ═══ */}
                {process.length > 0 && (
                    <section className="py-20 bg-white dark:bg-gray-950">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <SectionLabel>How we deliver</SectionLabel>
                            <SectionHeading sub="A structured, milestone-driven process with full transparency at every stage.">
                                Delivery Process
                            </SectionHeading>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {process.map((step, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all"
                                    >
                                        <span
                                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                                            style={{
                                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                                color: "#fff",
                                            }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{step.step}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ 6. DATA ANALYTICS & DECISION INTELLIGENCE ═══ */}
                {showAnalytics && (
                    <section
                        className="py-20"
                        style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                        }}
                    >
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <div className="text-center mb-12">
                                <p
                                    className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase mb-3"
                                    style={{ color: "rgba(129,140,248,0.8)" }}
                                >
                                    <span className="w-6 h-px" style={{ background: "#818cf8" }} />
                                    Decision Intelligence
                                </p>
                                <h2
                                    className="text-3xl md:text-4xl font-black tracking-tight leading-tight"
                                    style={{
                                        background: "linear-gradient(135deg,#ffffff 30%,#a5b4fc 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Data Analytics &amp;<br />Decision Intelligence
                                </h2>
                                <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "rgba(148,163,184,0.8)" }}>
                                    Transforming raw data into strategic decisions through rigorous statistical analysis and clear visualization.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {ANALYTICS_DISCIPLINES.map((disc, i) => (
                                    <div
                                        key={i}
                                        className="group relative rounded-2xl p-6 overflow-hidden"
                                        style={{
                                            background: disc.bg,
                                            border: `1px solid ${disc.border}`,
                                        }}
                                    >
                                        <div className="absolute bottom-3 right-3 pointer-events-none">
                                            <Sparkline color={disc.color} />
                                        </div>
                                        <div className="relative">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                                    style={{ background: `${disc.color}22`, border: `1px solid ${disc.color}44` }}
                                                >
                                                    {disc.icon}
                                                </div>
                                                <h3 className="font-black text-base" style={{ color: disc.color }}>
                                                    {disc.title}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {disc.tools.map((tool) => (
                                                    <span
                                                        key={tool}
                                                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                                                        style={{
                                                            background: `${disc.color}11`,
                                                            border: `1px solid ${disc.color}30`,
                                                            color: disc.color,
                                                        }}
                                                    >
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ 7. SEO & DIGITAL GROWTH ═══ */}
                {showSEO && (
                    <section className="py-20 bg-white dark:bg-gray-950">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <SectionLabel>Search visibility</SectionLabel>
                            <SectionHeading sub="A full-spectrum SEO operation — from technical foundations to continuous rank growth.">
                                SEO &amp; Digital Growth
                            </SectionHeading>

                            <div
                                className="rounded-2xl p-6 mb-8"
                                style={{
                                    background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(249,115,22,0.04) 100%)",
                                    border: "1px solid rgba(245,158,11,0.2)",
                                }}
                            >
                                <p className="text-xs font-black tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(245,158,11,0.8)" }}>
                                    SEO Workflow
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {SEO_PIPELINE.map((step, i) => (
                                        <React.Fragment key={step}>
                                            <button
                                                onClick={() => setActivePipelineStep(activePipelineStep === i ? null : i)}
                                                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                                style={
                                                    activePipelineStep === i
                                                        ? {
                                                            background: "linear-gradient(135deg,#F59E0B,#EF4444)",
                                                            color: "#fff",
                                                            boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                                                            transform: "translateY(-2px)",
                                                        }
                                                        : {
                                                            background: "rgba(245,158,11,0.1)",
                                                            border: "1px solid rgba(245,158,11,0.2)",
                                                            color: "#D97706",
                                                        }
                                                }
                                            >
                                                {step}
                                            </button>
                                            {i < SEO_PIPELINE.length - 1 && (
                                                <span className="font-bold text-sm" style={{ color: "rgba(245,158,11,0.4)" }}>
                                                    ↓
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {activePipelineStep !== null && (
                                    <div
                                        className="mt-4 p-4 rounded-xl text-sm"
                                        style={{
                                            background: "rgba(245,158,11,0.08)",
                                            border: "1px solid rgba(245,158,11,0.2)",
                                            color: "#D97706",
                                            animation: "fadeDown 0.2s ease",
                                        }}
                                    >
                                        <strong>{SEO_PIPELINE[activePipelineStep]}:</strong>{" "}
                                        {[
                                            "Comprehensive crawl analysis identifying indexation gaps, broken links, redirect chains, and architectural issues.",
                                            "Fixing crawlability, robots.txt, canonical tags, hreflang, pagination, and render-blocking resources.",
                                            "Optimizing LCP, CLS, and INP scores — targeting 90+ Lighthouse performance on mobile and desktop.",
                                            "Aligning page content to search intent, optimising headings, meta, and semantic HTML structure.",
                                            "Implementing JSON-LD schema: Organization, Article, FAQ, Product, BreadcrumbList, and LocalBusiness.",
                                            "Submitting sitemaps to Google, Bing, and Yandex; monitoring crawl coverage and fixing exclusions.",
                                            "Weekly rank tracking, CTR analysis, crawl error alerts, and Google Search Console health reviews.",
                                            "Monthly reporting, content refresh cycles, and proactive algorithm update response.",
                                        ][activePipelineStep]}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {SEO_CARDS.map((card, i) => (
                                    <div
                                        key={i}
                                        className="rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                                        style={{ background: card.bg, border: `1px solid ${card.border}` }}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xl">{card.icon}</span>
                                            <h3 className="font-black text-sm" style={{ color: card.color }}>
                                                {card.title}
                                            </h3>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {card.items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="text-xs font-medium flex items-center gap-1.5"
                                                    style={{ color: card.color, opacity: 0.85 }}
                                                >
                                                    <span style={{ opacity: 0.6 }}>·</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ 8. WORDPRESS ENGINEERING ═══ */}
                {showWordPress && (
                    <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8">
                            <SectionLabel>CMS expertise</SectionLabel>
                            <SectionHeading sub="Full-spectrum WordPress engineering — from custom theme development to WooCommerce and performance hardening.">
                                WordPress Engineering
                            </SectionHeading>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {WP_CARDS.map((card, i) => (
                                    <div
                                        key={i}
                                        className="group rounded-2xl p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200 overflow-hidden relative"
                                    >
                                        <div
                                            className="absolute top-0 left-0 right-0 h-0.5"
                                            style={{
                                                background: `linear-gradient(90deg, hsl(${220 + i * 15}, 80%, 55%), transparent)`,
                                            }}
                                        />
                                        <span className="text-2xl mb-3 block">{card.icon}</span>
                                        <h3 className="font-black text-gray-900 dark:text-white text-sm mb-2">{card.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ 9. PRICING ═══ */}
                {pricing.length > 0 && (
                    <section className="py-20 bg-white dark:bg-gray-950">
                        <div className="max-w-5xl mx-auto px-6 sm:px-8">
                            <SectionLabel>Pricing</SectionLabel>
                            <SectionHeading center sub="Transparent, fixed-scope pricing — no surprises, no hourly guesswork.">
                                Investment Plans
                            </SectionHeading>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
                                {pricing.map((plan, i) => (
                                    <PricingCard
                                        key={i}
                                        plan={plan}
                                        featured={i === Math.floor(pricing.length / 2)}
                                        slug={service.slug}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ 10. GLASS TESTIMONIALS ═══ */}
                <section
                    className="py-20"
                    style={{
                        background: "linear-gradient(135deg, #0f0f1e 0%, #130a2e 100%)",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <div className="text-center mb-10">
                            <p
                                className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase mb-3"
                                style={{ color: "rgba(129,140,248,0.8)" }}
                            >
                                <span className="w-6 h-px" style={{ background: "#818cf8" }} />
                                Client outcomes
                            </p>
                            <h2
                                className="text-3xl md:text-4xl font-black tracking-tight"
                                style={{
                                    background: "linear-gradient(135deg,#ffffff 30%,#a5b4fc 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                What Clients Say
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {displayTestimonials.slice(0, 3).map((t, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-5 rounded-2xl p-7"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(16px)",
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <span key={s} style={{ color: "#FBBF24", fontSize: "0.85rem" }}>★</span>
                                        ))}
                                    </div>
                                    <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "rgba(203,213,225,0.9)" }}>
                                        &ldquo;{t.quote}&rdquo;
                                    </blockquote>
                                    <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                                        <p className="font-bold text-white text-sm">{t.author}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.7)" }}>{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 11. FAQ ═══ */}
                <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
                    <div className="max-w-3xl mx-auto px-6 sm:px-8">
                        <SectionLabel>Common questions</SectionLabel>
                        <SectionHeading center sub="Everything clients ask before starting a project.">
                            Frequently Asked Questions
                        </SectionHeading>
                        <div className="space-y-3 mt-2">
                            {displayFaq.map((item, i) => (
                                <FAQItem key={i} q={item.q} a={item.a} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 12. FINAL CTA ═══ */}
                <section className="py-20 bg-white dark:bg-gray-950">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8">
                        <div
                            className="relative rounded-3xl overflow-hidden"
                            style={{ boxShadow: "0 32px 64px -16px rgba(99,102,241,0.3)" }}
                        >
                            <div
                                aria-hidden
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a5f 100%)",
                                }}
                            />
                            <div
                                aria-hidden
                                className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                                style={{ background: "rgba(99,102,241,0.25)", animation: "aurora1 14s ease-in-out infinite" }}
                            />
                            <div
                                aria-hidden
                                className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                                style={{ background: "rgba(139,92,246,0.2)", animation: "aurora2 18s ease-in-out infinite" }}
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 opacity-[0.04]"
                                style={{
                                    backgroundImage:
                                        "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)",
                                }}
                            />

                            <div className="relative py-20 px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(165,180,252,0.7)" }}>
                                        Ready to start?
                                    </p>
                                    <h2
                                        className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5"
                                        style={{
                                            background: "linear-gradient(135deg,#ffffff 30%,#a5b4fc 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Let&apos;s Turn Your Ideas Into Measurable Results
                                    </h2>
                                    <div className="flex flex-wrap gap-3 mt-8">
                                        <Link
                                            href={`/contact?service=${service.slug}`}
                                            className="px-8 py-4 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5"
                                            style={{
                                                background: "#fff",
                                                color: "#312e81",
                                                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            Schedule Consultation
                                        </Link>
                                        <Link
                                            href="/projects"
                                            className="px-8 py-4 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5"
                                            style={{
                                                border: "2px solid rgba(255,255,255,0.25)",
                                                color: "#e2e8f0",
                                            }}
                                        >
                                            Browse Projects
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-black tracking-[0.15em] uppercase mb-4" style={{ color: "rgba(165,180,252,0.6)" }}>
                                        Whether you need
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Software Development",
                                            "Data Analytics",
                                            "Machine Learning",
                                            "WordPress Engineering",
                                            "Technical SEO",
                                            "Cloud Infrastructure",
                                            "Business Intelligence",
                                        ].map((item) => (
                                            <li key={item} className="flex items-center gap-3">
                                                <span
                                                    className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                                                    style={{ background: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}
                                                >
                                                    ✔
                                                </span>
                                                <span className="text-sm font-semibold" style={{ color: "rgba(203,213,225,0.9)" }}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-6 text-sm font-bold" style={{ color: "rgba(165,180,252,0.8)" }}>
                                        — we&apos;re ready to help.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}