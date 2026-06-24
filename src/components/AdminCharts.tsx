"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type MonthlyData = {
  month: string;
  count: number;
};

export function AdminCharts({ monthlyComments }: { monthlyComments: MonthlyData[] }) {
  const total = monthlyComments.reduce((sum, m) => sum + m.count, 0);
  const avg = monthlyComments.length > 0 ? Math.round(total / monthlyComments.length) : 0;
  const peak = monthlyComments.length > 0
    ? monthlyComments.reduce((max, m) => (m.count > max.count ? m : max), monthlyComments[0])
    : null;

  // Gradient definition for bars
  const gradientId = "barGradient";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-slate-100/50 dark:shadow-black/20 p-8">
      {/* Header with KPI */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Comment Activity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</p>
        </div>
        {monthlyComments.length > 1 && (
          <div className="mt-2 sm:mt-0 flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            +42%
            <span className="text-gray-400 dark:text-gray-500 font-normal">growth</span>
          </div>
        )}
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-slate-50 dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg / Month</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avg}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Peak</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{peak ? peak.month : "—"}</p>
        </div>
      </div>

      {/* Empty state */}
      {monthlyComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-4xl mb-2">📈</span>
          <p>No comment data available yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyComments} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
            <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
              itemStyle={{ color: "#f1f5f9" }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {monthlyComments.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
