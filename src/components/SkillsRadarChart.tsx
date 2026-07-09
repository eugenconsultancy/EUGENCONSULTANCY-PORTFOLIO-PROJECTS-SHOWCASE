"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";

type RadarData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
};

// --- Skill category color-coding & icons ---
const SKILL_META: Record<
  string,
  { color: string; glow: string; icon: string; category: string }
> = {
  React: { color: "#61DAFB", glow: "rgba(97,218,251,0.5)", icon: "⚛", category: "Frontend" },
  "Next.js": { color: "#FFFFFF", glow: "rgba(255,255,255,0.4)", icon: "▲", category: "Frontend" },
  TypeScript: { color: "#3178C6", glow: "rgba(49,120,198,0.5)", icon: "𝕋", category: "Language" },
  Python: { color: "#F7CA18", glow: "rgba(247,202,24,0.5)", icon: "🐍", category: "Language" },
  Node: { color: "#6CC24A", glow: "rgba(108,194,74,0.5)", icon: "⬡", category: "Backend" },
  "Node.js": { color: "#6CC24A", glow: "rgba(108,194,74,0.5)", icon: "⬡", category: "Backend" },
  Django: { color: "#44B78B", glow: "rgba(68,183,139,0.5)", icon: "🎸", category: "Backend" },
  PostgreSQL: { color: "#336791", glow: "rgba(51,103,145,0.5)", icon: "🐘", category: "Database" },
  Docker: { color: "#2496ED", glow: "rgba(36,150,237,0.5)", icon: "🐳", category: "DevOps" },
  AWS: { color: "#FF9900", glow: "rgba(255,153,0,0.5)", icon: "☁", category: "DevOps" },
  Redis: { color: "#FF4438", glow: "rgba(255,68,56,0.5)", icon: "⚡", category: "Database" },
  GraphQL: { color: "#E535AB", glow: "rgba(229,53,171,0.5)", icon: "◈", category: "API" },
  Tailwind: { color: "#38BDF8", glow: "rgba(56,189,248,0.5)", icon: "🌊", category: "Frontend" },
};

const DEFAULT_META = {
  color: "#818CF8",
  glow: "rgba(129,140,248,0.5)",
  icon: "◉",
  category: "Other",
};

function getMeta(label: string) {
  return SKILL_META[label] ?? DEFAULT_META;
}

