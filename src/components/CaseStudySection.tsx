"use client";

import Image from "next/image";
import { AlertCircle, Wrench, TrendingUp, ArrowUpRight } from "lucide-react";

type Props = {
  problem: string;
  approach: string;
  result: string;
  metrics: string;
  beforeImage?: string;
  afterImage?: string;
};

export function CaseStudySection({
  problem,
  approach,
  result,
  metrics,
  beforeImage,
  afterImage,
}: Props) {
  const metricLines = metrics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return {
        label: key.trim(),
        value: rest.join(":").trim() || key.trim(),
      };
    });

  const phases = [
    {
      dot: "bg-red-500",
      border: "border-red-100 dark:border-red-900/40",
      bg: "from-red-50/80 dark:from-red-950/20",
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      label: "Problem",
      color: "text-red-600 dark:text-red-400",
      content: problem,
    },
    {
      dot: "bg-blue-500",
      border: "border-blue-100 dark:border-blue-900/40",
      bg: "from-blue-50/80 dark:from-blue-950/20",
      icon: <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      label: "Approach",
      color: "text-blue-600 dark:text-blue-400",
      content: approach,
    },
    {
      dot: "bg-green-500",
      border: "border-green-100 dark:border-green-900/40",
      bg: "from-green-50/80 dark:from-green-950/20",
      icon: <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />,
      label: "Result",
      color: "text-green-600 dark:text-green-400",
      content: result,
    },
  ];

  return (
    <div className="mt-20 space-y-14">

      {/* Header */}
      <div className="text-center">
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
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-gray-100 dark:border-gray-800 pl-8 ml-4 space-y-8">
        {phases.map((phase) => (
          <div key={phase.label} className="relative">
            <div className={`absolute -left-[2.15rem] top-6 w-4 h-4 rounded-full ${phase.dot} border-2 border-white dark:border-gray-950 shadow-md`} />
            <div className={`rounded-2xl border ${phase.border} bg-gradient-to-r ${phase.bg} to-transparent dark:to-transparent p-7`}>
              <div className="flex items-center gap-2.5 mb-3">
                {phase.icon}
                <h3 className={`text-lg font-black ${phase.color}`}>{phase.label}</h3>
              </div>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {phase.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics dashboard */}
      {metricLines.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-base font-black text-gray-900 dark:text-white mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricLines.map((item, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before / After */}
      {(beforeImage || afterImage) && (
        <div>
          <h4 className="flex items-center gap-2 text-base font-black text-gray-900 dark:text-white mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/25">
              <span className="text-white text-xs">⚡</span>
            </div>
            Before vs After
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {beforeImage && (
              <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 h-64">
                <Image
                  src={beforeImage}
                  alt="Before"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg">
                    Before
                  </span>
                </div>
              </div>
            )}
            {afterImage && (
              <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 h-64">
                <Image
                  src={afterImage}
                  alt="After"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg">
                    After
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}