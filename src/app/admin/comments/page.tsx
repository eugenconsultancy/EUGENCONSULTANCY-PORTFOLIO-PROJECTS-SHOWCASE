import { db } from "@/lib/db";
import { CommentModeration } from "@/components/CommentModeration";

export default async function CommentsAdminPage() {
  const comments = await db.comment.findMany({
    include: { project: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = comments.filter((c) => c.status === "PENDING").length;
  const approvedCount = comments.filter((c) => c.status === "APPROVED").length;
  const spamCount = comments.filter((c) => c.status === "SPAM").length;

  return (
    <div className="space-y-10">
      {/* Header */}
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Comment Moderation</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Review and manage submitted comments.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-amber-700">Pending Review</p>
        </div>
        <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-xs text-green-700">Approved</p>
        </div>
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{spamCount}</p>
          <p className="text-xs text-red-700">Spam</p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <CommentModeration comments={comments} />
      </div>
    </div>
  );
}
