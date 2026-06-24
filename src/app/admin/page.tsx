import { db } from "@/lib/db";
import { AdminCharts } from "@/components/AdminCharts";
import { Eye, MessageSquare, Mail, TrendingUp, Plus, Settings } from "lucide-react";
import Link from "next/link";

type CommentRecord = {
  createdAt: Date;
};

export default async function AdminDashboard() {
  const projectsCount = await db.project.count();
  const pendingComments = await db.comment.count({ where: { status: "PENDING" } });
  const unreadInquiries = await db.inquiry.count({ where: { isRead: false } });
  const totalViews = (await db.project.aggregate({ _sum: { viewCount: true } }))._sum.viewCount || 0;

  // Monthly comments
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
    const key = months[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
  });
  const monthlyComments: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = months[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    monthlyComments.push({ month: key, count: monthlyMap.get(key) || 0 });
  }

  // Recent activity
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
      time: inq.createdAt,
    })),
    ...recentComments.map((com) => ({
      type: "comment" as const,
      title: `New comment awaiting approval`,
      time: com.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -top-8 h-72 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
            Good Morning 👋
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Here's a quick overview of your portfolio today.
          </p>
        </div>
      </div>

      {/* KPI Cards with icons and trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Views</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            +12% this month
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Projects</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{projectsCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingComments}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Unread</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{unreadInquiries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity.</p>
              )}
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    item.type === "inquiry" ? "bg-blue-500" : "bg-amber-500"
                  }`} />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.title}</p>
                    <p className="text-xs text-gray-400">{new Date(item.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <AdminCharts monthlyComments={monthlyComments} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
                <Plus className="w-4 h-4" /> New Project
              </Link>
              <Link href="/admin/comments" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
                <MessageSquare className="w-4 h-4" /> Moderate Comments
              </Link>
              <Link href="/admin/analytics" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition">
                <TrendingUp className="w-4 h-4" /> View Analytics
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <Settings className="w-4 h-4" /> Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
