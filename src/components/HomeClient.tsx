"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LatestProjectsGrid } from "@/components/LatestProjectsGrid";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileData = {
  id: number;
  name: string;
  bio: string;
  picture: string | null;
  status: string | null;
  skills: string | null;
  certifications: string | null;
  availability: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  radarJson: string | null;
};

type ProjectCard = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  techStack: string;
  viewCount: number;
  readingTime: number;
  images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
};

type Experience = {
  id: number;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

type Certification = {
  id: number;
  name: string;
  issuer: string;
  year: number | null;
  url: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const TYPED_PHRASES = [
  "That Scale Businesses.",
  "For Web, Mobile & Cloud.",
  "Built for Long-Term Growth.",
  "Delivered to Production.",
];

const TRUST_BADGES = [
  "15+ Production Systems",
  "500+ Daily Active Users",
  "Core Web Vitals 90+",
  "AWS & Azure Ready",
  "CI/CD Automated",
  "OWASP-Aligned Security",
];

const SERVICES = [
  {
    icon: "⚡",
    title: "Web Applications",
    desc: "Full-stack platforms with Next.js, Django, and FastAPI — built for performance, scale, and long-term maintainability.",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    icon: "📱",
    title: "Mobile Applications",
    desc: "Cross-platform mobile apps with Flutter and React Native, from MVP to production-ready native experiences.",
    gradient: "from-violet-600 to-purple-500",
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    desc: "AWS, Docker, Nginx, and GitHub Actions CI/CD pipelines — production-hardened infrastructure and zero-downtime deploys.",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    icon: "📊",
    title: "Data Analytics & SPSS",
    desc: "Statistical analysis, SPSS, Python data pipelines, academic research support, and business intelligence dashboards.",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    icon: "🔍",
    title: "Technical SEO",
    desc: "Core Web Vitals, schema markup, technical audits, Ahrefs analysis, and search engine indexation strategy.",
    gradient: "from-amber-600 to-orange-500",
  },
  {
    icon: "🤖",
    title: "AI & Automation",
    desc: "Embed ML models, LLM APIs, and intelligent automation into your existing product stack.",
    gradient: "from-rose-600 to-pink-600",
  },
];

const PROCESS_STEPS = [
  { num: "01", color: "#3B82F6", bg: "rgba(59,130,246,0.12)", icon: "🔍", name: "Discovery", desc: "Requirements, stakeholder interviews, constraints mapping." },
  { num: "02", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", icon: "🏗", name: "System Design", desc: "Architecture blueprints, database schema, API contracts." },
  { num: "03", color: "#EC4899", bg: "rgba(236,72,153,0.12)", icon: "🎨", name: "UI / UX", desc: "Wireframes, component library, accessibility-first prototypes." },
  { num: "04", color: "#10B981", bg: "rgba(16,185,129,0.12)", icon: "⌨️", name: "Development", desc: "Iterative sprints, code reviews, test-driven delivery." },
  { num: "05", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: "🧪", name: "QA & Testing", desc: "Unit, integration, E2E — plus load and security testing." },
  { num: "06", color: "#EF4444", bg: "rgba(239,68,68,0.12)", icon: "🚀", name: "Deployment", desc: "Docker, CI/CD, zero-downtime releases on AWS or Azure." },
  { num: "07", color: "#06B6D4", bg: "rgba(6,182,212,0.12)", icon: "📊", name: "Monitoring", desc: "Uptime alerts, Sentry errors, CloudWatch observability." },
  { num: "08", color: "#84CC16", bg: "rgba(132,204,22,0.12)", icon: "🔄", name: "Maintenance", desc: "Long-term support, documentation, iterative scaling." },
];

const DEPLOYMENT_STEPS = [
  { icon: "🐙", name: "GitHub", detail: "Version control, pull-request workflow, branch protection rules." },
  { icon: "⚙️", name: "GitHub Actions", detail: "Automated CI — lint, test, build, and push on every merge to main." },
  { icon: "🐳", name: "Docker Build", detail: "Multi-stage builds produce a lean, production-optimised image." },
  { icon: "🔀", name: "Nginx Proxy", detail: "SSL termination, HTTP/2, compression, and upstream load-balancing." },
  { icon: "☁️", name: "AWS EC2", detail: "Auto-scaling groups, S3 for assets, CloudWatch for observability." },
  { icon: "📊", name: "Monitoring", detail: "Uptime alerts, error budgets, and Sentry for real-time crash reports." },
];

const TECH_ORBIT = [
  "Next.js", "Django", "PostgreSQL", "Docker",
  "TypeScript", "Redis", "AWS", "FastAPI",
  "React Native", "Nginx", "Celery", "Elasticsearch",
];

const STATS = [
  { end: 48, label: "Projects Delivered", suffix: "+" },
  { end: 25, label: "Technologies Mastered", suffix: "" },
  { end: 18, label: "Happy Clients", suffix: "+" },
  { end: 120, label: "Cloud Deployments", suffix: "+" },
];

const WHY_CHOOSE = [
  { label: "End-to-end development", why: "One trusted partner from planning through to production deployment." },
  { label: "Business-first architecture", why: "Software designed around measurable outcomes, not just tech specs." },
  { label: "Security by design", why: "OWASP-aligned implementation and hardened infrastructure from day one." },
  { label: "Performance optimisation", why: "Core Web Vitals 90+, optimised APIs, and tuned database queries." },
  { label: "Long-term support", why: "Maintenance, monitoring, documentation, and iterative scaling." },
  { label: "Transparent communication", why: "Weekly updates, shared dashboards, no black-box engineering." },
];

const SEO_PLATFORMS = [
  "Google Search Console", "Ahrefs", "RankMath", "Google Analytics",
  "Bing Webmaster Tools", "Yandex Webmaster", "PageSpeed Insights",
  "Google Lighthouse", "Schema.org", "Screaming Frog", "Google Tag Manager",
  "Search Atlas", "Core Web Vitals",
];

const DATA_TOOLS = [
  "SPSS", "Pandas", "NumPy", "SciPy",
  "Statsmodels", "scikit-learn", "Matplotlib", "Plotly",
  "Excel", "Power BI",
];

const SEO_CAPABILITIES = [
  "Technical SEO Audits", "Core Web Vitals Optimization", "Google Search Console",
  "Bing & Yandex Webmaster Tools", "XML Sitemap Setup", "Robots.txt Optimization",
  "Canonical URLs", "Schema Markup", "Internal Linking Strategy",
  "Crawl Error Resolution", "Indexing Issues", "Keyword Research",
  "RankMath Configuration", "Ahrefs Analysis", "On-Page SEO",
  "Image SEO", "Structured Data", "Local SEO", "Mobile SEO",
  "Metadata Optimization", "Performance Optimization", "Search Intent Mapping",
];

const DATA_CAPABILITIES = [
  "Descriptive Statistics", "Inferential Statistics", "Correlation Analysis",
  "Regression Analysis", "ANOVA", "Chi-square Tests", "T-tests",
  "Reliability Testing", "Normality Testing", "Survey Analysis",
  "Questionnaire Analysis", "Academic Research", "Thesis Analysis",
  "Dissertation Support", "Business Intelligence",
];

const WP_CAPABILITIES = [
  "Theme Customization", "Plugin Configuration", "Custom Blocks",
  "Gutenberg", "Elementor", "RankMath", "Performance Optimization",
  "Security Hardening", "Backup & Migration", "WooCommerce",
  "Responsive Design", "Page Speed", "Technical Maintenance", "Custom CSS",
];

const ANALYTICS_TOOLS = [
  { icon: "📊", name: "SPSS", tags: ["Regression Analysis", "ANOVA", "Hypothesis Testing"] },
  { icon: "🐍", name: "Python", tags: ["Pandas", "NumPy", "SciPy", "Statsmodels"] },
  { icon: "📈", name: "Visualization", tags: ["Matplotlib", "Plotly", "Power BI", "Excel Dashboards"] },
  { icon: "🤖", name: "Machine Learning", tags: ["scikit-learn", "Classification", "Regression", "Clustering"] },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Active: {
    bg: "rgba(16,185,129,0.12)",
    text: "#34d399",
    border: "rgba(16,185,129,0.3)",
    dot: "#10b981",
  },
  Completed: {
    bg: "rgba(99,102,241,0.12)",
    text: "#a5b4fc",
    border: "rgba(99,102,241,0.3)",
    dot: "#818cf8",
  },
};

const CERTIFICATIONS_DATA = [
  {
    name: "Certified Web Professional — Web Developer (CWP)",
    issuer: "World Organization of Webmasters",
    status: "Active",
    icon: "🌐",
    accent: "#3B82F6",
  },
  {
    name: "Flutter Dart Certified Professional",
    issuer: "Kenya School of IT",
    status: "Active",
    icon: "📱",
    accent: "#06B6D4",
  },
  {
    name: "Django REST Framework — Advanced API Development",
    issuer: "Udemy",
    status: "Completed",
    icon: "🎸",
    accent: "#10B981",
  },
  {
    name: "Vue.js 3 — Complete Developer Course",
    issuer: "Udemy",
    status: "Completed",
    icon: "💚",
    accent: "#84CC16",
  },
  {
    name: "Tornado & Tkinter Developer Course",
    issuer: "Emobilis Technology College",
    status: "Completed",
    icon: "🌪️",
    accent: "#8B5CF6",
  },
];

// ─── Utility hooks ────────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, trigger]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Typed text ───────────────────────────────────────────────────────────────
function TypedText({ phrases }: { phrases: string[] }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1800);
      return () => clearTimeout(t);
    }
    const current = phrases[phraseIdx];
    if (!deleting) {
      if (displayText.length < current.length) {
        const t = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 42);
        return () => clearTimeout(t);
      } else { setPaused(true); setDeleting(true); }
    } else {
      if (displayText.length > 0) {
        const t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 22);
        return () => clearTimeout(t);
      } else { setDeleting(false); setPhraseIdx((i) => (i + 1) % phrases.length); }
    }
  }, [displayText, deleting, paused, phraseIdx, phrases]);
  return (
    <span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400">
        {displayText}
      </span>
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  );
}

