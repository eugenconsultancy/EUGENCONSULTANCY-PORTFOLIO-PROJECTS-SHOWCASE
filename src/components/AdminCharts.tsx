"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  Eye,
  MessageSquare,
  ThumbsUp,
  Star,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
type MonthlyData = {
  month: string;
  count: number;
};

type ReactionDist = {
  type: string;
  count: number;
};

type Activity = {
  id: string;
  type: "comment" | "reaction" | "view";
  projectTitle: string;
  projectSlug: string;
  detail: string;
  date: string;
};

type Props = {
  monthlyComments: MonthlyData[];
  totalViews: number;
  totalComments: number;
  totalReactions: number;
  topProject: { title: string; slug: string; views: number } | null;
  topProjectsByViews: { title: string; slug: string; views: number }[];
  reactionDistribution: ReactionDist[];
  recentActivity: Activity[];
};

// ── Sub‑components ───────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/60 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
          {value}
        </p>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
            <span className={`text-xs font-semibold ${changeType === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const { month, count } = payload[0].payload;
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/90 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-gray-400">{month}</p>
      <p className="text-lg font-bold text-white">{count} comments</p>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export function AdminCharts({
  monthlyComments,
  totalViews,
  totalComments,
  totalReactions,
  topProject,
  topProjectsByViews,
  reactionDistribution,
  recentActivity,
}: Props) {
  const avgComments =
    monthlyComments.length > 0
      ? Math.round(totalComments / monthlyComments.length)
      : 0;
  const peakComment =
    monthlyComments.length > 0
      ? monthlyComments.reduce((max, m) => (m.count > max.count ? m : max), monthlyComments[0])
      : null;

  const barGradientId = "barGradient";
  const reactionColors = ["#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb923c"];

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Eye}
          label="Total Views"
          value={totalViews.toLocaleString()}
        />
        <KpiCard
          icon={MessageSquare}
          label="Total Comments"
          value={totalComments}
        />
        <KpiCard
          icon={ThumbsUp}
          label="Total Reactions"
          value={totalReactions.toLocaleString()}
        />
        <KpiCard
          icon={Star}
          label="Top Project"
          value={topProject ? `${topProject.title} (${topProject.views} views)` : "—"}
          change={topProject ? "View" : undefined}
          changeType="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects by Views */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-blue-500" />
            Most Viewed Projects
          </h3>
          {topProjectsByViews.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={topProjectsByViews.slice(0, 6)}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="title"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="views" radius={[6, 6, 0, 0]} fill={`url(#${barGradientId})`} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Reaction Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-blue-500" />
            Reaction Breakdown
          </h3>
          {reactionDistribution.length === 0 ? (
            <p className="text-sm text-gray-500">No reactions yet.</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={reactionDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {reactionDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={reactionColors[index % reactionColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-sm">
                {reactionDistribution.map((item, idx) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: reactionColors[idx % reactionColors.length] }}
                    />
                    <span className="text-gray-600 dark:text-gray-300 capitalize">{item.type}</span>
                    <span className="ml-auto font-semibold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Comment Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Comment Activity
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{totalComments}</p>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-500">Avg / month</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{avgComments}</p>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <p className="text-xs text-gray-500">Peak</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {peakComment ? `${peakComment.month} (${peakComment.count})` : "—"}
            </p>
          </div>
        </div>
        {monthlyComments.length === 0 ? (
          <p className="text-sm text-gray-500">No comment data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={monthlyComments}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="commentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#commentGrad)" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          Recent Activity
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.slice(0, 8).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 w-2 h-2 rounded-full ${act.type === "comment"
                      ? "bg-blue-500"
                      : act.type === "reaction"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-gray-600 dark:text-gray-300">
                    {act.type === "comment"
                      ? "New comment on"
                      : act.type === "reaction"
                        ? "Reaction on"
                        : "View on"}{" "}
                    <Link
                      href={`/projects/${act.projectSlug}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {act.projectTitle}
                    </Link>
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{act.detail}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {act.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}