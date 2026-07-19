"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building2,
  Sparkles,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReactionType = "like" | "hot" | "insightful" | "bookmark";

type ReactionState = Record<ReactionType, { count: number; active: boolean }>;

type Props = {
  problem: string;
  approach: string;
  result: string;
  metrics: string;
  beforeImage?: string;
  afterImage?: string;
  // Hero / CTA props (optional – supply from project detail page)
  liveUrl?: string;
  githubUrl?: string;
  projectId?: number;
  // Gallery images (optional array of { src, alt })
  galleryImages?: { src: string; alt?: string }[];
  // KPI cards to show in the hero metric strip (max 4)
  heroKpis?: { label: string; value: string }[];
};

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 16 },
  },
};

const metricCardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  }),
};

// ─── Reaction emoji map ───────────────────────────────────────────────────────

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "hot", emoji: "🔥", label: "Hot" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "bookmark", emoji: "🔖", label: "Save" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Compact hero KPI strip – max 4 pills, single row */
function HeroKpis({ kpis }: { kpis: { label: string; value: string }[] }) {
  const shown = kpis.slice(0, 4);
  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((k) => (
        <div
          key={k.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
            {k.value}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            {k.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Live reaction buttons with optimistic updates */
function ReactionButtons({
  projectId,
  initialReactions,
}: {
  projectId?: number;
  initialReactions?: Partial<ReactionState>;
}) {
  const [state, setState] = useState<ReactionState>(() => {
    const defaults: ReactionState = {
      like: { count: 0, active: false },
      hot: { count: 0, active: false },
      insightful: { count: 0, active: false },
      bookmark: { count: 0, active: false },
    };
    if (initialReactions) {
      for (const key of Object.keys(initialReactions) as ReactionType[]) {
        if (initialReactions[key]) defaults[key] = initialReactions[key]!;
      }
    }
    return defaults;
  });

  const toggle = useCallback(
    async (type: ReactionType) => {
      // Optimistic update
      setState((prev) => ({
        ...prev,
        [type]: {
          count: prev[type].active ? prev[type].count - 1 : prev[type].count + 1,
          active: !prev[type].active,
        },
      }));

      // Fire-and-forget API call (adjust endpoint to your route)
      if (projectId) {
        try {
          await fetch(`/api/projects/${projectId}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type }),
          });
        } catch {
          // revert on error
          setState((prev) => ({
            ...prev,
            [type]: {
              count: prev[type].active ? prev[type].count - 1 : prev[type].count + 1,
              active: !prev[type].active,
            },
          }));
        }
      }
    },
    [projectId]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map(({ type, emoji, label }) => {
        const { count, active } = state[type];
        return (
          <motion.button
            key={type}
            onClick={() => toggle(type)}
            whileTap={{ scale: 0.88 }}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 select-none",
              active
                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 ring-2 ring-blue-300/40 dark:ring-blue-600/30"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
            ].join(" ")}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span>{label}</span>
            <span className={active ? "text-blue-500 dark:text-blue-400" : "text-gray-400"}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Swipeable gallery carousel (touch-friendly on mobile, grid on md+) */
function ImageGallery({ images }: { images: { src: string; alt?: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
  };

  if (images.length === 0) return null;

  return (
    <>
      {/* Mobile: snap carousel */}
      <div className="md:hidden relative">
        <div
          ref={trackRef}
          className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative h-56 cursor-pointer"
              onClick={() => setLightbox(current)}
            >
              <Image
                src={images[current].src}
                alt={images[current].alt ?? `Gallery image ${current + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="flex items-center justify-between mt-3 px-1">
            <button
              onClick={prev}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-blue-500 w-4" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop: masonry-style grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="relative h-44 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={img.src}
              alt={img.alt ?? `Gallery image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>
            {lightbox > 0 && (
              <button
                className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); setCurrent((lightbox - 1 + images.length) % images.length); setLightbox((lightbox - 1 + images.length) % images.length); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt ?? ""}
                fill
                className="object-contain"
              />
            </motion.div>
            {lightbox < images.length - 1 && (
              <button
                className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); setCurrent((lightbox + 1) % images.length); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Collapsible accordion section */
function Accordion({
  title,
  children,
  defaultOpen = true,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CaseStudySection({
  problem,
  approach,
  result,
  metrics,
  beforeImage,
  afterImage,
  liveUrl,
  githubUrl,
  projectId,
  galleryImages,
  heroKpis,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  // Sticky CTA bar visibility – show after scrolling past hero
  const heroRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const metricLines = metrics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return {
        label: key.trim(),
        value: rest.join(":").trim() || key.trim(),
        isPercentage: rest.join(":").trim().includes("%"),
      };
    });

  const toggleSection = (label: string) =>
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));

  const phases = [
    {
      number: "01",
      gradient: "from-red-500 to-rose-600",
      border: "border-red-100 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-700",
      bg: "from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20",
      icon: <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />,
      label: "Problem",
      labelColor: "text-red-600 dark:text-red-400",
      content: problem,
    },
    {
      number: "02",
      gradient: "from-blue-500 to-indigo-600",
      border: "border-blue-100 dark:border-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700",
      bg: "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
      icon: <Building2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      label: "Approach",
      labelColor: "text-blue-600 dark:text-blue-400",
      content: approach,
    },
    {
      number: "03",
      gradient: "from-emerald-500 to-green-600",
      border: "border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700",
      bg: "from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20",
      icon: <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      label: "Result",
      labelColor: "text-emerald-600 dark:text-emerald-400",
      content: result,
    },
  ];

  return (
    <>
      {/* ── Sticky CTA bar (desktop only, fades in after hero scrolls away) ── */}
      <AnimatePresence>
        {showStickyBar && (liveUrl || githubUrl) && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="hidden lg:flex fixed top-4 right-6 z-40 items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live demo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={sectionRef}
        className="mt-16 space-y-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* ── Hero KPI strip + CTA row (anchor for sticky bar sentinel) ── */}
        {(heroKpis?.length || liveUrl || githubUrl) && (
          <motion.div
            ref={heroRef}
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {heroKpis?.length ? <HeroKpis kpis={heroKpis} /> : <div />}
            {(liveUrl || githubUrl) && (
              <div className="flex items-center gap-2 shrink-0">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live demo
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Section header ── */}
        <motion.div variants={itemVariants}>
          <p className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-2">
            <span className="w-5 h-px bg-blue-500" />
            Case Study
            <span className="w-5 h-px bg-blue-500" />
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Project Breakdown
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-md">
            A clear walkthrough of the problem, our approach, and the measurable outcomes.
          </p>
        </motion.div>

        {/* ── Phase stepper (desktop: horizontal, mobile: vertical accordion) ── */}

        {/* Desktop horizontal */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <div className="relative">
            {/* connecting line */}
            <div className="absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-red-400 via-blue-400 to-emerald-400 opacity-40" />
            <div className="grid grid-cols-3 gap-6">
              {phases.map((phase) => (
                <motion.div
                  key={phase.label}
                  className="flex flex-col items-center text-center"
                  whileHover={{ y: -4 }}
                  onHoverStart={() => setActivePhase(phase.label)}
                  onHoverEnd={() => setActivePhase(null)}
                >
                  {/* badge */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-lg mb-4 relative z-10 transition-transform duration-200 ${activePhase === phase.label ? "scale-110" : ""}`}
                  >
                    <span className="text-white font-black text-xl">{phase.number}</span>
                  </div>
                  {/* card */}
                  <div
                    className={`w-full rounded-2xl border ${phase.border} bg-gradient-to-br ${phase.bg} p-5 transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      {phase.icon}
                      <h3 className={`text-sm font-black ${phase.labelColor}`}>{phase.label}</h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-5">
                      {phase.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile/tablet: vertical accordion */}
        <motion.div variants={itemVariants} className="lg:hidden space-y-3">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.label}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 }}
            >
              {/* step dot + line */}
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.gradient} flex items-center justify-center shadow-md`}
                >
                  <span className="text-white font-black text-sm">{phase.number}</span>
                </div>
                {index < phases.length - 1 && (
                  <div className="w-px flex-1 min-h-[2rem] bg-gray-200 dark:bg-gray-700 mt-2" />
                )}
              </div>

              {/* expandable card */}
              <div
                className={`flex-1 mb-3 rounded-2xl border ${phase.border} bg-gradient-to-br ${phase.bg} overflow-hidden`}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => toggleSection(phase.label)}
                >
                  <div className="flex items-center gap-2">
                    {phase.icon}
                    <span className={`text-sm font-bold ${phase.labelColor}`}>{phase.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${expandedSections[phase.label] ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {expandedSections[phase.label] !== false && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {phase.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 2-column grid: Tech Stack + Dependencies ── */}
        {/* (slot for parent to inject these via Accordion below) */}

        {/* ── Key metrics ── */}
        {metricLines.length > 0 && (
          <motion.div variants={itemVariants}>
            <Accordion
              title={
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Key metrics</span>
                </div>
              }
              defaultOpen
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {metricLines.map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={metricCardVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="group relative rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    whileHover={{ scale: 1.04 }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.isPercentage ? "from-emerald-500 to-green-500" : "from-blue-500 to-violet-500"} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    <p
                      className={`text-xl font-black tracking-tight ${item.isPercentage ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}
                    >
                      {item.value}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium leading-tight">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Accordion>
          </motion.div>
        )}

        {/* ── Before / After images ── */}
        {(beforeImage || afterImage) && (
          <motion.div variants={itemVariants}>
            <Accordion
              title={
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm">
                    ⚡
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Before vs after</span>
                </div>
              }
              defaultOpen
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beforeImage && (
                  <div className="relative h-52 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                    <Image src={beforeImage} alt="Before" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white rounded-lg text-[11px] font-bold">
                      Before
                    </span>
                  </div>
                )}
                {afterImage && (
                  <div className="relative h-52 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 group">
                    <Image src={afterImage} alt="After" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm text-white rounded-lg text-[11px] font-bold">
                      After
                    </span>
                  </div>
                )}
              </div>
            </Accordion>
          </motion.div>
        )}

        {/* ── Gallery ── */}
        {galleryImages && galleryImages.length > 0 && (
          <motion.div variants={itemVariants}>
            <Accordion
              title={
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm">
                    🖼️
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Gallery
                    <span className="ml-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                      ({galleryImages.length} image{galleryImages.length !== 1 ? "s" : ""})
                    </span>
                  </span>
                </div>
              }
              defaultOpen
            >
              <ImageGallery images={galleryImages} />
            </Accordion>
          </motion.div>
        )}

        {/* ── Reactions ── */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Found this useful? Leave a reaction.
          </p>
          <ReactionButtons projectId={projectId} />
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Re-export helpers for use in the project detail page ─────────────────────

/** Drop-in 2-column grid for Tech Stack + Dependencies sections */
export function TechDepsGrid({
  techStack,
  dependencies,
}: {
  techStack: React.ReactNode;
  dependencies: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      <Accordion
        title={
          <span className="text-sm font-bold text-gray-900 dark:text-white">Tech stack</span>
        }
        defaultOpen
      >
        {techStack}
      </Accordion>
      <Accordion
        title={
          <span className="text-sm font-bold text-gray-900 dark:text-white">Dependencies</span>
        }
        defaultOpen={false}
      >
        {dependencies}
      </Accordion>
    </div>
  );
}

/** Collapsible section for secondary content (Framework Rationale, etc.) */
export { Accordion };