// ─── Floating ecosystem (hero fallback) ───────────────────────────────────────
function FloatingEcosystem() {
  const items = [
    { name: "Next.js", x: 50, y: 8 },
    { name: "Django", x: 8, y: 28 },
    { name: "AWS", x: 78, y: 22 },
    { name: "Docker", x: 12, y: 60 },
    { name: "TypeScript", x: 68, y: 55 },
    { name: "PostgreSQL", x: 30, y: 78 },
    { name: "Redis", x: 78, y: 78 },
    { name: "FastAPI", x: 48, y: 52 },
  ];
  return (
    <div className="relative w-full h-80 md:h-96 select-none">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 animate-pulse opacity-40 scale-110" />
          <span className="relative text-white text-xs font-black text-center leading-tight">EUGEN<br />STACK</span>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-blue-200/40 dark:border-blue-800/40" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed border-violet-200/30 dark:border-violet-800/30" />
      {items.map((item, i) => (
        <div
          key={item.name}
          className="absolute tech-float"
          style={{ left: `${item.x}%`, top: `${item.y}%`, animationDelay: `${i * 0.4}s`, animationDuration: `${4 + (i % 3)}s` }}
        >
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-lg hover:border-blue-400 transition-all duration-300 whitespace-nowrap cursor-default">
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stat counter ─────────────────────────────────────────────────────────────
function StatCounter({ end, label, suffix, trigger }: { end: number; label: string; suffix: string; trigger: boolean }) {
  const count = useCountUp(end, 1800, trigger);
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
        {count}<span className="text-blue-600">{suffix}</span>
      </span>
      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center font-medium">{label}</span>
    </div>
  );
}

// ─── Tech orbit diagram ───────────────────────────────────────────────────────
function TechOrbit({ items }: { items: string[] }) {
  return (
    <>
      <div className="hidden md:flex relative items-center justify-center h-96 select-none">
        <div className="absolute z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 opacity-50 scale-125 blur-lg" />
          <span className="relative text-white text-xs font-black text-center leading-tight">EUGEN<br />STACK</span>
        </div>
        {[
          { r: 105, slice: items.slice(0, 4) },
          { r: 165, slice: items.slice(4, 9) },
          { r: 215, slice: items.slice(9) },
        ].map((ring, ri) => (
          <div key={ri} className="absolute rounded-full border border-dashed border-gray-200 dark:border-gray-700" style={{ width: ring.r * 2, height: ring.r * 2 }}>
            {ring.slice.map((tech, ti) => {
              const angle = (360 / ring.slice.length) * ti;
              const rad = (angle * Math.PI) / 180;
              const x = ring.r * Math.cos(rad - Math.PI / 2);
              const y = ring.r * Math.sin(rad - Math.PI / 2);
              return (
                <div key={tech} className="absolute" style={{ left: "50%", top: "50%", transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}>
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                    {tech}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex md:hidden flex-wrap justify-center gap-2 mt-4">
        {items.map((tech) => (
          <span key={tech} className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
            {tech}
          </span>
        ))}
      </div>
    </>
  );
}

// ─── Project carousel ─────────────────────────────────────────────────────────
function ProjectCarousel({ projects }: { projects: ProjectCard[] }) {
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const CARD_WIDTH = 360 + 24;
  const items = [...projects, ...projects, ...projects];
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setOffset((prev) => {
        const next = prev + 0.6;
        return next >= CARD_WIDTH * projects.length ? 0 : next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [paused, projects.length, CARD_WIDTH]);

  return (
    <div className="overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex gap-6" style={{ transform: `translateX(-${offset}px)`, willChange: "transform" }}>
        {items.map((project, i) => {
          const mainImage = project.images.find((img) => img.isMain) ?? project.images[0];
          const techs = project.techStack.split(",").map((t) => t.trim());
          return (
            <Link
              key={`${project.id}-${i}`}
              href={`/projects/${project.slug}`}
              className="group flex-shrink-0 w-[360px] rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
            >
              <div className="relative h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {mainImage ? (
                  <Image src={`${mainImage.filename}`} alt={mainImage.alt ?? project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-100 dark:from-gray-800 dark:to-gray-700">
                    <span className="text-5xl opacity-25">📦</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                    View Case Study →
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">{project.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{project.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {techs.slice(0, 3).map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-semibold">{t}</span>
                  ))}
                  {techs.length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg text-xs font-semibold">+{techs.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                  <span>👁 {project.viewCount.toLocaleString()} views</span>
                  <span>⏱ {project.readingTime} min read</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Deployment journey ───────────────────────────────────────────────────────
function DeploymentJourney() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3">
        {DEPLOYMENT_STEPS.map((step, i) => (
          <React.Fragment key={step.name}>
            <button
              onClick={() => setActive(active === i ? null : i)}
              className={`group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200 min-w-[100px] ${active === i
                ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 scale-105"
                : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-700"
                }`}
            >
              <span className="text-2xl mb-1.5">{step.icon}</span>
              <span className="text-xs font-bold leading-tight">{step.name}</span>
            </button>
            {i < DEPLOYMENT_STEPS.length - 1 && (
              <div className="hidden sm:flex items-center text-gray-300 dark:text-gray-700 font-bold">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {active !== null && (
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40" style={{ animation: "fadeUp 0.3s ease" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">{DEPLOYMENT_STEPS[active].icon}</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">{DEPLOYMENT_STEPS[active].name}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{DEPLOYMENT_STEPS[active].detail}</p>
        </div>
      )}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-3">
      <span className="w-6 h-px bg-blue-500" />
      {children}
    </p>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children, sub, center }: { children: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{children}</h2>
      {sub && <p className="mt-3 text-gray-500 dark:text-gray-400 text-base max-w-2xl leading-relaxed">{sub}</p>}
    </div>
  );
}

// ─── Capability chip ──────────────────────────────────────────────────────────
function CapChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
      <span className="text-emerald-500 font-black">✓</span> {children}
    </span>
  );
}

// ─── SEO & Analytics section ──────────────────────────────────────────────────
function SeoAnalyticsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-12">
          <SectionLabel>SEO · Data Analytics · Research</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mt-1">
            Search Visibility &amp; Evidence-Driven Decisions
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Helping businesses grow through search visibility, technical optimization, and evidence-based decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[42fr_58fr] gap-6 items-start">
          <div className="space-y-5">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(249,115,22,0.04) 100%)",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}
                >
                  🔍
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">Technical SEO &amp; Website Optimization</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Organic search · Core Web Vitals · Structured data</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Improve search visibility, website performance, and organic traffic using modern SEO best practices, technical audits, structured data, and search engine optimization strategies aligned with Google's latest guidelines.
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {SEO_CAPABILITIES.map((cap) => <CapChip key={cap}>{cap}</CapChip>)}
              </div>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.04) 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
                >
                  🌐
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">WordPress Customization</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Themes · Plugins · WooCommerce · Performance</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {WP_CAPABILITIES.map((cap) => <CapChip key={cap}>{cap}</CapChip>)}
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(15,23,42,0.04)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <p className="text-xs font-black tracking-[0.15em] uppercase text-gray-400 dark:text-gray-500 mb-3">Trusted SEO Platforms</p>
              <div className="flex flex-wrap gap-2">
                {SEO_PLATFORMS.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      color: "#D97706",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                >
                  📊
                </div>
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">Turning Raw Data Into Actionable Insights</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">SPSS · Python · Machine Learning · Visualization</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                Analyze research data using modern statistical techniques to support evidence-based decision making for academic projects, business intelligence, and market studies.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {ANALYTICS_TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-xl p-3.5"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{tool.icon}</span>
                      <span className="font-black text-gray-900 dark:text-gray-100 text-sm">{tool.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-xs font-medium"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/30">
                <p className="text-xs font-black tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-3">Research Methods</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {DATA_CAPABILITIES.map((cap) => <CapChip key={cap}>{cap}</CapChip>)}
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(15,23,42,0.04)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <p className="text-xs font-black tracking-[0.15em] uppercase text-gray-400 dark:text-gray-500 mb-4">Research Workflow</p>
              <div className="flex flex-wrap items-center gap-2">
                {["Research Data", "Cleaning", "Exploration", "Statistical Analysis", "Visualization", "Interpretation", "Professional Report"].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <span
                      className="px-3 py-1.5 rounded-xl text-xs font-bold"
                      style={{
                        background: `rgba(16,185,129,${0.07 + i * 0.025})`,
                        border: "1px solid rgba(16,185,129,0.2)",
                        color: "#059669",
                      }}
                    >
                      {step}
                    </span>
                    {i < arr.length - 1 && <span className="text-gray-300 dark:text-gray-700 font-bold text-xs">→</span>}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-xs font-black tracking-[0.15em] uppercase text-gray-400 dark:text-gray-500 mb-4 mt-5">SEO Audit Workflow</p>
              <div className="flex flex-wrap items-center gap-2">
                {["Website Audit", "Technical Analysis", "Keyword Research", "On-page Optimization", "Search Console", "Performance", "Monitoring"].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <span
                      className="px-3 py-1.5 rounded-xl text-xs font-bold"
                      style={{
                        background: `rgba(245,158,11,${0.07 + i * 0.025})`,
                        border: "1px solid rgba(245,158,11,0.2)",
                        color: "#D97706",
                      }}
                    >
                      {step}
                    </span>
                    {i < arr.length - 1 && <span className="text-gray-300 dark:text-gray-700 font-bold text-xs">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(15,23,42,0.04)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <p className="text-xs font-black tracking-[0.15em] uppercase text-gray-400 dark:text-gray-500 mb-3">Research Toolkit</p>
              <div className="flex flex-wrap gap-2">
                {DATA_TOOLS.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      color: "#059669",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Process steps ────────────────────────────────────────────────────────────
function ProcessSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionLabel>Our process</SectionLabel>
        <SectionHeading sub="A disciplined, eight-step engineering process that delivers on time and on spec.">
          How We Build Software
        </SectionHeading>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="group relative rounded-2xl border bg-white dark:bg-gray-900 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
              style={{ borderColor: `${step.color}30` }}
            >
              <div
                className="absolute top-2 right-3 text-5xl font-black select-none leading-none"
                style={{ color: step.color, opacity: 0.18 }}
              >
                {step.num}
              </div>
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
              />
              <div className="relative">
                <span className="text-2xl mb-3 block">{step.icon}</span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-black mb-2"
                  style={{ background: step.bg, color: step.color }}
                >
                  {step.num}
                </span>
                <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1.5">{step.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Premium certifications ───────────────────────────────────────────────────
function CertificationsSection({ dbCerts }: { dbCerts: Certification[] }) {
  const hardcodedNames = CERTIFICATIONS_DATA.map((c) => c.name.toLowerCase());
  const extraDbCerts = dbCerts.filter((c) => !hardcodedNames.includes(c.name.toLowerCase()));

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionLabel>Credentials</SectionLabel>
        <SectionHeading sub="Verified professional certifications from globally recognised institutions.">
          Certifications
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CERTIFICATIONS_DATA.map((cert, i) => {
            const statusStyle = STATUS_STYLES[cert.status] ?? STATUS_STYLES["Completed"];
            const isWide = i === 0;
            return (
              <div
                key={cert.name}
                className={`group relative rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden ${isWide ? "md:col-span-2 xl:col-span-1" : ""}`}
                style={{
                  background: `linear-gradient(135deg, ${cert.accent}0d 0%, rgba(15,23,42,0.02) 100%)`,
                  border: `1px solid ${cert.accent}30`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${cert.accent}, ${cert.accent}44)` }}
                />
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${cert.accent}18 0%, transparent 70%)` }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${cert.accent}33, ${cert.accent}18)`,
                      border: `1px solid ${cert.accent}40`,
                    }}
                  >
                    {cert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2"
                      style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: statusStyle.dot }}
                      />
                      {cert.status}
                    </span>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm leading-snug">{cert.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{cert.issuer}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {extraDbCerts.map((cert) => {
            const statusStyle = STATUS_STYLES["Completed"];
            return (
              <a
                key={cert.id}
                href={cert.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200 dark:shadow-orange-900/30">
                  <span className="text-lg">🏅</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cert.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                  style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}
                >
                  Completed
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface HomeClientProps {
  profile: ProfileData;
  latestProjects: ProjectCard[];
  featuredProjects: ProjectCard[];
  experiences: Experience[];
  certifications: Certification[];
}

export function HomeClient({
  profile,
  latestProjects,
  featuredProjects,
  experiences,
  certifications,
}: HomeClientProps) {
  const statsSection = useInView(0.3);
  const showHireBanner = profile.status?.toLowerCase().includes("hire");

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes techFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes aurora1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(60px,-40px) scale(1.15); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-50px,30px) scale(1.1); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(30px,50px) scale(1.08); }
        }
        .tech-float { animation: techFloat var(--dur, 4s) ease-in-out var(--delay, 0s) infinite; }
        .fade-up    { animation: fadeUp 0.7s ease both; }
      `}</style>

      {showHireBanner && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center py-2.5 px-4 text-sm font-semibold shadow-lg">
          🚀 Open to new opportunities —{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:text-blue-100">let&apos;s talk</Link>
        </div>
      )}

      <main className="overflow-x-hidden">

        {/* ═══ 1. HERO ═══ */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950">
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-[120px]" style={{ animation: "aurora1 14s ease-in-out infinite" }} />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-400/15 dark:bg-violet-600/10 blur-[120px]" style={{ animation: "aurora2 18s ease-in-out infinite" }} />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/8 blur-[100px]" style={{ animation: "aurora3 22s ease-in-out infinite" }} />
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 56px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 56px)" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-28 w-full">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wide">Full-Stack Software Architect · Data Analytics · AI · Cloud</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.02] tracking-tight">
                  Engineering<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500">
                    Modern Software
                  </span><br />
                  <TypedText phrases={TYPED_PHRASES} />
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                  We help startups, universities, SMEs and enterprises transform complex business challenges into secure, scalable digital products — from AI-powered platforms to cloud-native applications.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-8">
                  {TRUST_BADGES.map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 text-xs font-black">✓</span>
                      </span>
                      <span className="font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-10">
                  <Link href="/contact" className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5">
                    Book a Consultation
                  </Link>
                  <Link href="/projects" className="px-7 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5">
                    View Case Studies →
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">🔗 GitHub</a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">💼 LinkedIn</a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">🐦 Twitter</a>
                  )}
                  <a href="/rss.xml" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">📡 RSS</a>
                </div>
              </div>

              <div className="relative hidden md:flex flex-col items-center">
                {profile.picture ? (
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl" />
                    <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shadow-2xl">
                      <Image src={profile.picture} alt={profile.name} fill className="object-cover" priority sizes="320px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    {[
                      { tech: "Next.js", pos: "-top-4 -left-14" },
                      { tech: "Django", pos: "-top-4 -right-14" },
                      { tech: "AWS", pos: "top-1/3 -left-16" },
                      { tech: "Docker", pos: "top-1/3 -right-16" },
                      { tech: "AI / ML", pos: "-bottom-4 -left-10" },
                      { tech: "PostgreSQL", pos: "-bottom-4 -right-12" },
                    ].map(({ tech, pos }, i) => (
                      <div
                        key={tech}
                        className={`absolute ${pos} px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-lg tech-float`}
                        style={{ "--dur": `${4 + i * 0.5}s`, "--delay": `${i * 0.3}s` } as React.CSSProperties}
                      >
                        {tech}
                      </div>
                    ))}
                    <span className="absolute bottom-3 right-3 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-900" />
                    </span>
                  </div>
                ) : (
                  <FloatingEcosystem />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. STATISTICS STRIP ═══ */}
        <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
          <div className="max-w-5xl mx-auto px-6">
            <div ref={statsSection.ref} className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800">
              {STATS.map((s) => (
                <StatCounter key={s.label} end={s.end} label={s.label} suffix={s.suffix} trigger={statsSection.inView} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. LATEST PROJECTS ═══ */}
        {latestProjects.length > 0 && (
          <LatestProjectsGrid projects={latestProjects} />
        )}

        {/* ═══ 4. PROFESSIONAL IDENTITY ═══ */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <SectionLabel>Who we are</SectionLabel>
            <SectionHeading sub="A multidisciplinary team combining engineering rigour with business strategy.">
              Professional Identity
            </SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 p-8 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-5 shadow-lg shadow-blue-500/30">👤</div>
                <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg">What We Are</h3>
                <ul className="space-y-2.5">
                  {["Full-Stack Engineer", "Cloud Architect", "Data & ML Practitioner", "Technical SEO Strategist", "Technical Consultant"].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-violet-100 dark:border-violet-900/50 bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-gray-900 p-8 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-xl mb-5 shadow-lg shadow-violet-500/30">⚡</div>
                <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg">What We Specialise In</h3>
                <ul className="space-y-2.5">
                  {["Web & Mobile Development", "Cloud Deployment & DevOps", "AI & ML Integration", "Real-Time Systems", "System Design & Architecture", "Technical SEO & Analytics"].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      <span className="text-green-500 font-black text-base">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 p-8 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl mb-5 shadow-lg shadow-emerald-500/30">🏭</div>
                <h3 className="font-black text-gray-900 dark:text-white mb-4 text-lg">Solutions We Deliver</h3>
                <div className="flex flex-wrap gap-2">
                  {["School Management", "Hospital Systems", "POS & ERP", "Marketplaces", "CRM", "AI Platforms", "Dashboards", "Billing", "Chat Apps", "Analytics"].map((ind) => (
                    <span key={ind} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 5. FEATURED SERVICES ═══ */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <SectionLabel>What we offer</SectionLabel>
            <SectionHeading sub="End-to-end engineering, deployment, and strategy — all under one roof.">
              Featured Services
            </SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => (
                <div key={svc.title} className={`group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-200`}>
                  <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${svc.gradient}`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                    {svc.icon}
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white mb-2.5 text-base">{svc.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{svc.desc}</p>
                  <Link href="/contact" className="inline-flex items-center gap-1 mt-5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all duration-200">
                    Get started →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6. SEO & DATA ANALYTICS ═══ */}
        <SeoAnalyticsSection />

        {/* ═══ 7. HOW WE BUILD SOFTWARE ═══ */}
        <ProcessSection />

        {/* ═══ 8. FROM CODE TO CLOUD ═══ */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <SectionLabel>How we ship</SectionLabel>
            <SectionHeading sub="Click any step to learn more about our production-grade pipeline.">
              From Code to Cloud
            </SectionHeading>
            <DeploymentJourney />
          </div>
        </section>

        {/* ═══ 9. TECHNOLOGY ECOSYSTEM ═══ */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
            <SectionLabel>Our stack</SectionLabel>
            <SectionHeading sub="Battle-tested technologies, carefully chosen for each project." center>
              Technology Ecosystem
            </SectionHeading>
            <TechOrbit items={TECH_ORBIT} />
          </div>
        </section>

        {/* ═══ 10. PROJECT ARCHIVE ═══ */}
        {featuredProjects.length > 0 && (
          <section className="py-20 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-10">
              <div className="flex items-end justify-between">
                <div>
                  <SectionLabel>Project Archive</SectionLabel>
                  <SectionHeading sub="Browse more projects · Hover to pause · Click to explore full case studies.">
                    Explore All Case Studies
                  </SectionHeading>
                </div>
                <Link href="/projects" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 whitespace-nowrap mb-10">
                  View all →
                </Link>
              </div>
            </div>
            <ProjectCarousel projects={featuredProjects} />
          </section>
        )}

        {/* ═══ 11. WHY CHOOSE US ═══ */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <SectionLabel>Our edge</SectionLabel>
            <SectionHeading sub="What makes working with us different from any other engineering team.">
              Why Clients Choose Us
            </SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY_CHOOSE.map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                      <span className="text-white text-xs font-black">✓</span>
                    </div>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm">{item.label}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed pl-11">{item.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 12. CERTIFICATIONS ═══ */}
        <CertificationsSection dbCerts={certifications} />

        {/* ═══ 13. AVAILABILITY ═══ */}
        {profile.availability && (
          <section className="py-16 bg-white dark:bg-gray-950">
            <div className="max-w-3xl mx-auto px-6 sm:px-8">
              <SectionLabel>Engagement model</SectionLabel>
              <SectionHeading sub="How and when we can work together.">Availability</SectionHeading>
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-8">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{profile.availability}</p>
                <Link href="/contact" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                  Get in touch →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ═══ 14. FINAL CTA ═══ */}
        <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-700 to-indigo-800" />
              <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
              <div aria-hidden className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl" />
              <div aria-hidden className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="relative text-center py-24 px-6 md:px-12">
                <p className="text-xs font-black tracking-[0.25em] text-blue-200 uppercase mb-5">Ready to build?</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
                  Ready to Build Something<br className="hidden md:block" /> That Lasts?
                </h2>
                <p className="text-blue-100 max-w-xl mx-auto mb-10 text-base leading-relaxed">
                  Whether you need a scalable web platform, a cloud deployment strategy, or end-to-end technical consulting — let&apos;s discuss your project.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-black text-sm hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5">
                    Book a Consultation
                  </Link>
                  <Link href="/projects" className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-black text-sm hover:bg-white/10 hover:border-white/60 transition-all hover:-translate-y-0.5">
                    Browse Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}