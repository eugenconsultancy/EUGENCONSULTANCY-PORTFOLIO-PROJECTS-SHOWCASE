"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type RadarData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
};

export function SkillsRadarChart({ json }: { json: string }) {
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

  return (
    <div className="w-full max-w-lg mx-auto">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
          <PolarAngleAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name={dataset.label}
            dataKey={dataset.label}
            stroke={dataset.borderColor || "#6366f1"}
            fill={dataset.backgroundColor || "rgba(99,102,241,0.25)"}
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {data.labels.map((label, index) => {
          const value = data.datasets[0]?.data[index];
          return (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: dataset.borderColor || "#6366f1" }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <span className="text-gray-500 dark:text-gray-400">{value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
