import { db } from "@/lib/db";
import { AdminCharts } from "@/components/AdminCharts";
import {
  Eye,
  MessageSquare,
  Mail,
  TrendingUp,
  Plus,
  Settings,
  FolderOpen,
  Activity,
  ArrowUpRight,
  Clock,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

type CommentRecord = {
  createdAt: Date;
};

export default async function AdminDashboard() {
  const projectsCount = await db.project.count();
  const servicesCount = await db.service.count();
  const pendingComments = await db.comment.count({ where: { status: "PENDING" } });
  const unreadInquiries = await db.inquiry.count({ where: { isRead: false } });
  const totalViews =
    (await db.project.aggregate({ _sum: { viewCount: true } }))._sum.viewCount || 0;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const comments: CommentRecord[] = await db.comment.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = new Map<string, number>();
  comments.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
  });

  const monthlyComments: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyComments.push({ month: key, count: monthlyMap.get(key) || 0 });
  }

  const recentInquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const recentComments = await db.comment.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const recentActivity = [
    ...recentInquiries.map((inq) => ({
      type: "inquiry" as const,
      title: `New inquiry from ${inq.name}`,
      sub: inq.email,
      time: inq.createdAt,
    })),
    ...recentComments.map(() => ({
      type: "comment" as const,
      title: "New comment awaiting approval",
      sub: "Pending moderation",
      time: new Date(),
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      trend: "+12% this month",
      trendUp: true,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      accent: "from-blue-500/10 to-transparent dark:from-blue-500/5",
    },
    {
      label: "Projects",
      value: String(projectsCount),
      icon: <FolderOpen className="w-5 h-5" />,
      trend: "Published",
      trendUp: true,
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      accent: "from-violet-500/10 to-transparent dark:from-violet-500/5",
    },
    {
      label: "Services",
      value: String(servicesCount),
      icon: <Briefcase className="w-5 h-5" />,
      trend: "Active services",
      trendUp: true,
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      accent: "from-cyan-500/10 to-transparent dark:from-cyan-500/5",
    },
    {
      label: "Pending Comments",
      value: String(pendingComments),
      icon: <MessageSquare className="w-5 h-5" />,
      trend: pendingComments > 0 ? "Needs review" : "All clear",
      trendUp: pendingComments === 0,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      accent: "from-amber-500/10 to-transparent dark:from-amber-500/5",
    },
    {
      label: "Unread Inquiries",
      value: String(unreadInquiries),
      icon: <Mail className="w-5 h-5" />,
      trend: unreadInquiries > 0 ? "Awaiting reply" : "All read",
      trendUp: unreadInquiries === 0,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accent: "from-emerald-500/10 to-transparent dark:from-emerald-500/5",
    },
  ];

  const quickActions = [
    {
      href: "/admin/projects/new",
      icon: <Plus className="w-4 h-4" />,
      label: "New Project",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-300",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/40",
    },
    {
      href: "/admin/services/new",
      icon: <Briefcase className="w-4 h-4" />,
      label: "New Service",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-700 dark:text-cyan-300",
      hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/40",
    },
    {
      href: "/admin/comments",
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Moderate Comments",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-300",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
    },
    {
      href: "/admin/analytics",
      icon: <TrendingUp className="w-4 h-4" />,
      label: "View Analytics",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Profile Settings",
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      hover: "hover:bg-gray-200 dark:hover:bg-gray-700",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-black tracking-[0.18em] text-blue-600 dark:text-blue-400 uppercase mb-2">
              <span className="w-4 h-px bg-blue-500" />
              Good Morning 👋
            </p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome back, Admin
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Here's a quick overview of your portfolio today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Briefcase className="w-4 h-4" />
              New Service
            </Link>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                  {card.icon}
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{card.value}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${card.trendUp ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/80 flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Recent Activity
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Last 5 events</span>
          </div>
          <div className="p-4">
            {recentActivity.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">No recent activity.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {recentActivity.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type === "inquiry" ? "bg-blue-500" : "bg-amber-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                      {"sub" in item && item.sub && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{item.sub}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/80">
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${action.bg} ${action.text} ${action.hover} text-sm font-semibold transition-all duration-200 group hover:-translate-y-0.5`}
              >
                {action.icon}
                {action.label}
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────── */}
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Comment Activity
          </h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Last 6 months</span>
        </div>
        <AdminCharts monthlyComments={monthlyComments} />
      </div>

    </div>
  );
}