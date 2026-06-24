"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────
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
  startDate: string;          // stored as string in DB
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

// ─── Constants ─────────────────────────────────────────
const TYPED_PHRASES = [
  "Building Scalable Web Platforms",
  "Deploying Cloud Infrastructure",
  "Integrating AI-Powered Solutions",
  "Architecting Enterprise Systems",
  "Engineering Real-Time Applications",
];

const SERVICES = [
  { icon: "⚡", title: "Web Development", desc: "Full-stack applications with Next.js, Django, FastAPI — built for performance, scale, and maintainability.", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: "☁️", title: "Cloud Infrastructure", desc: "AWS (EC2, S3, Rekognition), Docker, Nginx, and GitHub Actions CI/CD pipelines, production-hardened.", gradient: "from-indigo-500 to-violet-500", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
  { icon: "🤖", title: "AI Integration", desc: "Embed machine-learning models, LLM APIs, and data pipelines into your existing product.", gradient: "from-violet-500 to-pink-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
  { icon: "📡", title: "Real-Time Systems", desc: "WebSocket APIs, Django Channels, Redis Pub/Sub, and WebRTC for live, event-driven experiences.", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { icon: "🏗", title: "System Architecture", desc: "Technical audits, micro-service decomposition, and scalability blueprints for growing teams.", gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { icon: "🔍", title: "White-Hat SEO", desc: "Core Web Vitals, schema markup, Ahrefs/SEMrush audits, and AI-driven content strategy.", gradient: "from-rose-500 to-red-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
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

const TESTIMONIALS = [
  { quote: "Exceptional engineering quality. The platform handled launch-day traffic with zero downtime.", author: "Dr. A. Mwangi", role: "Director, EdTech Startup" },
  { quote: "The M-Pesa integration and real-time dashboards were delivered ahead of schedule. Highly recommended.", author: "J. Kamau", role: "CTO, Agri-FinTech" },
  { quote: "Transformed our legacy system into a cloud-native microservices architecture. Impressive clarity of vision.", author: "P. Otieno", role: "Head of Engineering, Healthcare SaaS" },
];

// ─── Small re-usable components ──────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-3">
      {children}
    </p>
  );
}

function SectionHeading({ children, sub, center }: { children: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{children}</h2>
      {sub && <p className="mt-2 text-gray-500 dark:text-gray-400 text-base max-w-xl">{sub}</p>}
    </div>
  );
}

// ─── Animated counter hook ────────────────────────────────────
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

// ─── Typed text component ─────────────────────────────────────
function TypedText({ phrases }: { phrases: string[] }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) { const t = setTimeout(() => setPaused(false), 1600); return () => clearTimeout(t); }
    const current = phrases[phraseIdx];
    if (!deleting) {
      if (displayText.length < current.length) {
        const t = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 45);
        return () => clearTimeout(t);
      } else { setPaused(true); setDeleting(true); }
    } else {
      if (displayText.length > 0) {
        const t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 25);
        return () => clearTimeout(t);
      } else { setDeleting(false); setPhraseIdx((i) => (i + 1) % phrases.length); }
    }
  }, [displayText, deleting, paused, phraseIdx, phrases]);
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400">
      {displayText}<span className="animate-pulse text-blue-400">|</span>
    </span>
  );
}

