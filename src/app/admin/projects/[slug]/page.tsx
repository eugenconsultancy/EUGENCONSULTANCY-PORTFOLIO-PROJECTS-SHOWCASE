import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EditProjectForm } from "@/components/EditProjectForm";
import Link from "next/link";
import {
  Eye,
  MessageSquare,
  ThumbsUp,
  Share2,
  ExternalLink,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { deleteProjectByForm } from "@/lib/actions/projects";

export default async function EditProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const project = await db.project.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      _count: { select: { comments: true, reactions: true } },
    },
  });

  if (!project) redirect("/admin/projects");

  const viewCount = project.viewCount || 0;
  const commentCount = project._count.comments;
  const reactionCount = project._count.reactions;

  const isPublished = project.status === "PUBLISHED";

  const previewHref = `/projects/${project.slug}${!isPublished && project.previewToken
      ? `?preview=${project.previewToken}`
      : ""
    }`;

  return (
    <div className="space-y-6 pb-16">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 pt-1">
        <Link
          href="/admin"
          className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <Link
          href="/admin/projects"
          className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">
          {project.title}
        </span>
      </nav>

      {/* ── Sticky action bar ── */}
      <div className="sticky top-4 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm">

          {/* left — status + title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={[
                "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide",
                isPublished
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
              ].join(" ")}
            >
              <span
                className={[
                  "w-1.5 h-1.5 rounded-full",
                  isPublished ? "bg-emerald-500" : "bg-amber-500",
                ].join(" ")}
              />
              {project.status}
            </span>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {project.title}
            </h1>
          </div>

          {/* right — actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Preview */}
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </a>

            {/* Delete — with a confirmation wrapper pattern */}
            <form action={deleteProjectByForm}>
              <input type="hidden" name="slug" value={project.slug} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: Eye,
            label: "Views",
            value: viewCount.toLocaleString(),
            colour: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            icon: MessageSquare,
            label: "Comments",
            value: commentCount,
            colour: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
          },
          {
            icon: ThumbsUp,
            label: "Reactions",
            value: reactionCount,
            colour: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
          },
          {
            icon: Share2,
            label: "Shares",
            value: "—",
            colour: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
        ].map(({ icon: Icon, label, value, colour, bg }) => (
          <div
            key={label}
            className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
          >
            <span className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${colour}`} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit form ── */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {/* form header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-blue-500" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Edit project
          </h2>
        </div>
        <div className="p-6">
          <EditProjectForm project={project} />
        </div>
      </div>
    </div>
  );
}