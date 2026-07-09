"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertCircle, Wrench, TrendingUp, ArrowUpRight, ChevronDown, ChevronUp, AlertTriangle, Building2, Sparkles } from "lucide-react";

type Props = {
  problem: string;
  approach: string;
  result: string;
  metrics: string;
  beforeImage?: string;
  afterImage?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const metricCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
    },
  }),
};

export function CaseStudySection({
  problem,
  approach,
  result,
  metrics,
  beforeImage,
  afterImage,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const phases = [
    {
      number: "01",
      dot: "from-red-500 to-rose-600",
      border: "border-red-100 dark:border-red-900/40 hover:border-red-300 dark:hover:border-red-700",
      bg: "from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20",
      icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />,
      emoji: "🚨",
      label: "Problem",
      color: "text-red-600 dark:text-red-400",
      glow: "group-hover:shadow-red-500/20",
      content: problem,
      accentDot: "bg-red-500",
    },
    {
      number: "02",
      dot: "from-blue-500 to-indigo-600",
      border: "border-blue-100 dark:border-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700",
      bg: "from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20",
      icon: <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      emoji: "🛠️",
      label: "Approach",
      color: "text-blue-600 dark:text-blue-400",
      glow: "group-hover:shadow-blue-500/20",
      content: approach,
      accentDot: "bg-blue-500",
    },
    {
      number: "03",
      dot: "from-green-500 to-emerald-600",
      border: "border-green-100 dark:border-green-900/40 hover:border-green-300 dark:hover:border-green-700",
      bg: "from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20",
      icon: <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />,
      emoji: "✨",
      label: "Result",
      color: "text-green-600 dark:text-green-400",
      glow: "group-hover:shadow-green-500/20",
      content: result,
      accentDot: "bg-green-500",
    },
  ];

  return (
    <motion.div
      ref={sectionRef}
      className="mt-20 space-y-14"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-3">
          <span className="w-6 h-px bg-blue-500" />
          Case Study
          <span className="w-6 h-px bg-blue-500" />
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Project Breakdown
        </h2>
        <p className="mt-2.5 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          A clear walkthrough of the problem, our approach, and the measurable outcomes.
        </p>
      </motion.div>

      {/* Desktop: Horizontal Stepper */}
      <motion.div
        variants={itemVariants}
        className="hidden lg:block"
      >
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 opacity-50" />
          </div>

          <div className="grid grid-cols-3 gap-8">
            {phases.map((phase) => (
              <motion.div
                key={phase.label}
                className="relative flex flex-col items-center text-center"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setActivePhase(phase.label)}
                onHoverEnd={() => setActivePhase(null)}
              >
                {/* Number badge */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.dot} flex items-center justify-center shadow-lg mb-4 relative z-10 transition-all duration-300 ${activePhase === phase.label ? 'scale-110' : ''}`}>
                  <span className="text-white font-black text-xl">{phase.number}</span>
                  {activePhase === phase.label && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${phase.dot} opacity-75 blur-xl -z-10`} />
                  )}
                </div>

                {/* Content card */}
                <div className={`w-full rounded-2xl border ${phase.border} bg-gradient-to-br ${phase.bg} p-6 transition-all duration-300 hover:-translate-y-1 ${phase.glow} hover:shadow-xl`}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl">{phase.emoji}</span>
                    <h3 className={`text-lg font-black ${phase.color}`}>{phase.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">
                    {phase.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tablet: Vertical Stepper */}
      <motion.div
        variants={itemVariants}
        className="hidden md:block lg:hidden"
      >
        <div className="space-y-0">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.label}
              className="flex items-start gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2 }}
            >
              {/* Step number with vertical line */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.dot} flex items-center justify-center shadow-lg mb-2`}>
                  <span className="text-white font-black text-lg">{phase.number}</span>
                </div>
                {index < phases.length - 1 && (
                  <div className="w-0.5 h-20 bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800" />
                )}
              </div>

              {/* Content */}
              <motion.div
                className={`flex-1 rounded-2xl border ${phase.border} bg-gradient-to-br ${phase.bg} p-6 mb-8 transition-all duration-300 hover:-translate-y-1 ${phase.glow} hover:shadow-xl`}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setActivePhase(phase.label)}
                onHoverEnd={() => setActivePhase(null)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{phase.emoji}</span>
                  <h3 className={`text-lg font-black ${phase.color}`}>{phase.label}</h3>
                </div>
                <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${!expandedSections[phase.label] ? 'line-clamp-3' : ''}`}>
                  {phase.content}
                </p>
                {phase.content.length > 150 && (
                  <button
                    onClick={() => toggleSection(phase.label)}
                    className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    {expandedSections[phase.label] ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Read More
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile: Numbered Stepper */}
      <motion.div
        variants={itemVariants}
        className="md:hidden space-y-6"
      >
        {phases.map((phase, index) => (
          <motion.div
            key={phase.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleSection(phase.label)}
          >
            {/* Number header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.dot} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-black">{phase.number}</span>
              </div>
              <div className={`h-0.5 flex-1 bg-gradient-to-r ${phase.dot}`} />
              <div className="flex items-center gap-2">
                <span className="text-xl">{phase.emoji}</span>
                <h3 className={`text-base font-black ${phase.color}`}>{phase.label}</h3>
              </div>
            </div>

            {/* Expandable content */}
            <motion.div
              className={`rounded-2xl border ${phase.border} bg-gradient-to-br ${phase.bg} p-5 transition-all duration-300 cursor-pointer ${expandedSections[phase.label] ? 'shadow-lg ' + phase.glow : ''}`}
              animate={{
                height: expandedSections[phase.label] ? "auto" : "80px",
              }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
            >
              <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${!expandedSections[phase.label] ? 'line-clamp-2' : ''}`}>
                {phase.content}
              </p>
              <div className="flex justify-center mt-2">
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedSections[phase.label] ? "rotate-180" : ""
                    }`}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Metrics dashboard */}
      {metricLines.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white">
              Key Metrics
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricLines.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={metricCardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="group relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring" as const, stiffness: 400, damping: 10 },
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.isPercentage ? 'from-green-500/10 to-emerald-500/10' :
                      'from-blue-500/10 to-violet-500/10'
                    }`} />
                </div>

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.isPercentage ? 'from-green-600 to-emerald-600' :
                    'from-blue-600 to-violet-600'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

                <div className="relative">
                  <p className={`text-2xl font-black tracking-tight ${item.isPercentage ? 'text-green-600 dark:text-green-400' :
                      'text-gray-900 dark:text-white'
                    }`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-tight">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Before / After */}
      {(beforeImage || afterImage) && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white">
              Before vs After
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {beforeImage && (
              <motion.div
                className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 h-64 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Image
                  src={beforeImage}
                  alt="Before"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-red-500/90 backdrop-blur-sm text-white rounded-xl text-xs font-bold shadow-lg">
                    Before
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">Click to expand</p>
                </div>
              </motion.div>
            )}
            {afterImage && (
              <motion.div
                className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 h-64 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              >
                <Image
                  src={afterImage}
                  alt="After"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white rounded-xl text-xs font-bold shadow-lg">
                    After
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">Click to expand</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}