// Proficiency label bands
function proficiencyLabel(value: number) {
  if (value >= 90) return { label: "Expert", stars: 5 };
  if (value >= 75) return { label: "Advanced", stars: 4 };
  if (value >= 60) return { label: "Proficient", stars: 3 };
  if (value >= 45) return { label: "Developing", stars: 2 };
  return { label: "Beginner", stars: 1 };
}

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Record<string, string | number>; value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  const { payload: data, value } = payload[0];
  const label = data.label as string;
  const meta = getMeta(label);
  const { label: profLabel, stars } = proficiencyLabel(value);

  return (
    <div
      style={{
        background: "rgba(15,15,30,0.92)",
        border: `1px solid ${meta.color}55`,
        boxShadow: `0 0 20px ${meta.glow}, 0 4px 24px rgba(0,0,0,0.6)`,
        backdropFilter: "blur(16px)",
        borderRadius: "14px",
        padding: "14px 18px",
        minWidth: "160px",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "1.25rem" }}>{meta.icon}</span>
        <span style={{ color: meta.color, fontWeight: 700, fontSize: "0.9rem" }}>{label}</span>
      </div>
      <div style={{ color: "#e2e8f0", fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>
        {value}%
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              color: i < stars ? meta.color : "#334155",
              fontSize: "0.75rem",
              filter: i < stars ? `drop-shadow(0 0 4px ${meta.glow})` : "none",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <div style={{ color: "#94a3b8", fontSize: "0.7rem", marginTop: 4 }}>
        {profLabel} · {meta.category}
      </div>
    </div>
  );
};

// Custom polar axis tick (with icon)
const CustomTick = ({
  x,
  y,
  payload,
  activeLabel,
  onHover,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  activeLabel: string | null;
  onHover: (label: string | null) => void;
}) => {
  const label = payload?.value ?? "";
  const meta = getMeta(label);
  const isActive = activeLabel === label;

  return (
    <g
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {isActive && (
        <circle
          cx={x}
          cy={y}
          r={22}
          fill={meta.color}
          fillOpacity={0.08}
          stroke={meta.color}
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      )}
      <text
        x={x}
        y={(y ?? 0) - 10}
        textAnchor="middle"
        fill={isActive ? meta.color : "#94a3b8"}
        fontSize={16}
        style={{
          transition: "all 0.2s",
          filter: isActive ? `drop-shadow(0 0 6px ${meta.glow})` : "none",
        }}
      >
        {meta.icon}
      </text>
      <text
        x={x}
        y={(y ?? 0) + 6}
        textAnchor="middle"
        fill={isActive ? meta.color : "#64748b"}
        fontSize={11}
        fontWeight={isActive ? 700 : 500}
        letterSpacing="0.03em"
        style={{ transition: "all 0.2s" }}
      >
        {label}
      </text>
    </g>
  );
};

export function SkillsRadarChart({ json }: { json: string }) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  if (!json) return null;

  let data: RadarData;
  try {
    data = JSON.parse(json);
  } catch {
    return <p className="text-red-500">Invalid radar data.</p>;
  }

  const chartData = data.labels.map((label, index) => {
    const obj: Record<string, string | number> = { label };
    data.datasets.forEach((ds) => {
      obj[ds.label] = ds.data[index] || 0;
    });
    return obj;
  });

  const dataset = data.datasets[0];
  // Group skills by category for the legend
  const categoryGroups: Record<
    string,
    { label: string; value: number; meta: typeof DEFAULT_META }[]
  > = {};
  data.labels.forEach((label, i) => {
    const meta = getMeta(label);
    const cat = meta.category;
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push({ label, value: dataset.data[i] ?? 0, meta });
  });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(20,10,40,0.95) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "24px",
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <h3
        style={{
          textAlign: "center",
          color: "#e2e8f0",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "8px",
          opacity: 0.6,
        }}
      >
        Technical Proficiency
      </h3>

      {/* SVG defs for gradient fill */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#312E81" stopOpacity="0.05" />
          </radialGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={420}>
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid
            stroke="#1e293b"
            strokeWidth={1}
            strokeDasharray="4 4"
            gridType="circle"
          />
          <PolarAngleAxis
            dataKey="label"
            tick={(props) => {
              const { x, y, ...restProps } = props;
              return (
                <CustomTick
                  {...restProps}
                  x={Number(x)} // Ensure it's a number
                  y={Number(y)} // Ensure it's a number
                  activeLabel={activeLabel}
                  onHover={setActiveLabel}
                />
              );
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name={dataset.label}
            dataKey={dataset.label}
            stroke="#818CF8"
            fill="url(#radarGradient)"
            fillOpacity={1}
            strokeWidth={2}
            strokeLinejoin="round"
            animationBegin={0}
            animationDuration={1200}
            dot={(props) => {
              const cx = props.cx ?? 0;
              const cy = props.cy ?? 0;
              const index = props.index ?? 0;
              const label = data.labels[index];
              const meta = getMeta(label);
              const isActive = activeLabel === label;
              return (
                <g key={`dot-${index}`}>
                  {isActive && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill={meta.color}
                      fillOpacity={0.2}
                      stroke={meta.color}
                      strokeOpacity={0.5}
                      strokeWidth={1}
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 5 : 4}
                    fill={meta.color}
                    stroke="rgba(15,15,30,0.9)"
                    strokeWidth={2}
                    style={{
                      filter: `drop-shadow(0 0 ${isActive ? 8 : 4}px ${meta.glow})`,
                      transition: "all 0.2s",
                    }}
                  />
                </g>
              );
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Grouped skill legend */}
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {Object.entries(categoryGroups).map(([category, skills]) => (
          <div key={category}>
            <p
              style={{
                color: "#475569",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {category}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.map(({ label, value, meta }) => {
                const isActive = activeLabel === label;
                return (
                  <button
                    key={label}
                    onMouseEnter={() => setActiveLabel(label)}
                    onMouseLeave={() => setActiveLabel(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: isActive
                        ? `linear-gradient(135deg, ${meta.color}22, ${meta.color}11)`
                        : "rgba(30,41,59,0.7)",
                      border: `1px solid ${isActive ? meta.color + "60" : "rgba(51,65,85,0.8)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: isActive ? `0 0 12px ${meta.glow}` : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem" }}>{meta.icon}</span>
                    <span
                      style={{
                        color: isActive ? meta.color : "#94a3b8",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        letterSpacing: "0.02em",
                        transition: "color 0.2s",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color: isActive ? meta.color : "#475569",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        transition: "color 0.2s",
                      }}
                    >
                      {value}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle footer */}
      <p
        style={{
          textAlign: "center",
          color: "#334155",
          fontSize: "0.65rem",
          marginTop: "20px",
          letterSpacing: "0.1em",
        }}
      >
        Hover a skill to inspect
      </p>
    </div>
  );
}