// ─── Project carousel ─────────────────────────────────────────
function ProjectCarousel({ projects }: { projects: ProjectCard[] }) {
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const CARD_WIDTH = 320 + 24;
  const items = [...projects, ...projects, ...projects];
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setOffset((prev) => { const next = prev + 0.6; return next >= CARD_WIDTH * projects.length ? 0 : next; });
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
            <Link key={`${project.id}-${i}`} href={`/projects/${project.slug}`}
              className="group flex-shrink-0 w-80 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
              <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {mainImage ? (
                  <Image src={`/uploads/projects/${mainImage.filename}`} alt={mainImage.alt ?? project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-100 dark:from-gray-800 dark:to-gray-700"><span className="text-5xl opacity-25">📦</span></div>
                )}
                <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm">View Project →</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{project.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{project.summary}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {techs.slice(0, 3).map((t) => <span key={t} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded text-xs font-medium">{t}</span>)}
                  {techs.length > 3 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded text-xs">+{techs.length - 3}</span>}
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>👁 {project.viewCount.toLocaleString()}</span><span>⏱ {project.readingTime} min</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Animated stat card ───────────────────────────────────────
function StatCounter({ end, label, suffix, trigger }: { end: number; label: string; suffix: string; trigger: boolean }) {
  const count = useCountUp(end, 1800, trigger);
  return (
    <div className="flex flex-col items-center py-8 px-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums">{count}{suffix}</span>
      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">{label}</span>
    </div>
  );
}

// ─── Tech orbit ───────────────────────────────────────────────
function TechOrbit({ items }: { items: string[] }) {
  return (
    <div className="relative flex items-center justify-center h-80 select-none">
      <div className="absolute z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
        <span className="text-white text-xs font-bold text-center leading-tight">EUGEN<br />STACK</span>
      </div>
      {[{ r: 90, speed: 22, slice: items.slice(0, 4) }, { r: 148, speed: 36, slice: items.slice(4, 9) }, { r: 200, speed: 50, slice: items.slice(9) }].map((ring, ri) => (
        <div key={ri} className="absolute rounded-full border border-dashed border-gray-200 dark:border-gray-700" style={{ width: ring.r * 2, height: ring.r * 2 }}>
          {ring.slice.map((tech, ti) => {
            const angle = (360 / ring.slice.length) * ti;
            const rad = (angle * Math.PI) / 180;
            const x = ring.r * Math.cos(rad - Math.PI / 2);
            const y = ring.r * Math.sin(rad - Math.PI / 2);
            return (
              <div key={tech} className="absolute" style={{ left: "50%", top: "50%", transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}>
                <div className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm whitespace-nowrap">
                  {tech}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Testimonial carousel ─────────────────────────────────────
function TestimonialCarousel({ items }: { items: typeof TESTIMONIALS }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);
  const item = items[idx];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 p-10 text-center min-h-[220px] flex flex-col items-center justify-center">
      <div className="text-yellow-300 text-xl mb-4 tracking-widest">★★★★★</div>
      <blockquote key={idx} className="text-white text-lg font-medium max-w-xl leading-relaxed mb-6" style={{ animation: "fadeUp 0.5s ease" }}>"{item.quote}"</blockquote>
      <div>
        <p className="text-blue-100 font-semibold">{item.author}</p>
        <p className="text-blue-200 text-sm">{item.role}</p>
      </div>
      <div className="flex gap-2 mt-6">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white w-5" : "bg-white/40"}`} aria-label={`Testimonial ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Deployment step modal ────────────────────────────────────
function DeploymentJourney() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-0">
        {DEPLOYMENT_STEPS.map((step, i) => (
          <React.Fragment key={step.name}>
            <button onClick={() => setActive(active === i ? null : i)}
              className={`group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200 w-full sm:w-auto min-w-[100px] ${active === i ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:shadow-md"}`}>
              <span className="text-2xl mb-1">{step.icon}</span>
              <span className="text-xs font-bold">{step.name}</span>
            </button>
            {i < DEPLOYMENT_STEPS.length - 1 && <div className="hidden sm:flex items-center text-gray-300 dark:text-gray-700 text-lg font-bold px-1">──►</div>}
          </React.Fragment>
        ))}
      </div>
      {active !== null && (
        <div className="mt-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40" style={{ animation: "fadeUp 0.3s ease" }}>
          <div className="flex items-center gap-2 mb-1"><span className="text-xl">{DEPLOYMENT_STEPS[active].icon}</span><span className="font-bold text-blue-700 dark:text-blue-300">{DEPLOYMENT_STEPS[active].name}</span></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{DEPLOYMENT_STEPS[active].detail}</p>
        </div>
      )}
    </div>
  );
}

// ─── Experience timeline (expects string dates) ─────────────────
function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) return null;
  return (
    <ol className="relative border-l-2 border-blue-200 dark:border-blue-900 ml-4">
      {experiences.map((exp) => {
        const start = new Date(exp.startDate).getFullYear();
        const end = exp.endDate ? new Date(exp.endDate).getFullYear() : "Present";
        return (
          <li key={exp.id} className="mb-10 ml-8">
            <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 border-2 border-white dark:border-gray-950 mt-1" />
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap gap-2 items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">{start} – {end}</span>
              </div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{exp.company}</p>
              {exp.description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{exp.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Certifications ───────────────────────────────────────────
function CertificationBadges({ certifications }: { certifications: Certification[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {certifications.map((cert) => (
        <a key={cert.id} href={cert.url ?? "#"} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 hover:shadow-md transition-all">
          <span className="text-lg">🏅</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{cert.name}</p>
            <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────
interface HomeClientProps {
  profile: ProfileData;
  featuredProjects: ProjectCard[];
  experiences: Experience[];
  certifications: Certification[];
}

export function HomeClient({ profile, featuredProjects, experiences, certifications }: HomeClientProps) {
  const statsSection = useInView(0.3);
  const showHireBanner = profile.status?.toLowerCase().includes("hire");

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes aurora1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px, -40px) scale(1.15); } }
        @keyframes aurora2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px, 30px) scale(1.1); } }
        @keyframes aurora3 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px, 50px) scale(1.08); } }
      `}</style>

      {showHireBanner && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center py-2.5 px-4 text-sm font-medium shadow-lg">
          🚀 Open to new opportunities —{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:text-blue-100">letlet's talkapos;s talk</Link>
        </div>
      )}

      <main className="overflow-x-hidden">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[100px]" style={{ animation: "aurora1 12s ease-in-out infinite" }} />
            <div className="absolute top-1/3 right-1/4 w-[440px] h-[440px] rounded-full bg-violet-400/20 dark:bg-violet-600/15 blur-[100px]" style={{ animation: "aurora2 16s ease-in-out infinite" }} />
            <div className="absolute bottom-1/4 left-1/3 w-[360px] h-[360px] rounded-full bg-cyan-400/15 dark:bg-cyan-600/10 blur-[100px]" style={{ animation: "aurora3 20s ease-in-out infinite" }} />
            <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg,currentColor 0,currentColor 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,currentColor 0,currentColor 1px,transparent 1px,transparent 48px)" }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 w-full">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="fade-up">
                <SectionLabel>Full-Stack · Cloud · AI</SectionLabel>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.05] tracking-tight">
                  EUGEN<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">CONSULTANCY</span>
                </h1>
                <p className="mt-5 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 min-h-[2rem]"><TypedText phrases={TYPED_PHRASES} /></p>
                <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">Intelligent digital solutions for businesses, institutions & startups — delivered with production-grade engineering and a bias for measurable impact.</p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link href="/projects" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">Explore Projects</Link>
                  <Link href="/contact" className="px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all hover:-translate-y-0.5">Schedule Consultation</Link>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">🔗 GitHub</a>}
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">💼 LinkedIn</a>}
                  {profile.twitter && <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">🐦 Twitter</a>}
                  <a href="/rss.xml" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all">📡 RSS</a>
                </div>
              </div>
              <div className="relative flex items-center justify-center float-y">
                <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-2xl" />
                {profile.picture ? (
                  <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-2xl">
                    <Image src={profile.picture} alt={profile.name} fill className="object-cover" priority sizes="288px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className="w-60 h-60 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl"><span className="text-7xl">👨‍💻</span></div>
                )}
                <span className="absolute bottom-2 right-2 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-900" />
                </span>
                {[{ tech: "Next.js", x: "-left-12", y: "top-6" }, { tech: "Django", x: "-right-12", y: "top-10" }, { tech: "AWS", x: "-left-10", y: "bottom-10" }, { tech: "Docker", x: "-right-10", y: "bottom-6" }].map(({ tech, x, y }) => (
                  <span key={tech} className={`absolute ${x} ${y} px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 shadow-lg`}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div ref={statsSection.ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s) => <StatCounter key={s.label} end={s.end} label={s.label} suffix={s.suffix} trigger={statsSection.inView} />)}
            </div>
          </div>
        </section>

        {/* Professional Identity */}
        <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Who we are</SectionLabel>
          <SectionHeading sub="The team behind the code, cloud, and strategy">Professional Identity</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl mb-4">👤</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Who We Are</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {["Full-Stack Engineer", "Cloud Architect", "Data & ML Practitioner", "White-Hat SEO Strategist", "Technical Consultant"].map(t => (
                  <li key={t} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xl mb-4">⚡</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">What We Specialise In</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {["Web & Mobile Development", "Cloud Deployment & DevOps", "AI & ML Integration", "Real-Time Systems (WebSockets)", "System Design & Architecture", "Technical SEO & Analytics"].map(t => (
                  <li key={t} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xl mb-4">🏭</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Industries Served</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Education", "Healthcare", "Agriculture", "FinTech", "Sports Analytics", "E-Commerce", "Research", "Government"].map(ind => (
                  <span key={ind} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">{ind}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-24 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionLabel>What we offer</SectionLabel>
            <SectionHeading sub="End-to-end engineering, deployment, and strategy">Featured Services</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((svc) => (
                <div key={svc.title} className={`group relative rounded-2xl border border-gray-100 dark:border-gray-800 ${svc.bg} p-6 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${svc.gradient}`} />
                  <div className="text-3xl mb-4">{svc.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{svc.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{svc.desc}</p>
                  <Link href="/contact" className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Learn more →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Carousel */}
        {featuredProjects.length > 0 && (
          <section className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
              <div className="flex items-end justify-between">
                <div>
                  <SectionLabel>Selected work</SectionLabel>
                  <SectionHeading sub="Hover to pause. Click to explore.">Featured Projects</SectionHeading>
                </div>
                <Link href="/projects" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 whitespace-nowrap mb-10">View all →</Link>
              </div>
            </div>
            <ProjectCarousel projects={featuredProjects} />
          </section>
        )}

        {/* Deployment Journey */}
        <section className="py-24 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionLabel>How we ship</SectionLabel>
            <SectionHeading sub="Click any step to learn more about the pipeline">From Code to Cloud</SectionHeading>
            <DeploymentJourney />
          </div>
        </section>

        {/* Technology Ecosystem */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <SectionLabel>Our stack</SectionLabel>
            <SectionHeading sub="An orbit of battle-tested technologies" center>Technology Ecosystem</SectionHeading>
            <TechOrbit items={TECH_ORBIT} />
          </div>
        </section>

        {/* Experience Timeline */}
        {experiences.length > 0 && (
          <section className="py-24 bg-gray-50 dark:bg-gray-950/60">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <SectionLabel>Career journey</SectionLabel>
              <SectionHeading sub="Roles, companies, and milestones">Experience</SectionHeading>
              <ExperienceTimeline experiences={experiences} />
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <SectionLabel>Credentials</SectionLabel>
              <SectionHeading sub="Verified professional training and certifications">Certifications</SectionHeading>
              <CertificationBadges certifications={certifications} />
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="py-24 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <SectionLabel>Client feedback</SectionLabel>
            <SectionHeading sub="What people say about working with us" center>Testimonials</SectionHeading>
            <TestimonialCarousel items={TESTIMONIALS} />
          </div>
        </section>

        {/* Availability */}
        {profile.availability && (
          <section className="py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <SectionLabel>Engagement model</SectionLabel>
              <SectionHeading sub="How and when we can engage">Availability</SectionHeading>
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-7">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{profile.availability}</p>
                <Link href="/contact" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">Get in touch →</Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-28 bg-gray-50 dark:bg-gray-950/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700" />
              <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 48px)" }} />
              <div className="relative text-center py-20 px-6">
                <p className="text-xs font-bold tracking-[0.2em] text-blue-200 uppercase mb-4">Ready to build?</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">Ready to Build Something<br className="hidden md:block" /> Amazing?</h2>
                <p className="text-blue-100 max-w-lg mx-auto mb-10 text-base leading-relaxed">Whether you need a scalable web platform, a cloud deployment strategy, or end-to-end technical consulting — let's discuss your project.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact" className="px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">Schedule Consultation</Link>
                  <Link href="/projects" className="px-8 py-3.5 border-2 border-white/50 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5">Browse Projects</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
