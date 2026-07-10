import { db } from "@/lib/db";
import { CommentTree } from "./CommentTree";
import { CommentForm } from "./CommentForm";
import { generateMathChallenge } from "@/lib/spam";

export async function CommentSection({ projectId }: { projectId: number }) {
  const comments = await db.comment.findMany({
    where: { projectId, parentId: null, status: "APPROVED" },
    include: {
      replies: {
        where: { status: "APPROVED" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const { num1, num2, token } = generateMathChallenge();

  const totalComments = comments.length;
  // Calculate unique contributors
  const contributors = new Set(comments.map((c) => c.name)).size;

  return (
    <section className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8 transition-colors duration-200">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
            Discussion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join the conversation and share your feedback.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
            <span className="text-lg">💬</span>
            <span className="font-bold text-gray-900 dark:text-gray-200">{totalComments}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Comments</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
            <span className="text-lg">👥</span>
            <span className="font-bold text-gray-900 dark:text-gray-200">{contributors}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Contributors</span>
          </div>
        </div>
      </div>

      {/* Main Discussion Feed */}
      <div className="space-y-8">
        {comments.length > 0 ? (
          <CommentTree
            comments={comments}
            projectId={projectId}
            num1={num1}
            num2={num2}
            token={token}
          />
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {/* Form Area */}
      <div className="mt-12">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a comment</h4>
        <CommentForm projectId={projectId} num1={num1} num2={num2} token={token} />
      </div>
    </section>
  );
}