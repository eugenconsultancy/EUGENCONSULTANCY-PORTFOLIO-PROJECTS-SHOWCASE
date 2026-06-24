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
  // Parse metrics into an array of key‑value pairs
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

  return (
    <div className="mt-16 space-y-12">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
          Case Study
        </p>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Project Breakdown
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Problem → Approach → Result
        </p>
      </div>

      {/* Timeline cards */}
      <div className="relative border-l-2 border-blue-200 dark:border-blue-800 pl-8 space-y-10 ml-4">
        {/* Problem */}
        <div className="relative">
          <div className="absolute -left-[2.15rem] top-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-950" />
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 dark:to-transparent border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Problem</h3>
            </div>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{problem}</p>
          </div>
        </div>

        {/* Approach */}
        <div className="relative">
          <div className="absolute -left-[2.15rem] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950" />
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">Approach</h3>
            </div>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{approach}</p>
          </div>
        </div>

        {/* Result */}
        <div className="relative">
          <div className="absolute -left-[2.15rem] top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-950" />
          <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent border border-green-100 dark:border-green-900/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Result</h3>
            </div>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{result}</p>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {metricLines.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricLines.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before / After comparison */}
      {(beforeImage || afterImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beforeImage && (
            <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
              <Image
                src={beforeImage}
                alt="Before"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                  Before
                </span>
              </div>
            </div>
          )}
          {afterImage && (
            <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
              <Image
                src={afterImage}
                alt="After"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  After
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
