import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EditProjectForm } from "@/components/EditProjectForm";
import Link from "next/link";
import { Eye, MessageSquare, ThumbsUp, Share2, ExternalLink, Trash2 } from "lucide-react";
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

  const statusBadge =
    project.status === "PUBLISHED"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/admin/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
          Projects
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">Edit</span>
      </nav>

      {/* Sticky actions bar */}
      <div className="sticky top-20 z-30 flex items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
            {project.status}
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/projects/${project.slug}${project.status === "DRAFT" && project.previewToken ? `?preview=${project.previewToken}` : ""
              }`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </a>
          <form action={deleteProjectByForm}>
            <input type="hidden" name="slug" value={project.slug} />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">{viewCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Views</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <MessageSquare className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">{commentCount}</p>
          <p className="text-xs text-gray-500">Comments</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <ThumbsUp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">{reactionCount}</p>
          <p className="text-xs text-gray-500">Reactions</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center">
          <Share2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">—</p>
          <p className="text-xs text-gray-500">Shares</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <EditProjectForm project={project} />
      </div>
    </div>
  );
}