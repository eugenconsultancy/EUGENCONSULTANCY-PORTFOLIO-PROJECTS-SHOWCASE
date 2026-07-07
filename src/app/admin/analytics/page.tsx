import { db } from "@/lib/db";
import Card from "@/components/Card";
import { ClicksAreaChart } from "@/components/ClicksAreaChart";

export default async function AnalyticsPage() {
  const projects = await db.project.findMany({
    select: { id: true, title: true, viewCount: true, _count: { select: { clicks: true } } },
    orderBy: { viewCount: "desc" },
  });

  const totalViews = projects.reduce((sum, p) => sum + p.viewCount, 0);
  const totalClicks = projects.reduce((sum, p) => sum + p._count.clicks, 0);
  const totalInquiries = await db.inquiry.count();

  const topProject = projects.length > 0 ? projects[0] : null;

  // Monthly clicks
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const clicks = await db.projectClick.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyClicks: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthNames[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    monthlyClicks.push({ month: key, count: 0 });
  }
  clicks.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = monthNames[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    const entry = monthlyClicks.find((e) => e.month === key);
    if (entry) entry.count++;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
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
            <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">Admin</p>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Track portfolio growth and visitor engagement.</p>
          </div>
        </div>
        {/* Date filters */}
        <div className="flex gap-2">
          {["Today", "7d", "30d", "90d", "All"].map((period) => (
            <button
              key={period}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Total Views" value={totalViews} />
        <Card title="Link Clicks" value={totalClicks} />
        <Card title="Inquiries" value={totalInquiries} />
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col justify-center">
          <p className="text-xs text-gray-500">CTR</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0"}%
          </p>
        </div>
      </div>

      {/* Top performing project */}
      {topProject && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {topProject.title.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Best Project</p>
              <h3 className="text-xl font-bold text-gray-900">{topProject.title}</h3>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-blue-600">{topProject.viewCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">views</p>
            </div>
          </div>
        </div>
      )}

      {/* Clicks Chart */}
      <ClicksAreaChart data={monthlyClicks} />

      {/* Project table */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">CTR</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const ctr = project.viewCount > 0 ? ((project._count.clicks / project.viewCount) * 100).toFixed(1) : "0";
                const maxViews = projects[0]?.viewCount || 1;
                const engagement = Math.round((project.viewCount / maxViews) * 100);
                const status = engagement > 70 ? "🔥 Trending" : engagement > 30 ? "📈 Growing" : "⚪ Stable";
                return (
                  <tr key={project.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{project.title}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{project.viewCount.toLocaleString()}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{project._count.clicks.toLocaleString()}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{ctr}%</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
