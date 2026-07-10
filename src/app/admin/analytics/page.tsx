import { db } from "@/lib/db";
import { ClicksAreaChart } from "@/components/ClicksAreaChart";
import { ComparisonLineChart } from "@/components/ComparisonLineChart";

// ── helpers ────────────────────────────────────────────────────
type Period = "today" | "7d" | "30d" | "90d" | "all";

function getDateRange(period: Period) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let start: Date;

  switch (period) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "7d":
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(0);
      break;
  }
  return { start, end };
}

function getPreviousPeriod(start: Date, end: Date): { start: Date; end: Date } {
  const duration = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - duration),
    end: new Date(end.getTime() - duration),
  };
}

type GroupedView = { createdAt: Date; _count: number };

// ── page component ─────────────────────────────────────────────
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: { period?: string };
}) {
  const rawPeriod = searchParams?.period ?? "all";
  const validPeriods: Period[] = ["today", "7d", "30d", "90d", "all"];
  const period = validPeriods.includes(rawPeriod as Period) ? (rawPeriod as Period) : "all";

  const { start: dateFrom, end: dateTo } = getDateRange(period);
  const prev = getPreviousPeriod(dateFrom, dateTo);

  // metrics for current period
  const [totalViews, totalClicks, totalInquiries, topProject] = await Promise.all([
    period === "all"
      ? db.project.aggregate({ _sum: { viewCount: true } })
      : db.projectView.count({ where: { createdAt: { gte: dateFrom, lt: dateTo } } }),

    db.projectClick.count({ where: { createdAt: { gte: dateFrom, lt: dateTo } } }),

    db.inquiry.count({ where: { createdAt: { gte: dateFrom, lt: dateTo } } }),

    db.project.findFirst({
      orderBy: { viewCount: "desc" },
      select: { id: true, title: true, viewCount: true },
    }),
  ]);

  // previous period metrics
  const [prevViews, prevClicks, prevInquiries] = await Promise.all([
    period === "all"
      ? db.project.aggregate({ _sum: { viewCount: true } })
      : db.projectView.count({ where: { createdAt: { gte: prev.start, lt: prev.end } } }),
    db.projectClick.count({ where: { createdAt: { gte: prev.start, lt: prev.end } } }),
    db.inquiry.count({ where: { createdAt: { gte: prev.start, lt: prev.end } } }),
  ]);

  const views = typeof totalViews === "number" ? totalViews : (totalViews._sum.viewCount ?? 0);
  const prevViewsNum = typeof prevViews === "number" ? prevViews : (prevViews._sum.viewCount ?? 0);

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const viewsGrowth = calcGrowth(views, prevViewsNum);
  const clicksGrowth = calcGrowth(totalClicks, prevClicks);
  const inquiriesGrowth = calcGrowth(totalInquiries, prevInquiries);
  const ctr = views > 0 ? ((totalClicks / views) * 100).toFixed(1) : "0";

  // monthly clicks chart
  const monthsBack = period === "all" ? 12 : Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyClicks: { month: string; count: number }[] = [];
  const now = new Date();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthNames[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    monthlyClicks.push({ month: key, count: 0 });
  }
  const clicksData = await db.projectClick.findMany({
    where: { createdAt: { gte: period === "all" ? undefined : dateFrom, lt: dateTo } },
    select: { createdAt: true },
  });
  clicksData.forEach((c) => {
    const d = new Date(c.createdAt);
    const key = monthNames[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
    const entry = monthlyClicks.find((e) => e.month === key);
    if (entry) entry.count++;
  });

  // top 5 projects comparison chart
  const topProjects = await db.project.findMany({
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, title: true },
  });

  const projectViewsData = await Promise.all(
    topProjects.map(async (p) => {
      const views: GroupedView[] = await db.projectView.groupBy({
        by: ["createdAt"],
        where: {
          projectId: p.id,
          createdAt: { gte: period === "all" ? undefined : dateFrom, lt: dateTo },
        },
        _count: true,
      });
      const monthly: Record<string, number> = {};
      views.forEach((v: GroupedView) => {
        const d = new Date(v.createdAt);
        const key = monthNames[d.getMonth()] + " " + d.getFullYear().toString().slice(-2);
        monthly[key] = (monthly[key] || 0) + v._count;
      });
      return { title: p.title, data: monthlyClicks.map((m) => ({ month: m.month, views: monthly[m.month] || 0 })) };
    })
  );

  // project table
  const projects = await db.project.findMany({
    select: { id: true, title: true, viewCount: true, _count: { select: { clicks: true } } },
    orderBy: { viewCount: "desc" },
  });

  return (
    <div className="space-y-10">
      {/* Header + date filters */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">Admin</p>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Track portfolio growth and visitor engagement.</p>
        </div>
        <div className="flex gap-2">
          {(["today", "7d", "30d", "90d", "all"] as const).map((p) => (
            <a
              key={p}
              href={`/admin/analytics?period=${p}`}
              className={`px-3 py-1.5 rounded-xl border text-sm transition ${period === p
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              {p === "today" ? "Today" : p === "all" ? "All" : p.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <CardWithGrowth title="Total Views" value={views} growth={viewsGrowth} />
        <CardWithGrowth title="Link Clicks" value={totalClicks} growth={clicksGrowth} />
        <CardWithGrowth title="Inquiries" value={totalInquiries} growth={inquiriesGrowth} />
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col justify-center">
          <p className="text-xs text-gray-500">CTR</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{ctr}%</p>
        </div>
      </div>

      {/* Top project */}
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

      {/* Clicks chart */}
      <ClicksAreaChart data={monthlyClicks} />

      {/* Comparison chart */}
      {projectViewsData.length > 0 && <ComparisonLineChart series={projectViewsData} />}

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

// ── Growth card ──
function CardWithGrowth({ title, value, growth }: { title: string; value: number; growth: number }) {
  const isPositive = growth >= 0;
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col justify-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
      <p className={`text-xs font-medium flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(growth)}% vs previous
      </p>
    </div>
  );
}